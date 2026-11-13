import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import type { RootState } from '@/store';
import {
  clearBet,
  setStake,
  addStake,
  setRate,
  closeMobileBetSlip,
  recordPlacedBet,
  type PlacedBet,
} from '@/store/slices/betSlice';
import { deductDemoBalance } from '@/store/slices/authSlice';
import {
  usePlaceBetMutation,
  useGetStakesetQuery,
  useGetBetHistoryQuery,
  parseStakeSetResponse,
  type PlaceBetRequest,
  type BetHistoryItem,
} from '@/store/api/marketApi';

interface BetSectionProps {
  isMobile?: boolean;
  eventId?: number | string;
}

const DEFAULT_STAKES = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 500000];

export default function BetSection({ isMobile = false, eventId }: BetSectionProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { matchId: paramMatchId } = useParams<{ matchId: string }>();
  const { pathname } = useLocation();

  const pathMatchId = pathname.startsWith('/match/')
    ? pathname.split('/match/')[1]?.split('/')[0]?.split('?')[0]
    : undefined;

  const currentEventId = eventId ?? paramMatchId ?? pathMatchId;

  const activeBet = useSelector((state: RootState) => state.bet.activeBet);
  const placedBets = useSelector((state: RootState) => state.bet.placedBets);
  const isDemoUser = useSelector((state: RootState) => state.auth.isDemoUser);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const demoBalance = useSelector((state: RootState) => state.auth.demoBalance);
  const [placeBet, { isLoading: isPlacingMutation }] = usePlaceBetMutation();
  const [isPlacingLocal, setIsPlacingLocal] = useState(false);
  const isPlacing = isPlacingMutation || isPlacingLocal;

  // Fetch open bets for current match from Bet History API
  const { data: apiBetHistory } = useGetBetHistoryQuery(
    {
      page: 1,
      limit: 50,
      betTime: 'CURRENT',
      ...(currentEventId ? { eventId: Number(currentEventId) } : {}),
    },
    {
      skip: !isAuthenticated,
      // pollingInterval: 5000,
      skipPollingIfUnfocused: true,
    }
  );

  const [activeTab, setActiveTab] = useState<'slip' | 'open'>('slip');
  const [customStakes, setCustomStakes] = useState<number[]>(DEFAULT_STAKES);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false);

  // Match-wise Open Bets: Combine API bets and local bets for current match with strict deduplication
  const openBets = useMemo(() => {
    try {
      const combined: Array<{
        id: string;
        eventId?: number | string;
        selection: string;
        userRate: number;
        amount: number;
        betType: string;
        status?: string;
      }> = [];

      const apiBets = apiBetHistory?.bets;
      const hasApiBets = Array.isArray(apiBets) && apiBets.length > 0;

      // 1. Placed bets from Bet History API (Authoritative source from server)
      if (Array.isArray(apiBets)) {
        apiBets.forEach((b: BetHistoryItem) => {
          const statusUpper = (b.status || '').toUpperCase();
          // Exclude settled bets
          if (statusUpper && statusUpper !== 'PENDING' && statusUpper !== 'OPEN') return;

          combined.push({
            id: String(b.id),
            eventId: b.eventId,
            selection: b.selection,
            userRate: Number(b.odds) || 1,
            amount: Number(b.amount) || 0,
            betType: String(b.betOn).toUpperCase() === 'BACK' ? 'Back' : 'Lay',
            status: b.status || 'Pending',
          });
        });
      }

      // Helper to check if a bet is already included (prevents duplicate when local odds slightly differed from server accepted odds)
      const isAlreadyIncluded = (item: {
        id: string;
        eventId?: number | string;
        selection: string;
        amount: number;
        betType: string;
      }) => {
        return combined.some((c) => {
          if (String(c.id) === String(item.id)) return true;
          if (
            String(c.eventId) === String(item.eventId) &&
            c.selection?.trim().toLowerCase() === item.selection?.trim().toLowerCase() &&
            c.betType?.trim().toLowerCase() === item.betType?.trim().toLowerCase() &&
            Number(c.amount) === Number(item.amount)
          ) {
            return true;
          }
          return false;
        });
      };

      // 2. Placed bets from Redux (only add if not already in API results)
      placedBets.forEach((pb) => {
        const statusUpper = (pb.status || '').toUpperCase();
        if (statusUpper && statusUpper !== 'OPEN' && statusUpper !== 'PENDING') return;

        const candidate = {
          id: String(pb.id),
          eventId: pb.eventId,
          selection: pb.runnerName,
          userRate: pb.rate,
          amount: pb.stake,
          betType: pb.betOn === 'BACK' ? 'Back' : 'Lay',
          status: pb.status || 'OPEN',
        };

        if (!isAlreadyIncluded(candidate)) {
          combined.push(candidate);
        }
      });

      // 3. Demo placed bets from localStorage (only fallback if API has no bets)
      if (isDemoUser && !hasApiBets) {
        const stored = JSON.parse(localStorage.getItem('demo_placed_bets') || '[]');
        if (Array.isArray(stored)) {
          stored.forEach((item: any) => {
            const statusUpper = (item.status || '').toUpperCase();
            if (statusUpper && statusUpper !== 'OPEN' && statusUpper !== 'PENDING') return;

            const candidate = {
              id: String(item.id),
              eventId: item.eventId,
              selection: item.selection || item.runnerName,
              userRate: Number(item.userRate || item.rate) || 1,
              amount: Number(item.amount || item.stake) || 0,
              betType: item.betType || (item.betOn === 'BACK' ? 'Back' : 'Lay'),
              status: item.status || 'OPEN',
            };

            if (!isAlreadyIncluded(candidate)) {
              combined.push(candidate);
            }
          });
        }
      }

      // 4. Match-wise filter: If on a match details page, only show this match's open bets
      if (currentEventId) {
        return combined.filter(
          (b) => String(b.eventId) === String(currentEventId)
        );
      }

      return combined;
    } catch {
      return [];
    }
  }, [apiBetHistory?.bets, placedBets, isDemoUser, currentEventId]);

  // Call Stakeset API on entering Match Details page (where BetSection mounts)
  const { data: stakesetData } = useGetStakesetQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Update custom stakes whenever stakesetData is returned from API
  useEffect(() => {
    if (stakesetData) {
      const parsed = parseStakeSetResponse(stakesetData);
      if (parsed && parsed.length > 0) {
        setCustomStakes(parsed.map((item) => item.value));
      }
    }
  }, [stakesetData]);

  // Automatically switch to bet slip tab when a new bet is selected
  useEffect(() => {
    if (activeBet) {
      setActiveTab('slip');
    }
  }, [activeBet?.selectionId, activeBet?.betOn, activeBet?.marketId]);

  // Auto-dismiss feedback after 4 seconds with smooth exit
  useEffect(() => {
    if (!feedback) {
      setShowFeedbackAnimation(false);
      return undefined;
    }

    const enterTimer = setTimeout(() => {
      setShowFeedbackAnimation(true);
    }, 10);

    const dismissTimer = setTimeout(() => {
      setShowFeedbackAnimation(false);
      setTimeout(() => setFeedback(null), 300);
    }, 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [feedback]);

  const handleDismissFeedback = () => {
    setShowFeedbackAnimation(false);
    setTimeout(() => setFeedback(null), 300);
  };

  // Clear feedback when bet changes
  useEffect(() => {
    setFeedback(null);
  }, [activeBet?.selectionId, activeBet?.betOn]);

  // Handle odds step change (+ / -)
  const handleOddsStep = (delta: number) => {
    if (!activeBet) return;
    const currentRate = activeBet.rate || 1;
    const step = currentRate <= 2 ? 0.01 : 1;
    const nextRate = Math.max(1, Number((currentRate + delta * step).toFixed(2)));
    dispatch(setRate(nextRate));
  };

  // Calculate Profit and Liability
  const stake = activeBet?.stake || 0;
  const rate = activeBet?.rate || 0;
  const isFancy = activeBet?.marketType === 'FANCY';
  const isBack = activeBet?.betOn === 'BACK';

  let profit = 0;
  if (stake > 0) {
    if (isFancy) {
      const pct = (activeBet?.fancyPercentage || 100) / 100;
      profit = isBack ? stake * pct : stake;
    } else {
      const oddsMultiplier = rate > 10 ? rate / 100 : Math.max(0, rate - 1);
      profit = isBack ? stake * oddsMultiplier : stake;
    }
  }

  // Handle Bet Placement
  const handlePlaceBet = async () => {
    if (!activeBet || isPlacing) return;

    if (stake <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid stake amount.' });
      return;
    }

    if (isDemoUser && stake > demoBalance) {
      setFeedback({
        type: 'error',
        message: `Insufficient balance! Your demo balance is ${demoBalance.toFixed(2)}.`,
      });
      return;
    }

    if (activeBet.minBet && stake < activeBet.minBet) {
      setFeedback({
        type: 'error',
        message: `Minimum stake for this market is ${activeBet.minBet}.`,
      });
      return;
    }

    if (activeBet.maxBet && stake > activeBet.maxBet) {
      setFeedback({
        type: 'error',
        message: `Maximum stake for this market is ${activeBet.maxBet}.`,
      });
      return;
    }

    // Validate minimum and maximum bet rate dynamically
    if (activeBet.minRate !== undefined && activeBet.maxRate !== undefined) {
      if (activeBet.rate < activeBet.minRate || activeBet.rate > activeBet.maxRate) {
        setFeedback({
          type: 'error',
          message: `Bet rate must be between ${activeBet.minRate} and ${activeBet.maxRate}.`,
        });
        return;
      }
    } else if (activeBet.minRate !== undefined && activeBet.rate < activeBet.minRate) {
      setFeedback({
        type: 'error',
        message: `Bet rate must be at least ${activeBet.minRate}.`,
      });
      return;
    } else if (activeBet.maxRate !== undefined && activeBet.rate > activeBet.maxRate) {
      setFeedback({
        type: 'error',
        message: `Bet rate cannot exceed ${activeBet.maxRate}.`,
      });
      return;
    }

    const payload: PlaceBetRequest = {
      eventId: activeBet.eventId,
      marketId: activeBet.marketId,
      marketName: activeBet.marketName,
      marketCategory: activeBet.marketCategory || 'wpmaket',
      marketType: activeBet.marketType,
      selectionId: activeBet.selectionId,
      runnerName: activeBet.runnerName,
      stake: activeBet.stake,
      rate: activeBet.rate,
      position: activeBet.position ?? 0,
      fancyPercentage: activeBet.fancyPercentage ?? 0,
      betOn: activeBet.betOn,
      acceptOddsChange: 'false',
    };

    setIsPlacingLocal(true);
    const startTime = Date.now();

    // If demo user: handle demo placement directly with instant feedback and balance deduction
    if (isDemoUser) {
      setFeedback(null);
      let serverBet: any = null;
      try {
        const res = await placeBet(payload).unwrap();
        if (res && (res as any).bet) {
          serverBet = (res as any).bet;
        }
      } catch {
        // If server rejects mock demo token or network is unavailable, demo still places locally
      }

      // Ensure loader spins visibly for ~1.2s matching realistic exchange experience
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise((r) => setTimeout(r, 1200 - elapsed));
      }

      const betId = serverBet?.id ? String(serverBet.id) : String(Date.now());
      const actualRate = serverBet?.odds ? Number(serverBet.odds) : activeBet.rate;

      const liabilityAmount = Number(
        (isBack
          ? activeBet.stake
          : activeBet.stake * (actualRate > 10 ? actualRate / 100 : Math.max(0, actualRate - 1))
        ).toFixed(2)
      );

      const potentialProfitAmount = Number(profit.toFixed(2));

      dispatch(
        deductDemoBalance({
          stake: activeBet.stake,
          liability: liabilityAmount,
        })
      );

      // Save demo bet to history with real server bet id and odds, replacing any duplicate
      try {
        const newBet = {
          id: betId,
          eventId: activeBet.eventId || (currentEventId ? Number(currentEventId) : 0),
          status: 'OPEN',
          placeDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          sportName: 'Cricket',
          eventName: activeBet.eventName,
          market: activeBet.marketName,
          betType: activeBet.betOn === 'BACK' ? 'Back' : 'Lay',
          selection: activeBet.runnerName,
          userRate: actualRate,
          amount: activeBet.stake,
          liability: liabilityAmount,
          potentialProfit: potentialProfitAmount,
        };
        const prevBets = JSON.parse(localStorage.getItem('demo_placed_bets') || '[]');
        const filteredPrev = Array.isArray(prevBets)
          ? prevBets.filter(
              (b: any) =>
                String(b.id) !== betId &&
                !(
                  String(b.eventId) === String(newBet.eventId) &&
                  b.selection?.trim().toLowerCase() === newBet.selection.trim().toLowerCase() &&
                  String(b.betType).toUpperCase() === String(newBet.betType).toUpperCase() &&
                  Number(b.amount) === Number(newBet.amount)
                )
            )
          : [];
        localStorage.setItem('demo_placed_bets', JSON.stringify([newBet, ...filteredPrev]));
      } catch {}

      const placedBetItem: PlacedBet = {
        id: betId,
        eventId: activeBet.eventId,
        eventName: activeBet.eventName,
        marketId: String(activeBet.marketId),
        marketName: activeBet.marketName,
        marketCategory: activeBet.marketCategory,
        marketType: activeBet.marketType,
        selectionId: String(activeBet.selectionId),
        runnerName: activeBet.runnerName,
        betOn: activeBet.betOn,
        rate: actualRate,
        stake: activeBet.stake,
        position: activeBet.position,
        fancyPercentage: activeBet.fancyPercentage,
        status: 'OPEN',
        placedAt: new Date().toISOString(),
      };

      setIsPlacingLocal(false);
      dispatch(recordPlacedBet(placedBetItem));
      dispatch(clearBet());
      setFeedback({
        type: 'success',
        message: 'Bet placed successfully!',
      });

      setTimeout(() => {
        setFeedback(null);
      }, 2500);
      return;
    }

    try {
      setFeedback(null);
      const res = await placeBet(payload).unwrap();

      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise((r) => setTimeout(r, 1200 - elapsed));
      }

      setIsPlacingLocal(false);
      if (res.success) {
        const serverBet = (res as any)?.bet;
        const betId = serverBet?.id ? String(serverBet.id) : String(Date.now());
        const actualRate = serverBet?.odds ? Number(serverBet.odds) : activeBet.rate;

        const placedBetItem: PlacedBet = {
          id: betId,
          eventId: activeBet.eventId,
          eventName: activeBet.eventName,
          marketId: String(activeBet.marketId),
          marketName: activeBet.marketName,
          marketCategory: activeBet.marketCategory,
          marketType: activeBet.marketType,
          selectionId: String(activeBet.selectionId),
          runnerName: activeBet.runnerName,
          betOn: activeBet.betOn,
          rate: actualRate,
          stake: activeBet.stake,
          position: activeBet.position,
          fancyPercentage: activeBet.fancyPercentage,
          status: 'OPEN',
          placedAt: new Date().toISOString(),
        };

        dispatch(recordPlacedBet(placedBetItem));
        dispatch(clearBet());
        setFeedback({
          type: 'success',
          message: res.message || 'Bet placed successfully!',
        });
        setTimeout(() => {
          setFeedback(null);
        }, 2500);
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Failed to place bet.',
        });
      }
    } catch (err: unknown) {
      setIsPlacingLocal(false);
      const apiErr = err as { data?: { message?: string }; message?: string };
      const message =
        apiErr?.data?.message || apiErr?.message || 'Error placing bet. Please try again.';
      setFeedback({ type: 'error', message });
    }
  };

  const handleClose = () => {
    if (isMobile) {
      dispatch(closeMobileBetSlip());
    } else {
      dispatch(clearBet());
    }
  };

  return (
    <>
      {/* Floating Animated Feedback Banner in Center of Main Section (Smooth Slide-Down from Top) */}
      {feedback &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed top-16 z-[100] max-w-[92vw] sm:max-w-lg transition-all duration-300 ease-out transform pointer-events-auto
              left-1/2 -translate-x-1/2 lg:left-[calc(50%-160px)] xl:left-[calc(50%-50px)]
              ${
                showFeedbackAnimation
                  ? 'translate-y-0 opacity-100 scale-100'
                  : '-translate-y-8 opacity-0 scale-95 pointer-events-none'
              }
            `}
          >
            <div
              className={`flex items-center justify-between gap-3 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xl border ${
                feedback.type === 'success'
                  ? 'bg-[#107c41] border-green-400/40 shadow-green-950/60'
                  : 'bg-[#d90429] border-red-400/40 shadow-red-950/60'
              }`}
            >
              <span className="flex-1 text-center font-bold tracking-wide">{feedback.message}</span>
              <button
                type="button"
                onClick={handleDismissFeedback}
                className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-xs font-bold active:scale-90"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}

      <section className="w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1c3d] via-[#09152e] to-black p-2.5 text-white shadow-2xl">
      {/* Tab Switcher: Bet Slip (Blue background) and OPEN BETS (0) */}
      <div className="mb-2.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('slip')}
          className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-bold transition shadow ${
            activeTab === 'slip'
              ? 'bg-blue-600 text-white'
              : 'border border-white/20 bg-black/60 text-white/60 hover:text-white'
          }`}
        >
          Bet Slip
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('open')}
          className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-bold transition shadow ${
            activeTab === 'open'
              ? 'border border-blue-400 bg-blue-600 text-white'
              : 'border border-white/20 bg-black/60 text-white/80 hover:text-white'
          }`}
        >
          OPEN BETS ({openBets.length})
        </button>
      </div>

      {/* Tab Content: OPEN BETS */}
      {activeTab === 'open' && (
        <div className="min-h-[260px] space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-lg bg-black px-4 py-2.5 text-xs sm:text-sm font-bold text-white">
            <span className="text-left">Matched Bet</span>
            <span className="w-16 text-center">Odds</span>
            <span className="w-16 text-center">Stake</span>
          </div>
          {openBets.length === 0 ? (
            <div className="flex min-h-[160px] items-start justify-center pt-10">
              <p className="text-xs sm:text-sm font-semibold text-white/60">No Bets Available</p>
            </div>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-0.5">
              {openBets.map((bet) => {
                const isLay = bet.betType?.toLowerCase() === 'lay';
                return (
                  <div
                    key={bet.id}
                    className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl px-4 py-2.5 shadow-sm transition-colors ${
                      isLay
                        ? 'bg-[#f994ba] text-black'
                        : 'bg-[#72bbef] text-black'
                    }`}
                  >
                    <span className="truncate text-xs sm:text-sm font-semibold text-black">
                      {bet.selection}
                    </span>
                    <span className="w-16 text-center text-xs sm:text-sm font-semibold text-black">
                      {bet.userRate}
                    </span>
                    <span className="w-16 text-center text-xs sm:text-sm font-semibold text-black">
                      {bet.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: BET SLIP */}
      {activeTab === 'slip' && (
        <div>
          {!activeBet ? (
            <div className="flex min-h-[160px] items-start justify-center pt-10">
              <p className="text-xs sm:text-sm font-semibold text-white/60">No Bets Available</p>
            </div>
          ) : (
            <div>
              {/* Outer Sky Blue Card Container */}
              <div className="relative overflow-hidden rounded-2xl bg-[#5daeed] p-2 shadow-xl">
                {/* Spinning Circular Dots Loader & Dark Overlay while placing bet (matching reference image) */}
                {isPlacing && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/45 backdrop-blur-[0.5px]">
                    <svg
                      className="h-12 w-12 animate-spin text-white drop-shadow-md"
                      viewBox="0 0 48 48"
                      fill="currentColor"
                    >
                      <circle cx="24" cy="9" r="3.2" opacity="0.15" />
                      <circle cx="34.6" cy="13.4" r="3.2" opacity="0.25" />
                      <circle cx="39" cy="24" r="3.2" opacity="0.4" />
                      <circle cx="34.6" cy="34.6" r="3.2" opacity="0.55" />
                      <circle cx="24" cy="39" r="3.2" opacity="0.7" />
                      <circle cx="13.4" cy="34.6" r="3.2" opacity="0.85" />
                      <circle cx="9" cy="24" r="3.2" opacity="0.95" />
                      <circle cx="13.4" cy="13.4" r="3.2" opacity="1.0" />
                    </svg>
                  </div>
                )}
                {/* Header with Match & Runner Name + White Circle Close Button */}
                <div className="flex items-center justify-between pb-1.5 px-1 text-white">
                  <div className="min-w-0 pr-2">
                    <h4 className="truncate text-xs sm:text-sm font-bold text-white leading-tight">
                      {activeBet.eventName}
                    </h4>
                    <p className="truncate text-[11px] sm:text-xs font-medium text-white/95">
                      {activeBet.runnerName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-gray-100 transition active:scale-90"
                    title="Close Bet Slip"
                  >
                    <IoClose className="text-base font-bold text-black" />
                  </button>
                </div>

                {/* Inner White Card (Exact replica of reference image) */}
                <div className="rounded-xl bg-white p-3 shadow space-y-2.5 text-black">
                  {/* Odds Value Stepper & Amount Input */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Odds Value */}
                    <div>
                      <span className="block text-xs font-semibold text-gray-600 mb-1">
                        Odds Value
                        {activeBet.minRate !== undefined && activeBet.maxRate !== undefined && (
                          <span className="ml-1 text-[10px] text-gray-400 font-normal">
                            ({activeBet.minRate} - {activeBet.maxRate})
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOddsStep(-1)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d90429] hover:bg-[#b90322] text-white font-bold text-lg leading-none shadow transition active:scale-90"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          step="any"
                          value={activeBet.rate}
                          onChange={(e) => dispatch(setRate(Math.max(0, Number(e.target.value))))}
                          className="w-12 text-center text-base font-bold text-black focus:outline-none select-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleOddsStep(1)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d90429] hover:bg-[#b90322] text-white font-bold text-lg leading-none shadow transition active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="w-32">
                      <span className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                        Amount
                      </span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={activeBet.stake || ''}
                        onChange={(e) =>
                          dispatch(setStake(Math.max(0, Number(e.target.value) || 0)))
                        }
                        className="w-full rounded-full border border-gray-300 bg-gray-50/70 px-3 py-1 text-right text-sm font-bold text-black shadow-inner placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Quick Stake Buttons (4 columns, pink/rose pill buttons) */}
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    {customStakes.map((stakeVal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => dispatch(addStake(stakeVal))}
                        className="rounded-full bg-[#ea7a8f] hover:bg-[#e0687e] py-1 text-xs font-bold text-black shadow-sm transition hover:brightness-105 active:scale-95"
                      >
                        {stakeVal}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons: MIN STAKE (yellow), MAX STAKE (blue), EDIT STAKE (green), CLEAR (red) */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => dispatch(setStake(activeBet.minBet ?? 100))}
                      className="flex h-7 items-center justify-center rounded-full bg-[#f1b434] hover:bg-[#d99b24] px-0.5 text-center text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold tracking-tight uppercase text-black shadow-sm transition active:scale-95 whitespace-nowrap"
                    >
                      MIN STAKE
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setStake(activeBet.maxBet ?? 10000))}
                      className="flex h-7 items-center justify-center rounded-full bg-[#0052cc] hover:bg-[#0041a3] px-0.5 text-center text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold tracking-tight uppercase text-white shadow-sm transition active:scale-95 whitespace-nowrap"
                    >
                      MAX STAKE
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/stake-settings')}
                      className="flex h-7 items-center justify-center rounded-full bg-[#107c41] hover:bg-[#0c6233] px-0.5 text-center text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold tracking-tight uppercase text-white shadow-sm transition active:scale-95 whitespace-nowrap"
                    >
                      EDIT STAKE
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(setStake(0))}
                      className="flex h-7 items-center justify-center rounded-full bg-[#d90429] hover:bg-[#b90322] px-0.5 text-center text-[8px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold tracking-tight uppercase text-white shadow-sm transition active:scale-95 whitespace-nowrap"
                    >
                      CLEAR
                    </button>
                  </div>

                  {/* Profit / Loss & Total Calculation */}
                  <div className="pt-1.5 space-y-1 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-tight">
                        YOUR PROFIT/LOSS AS PER PLACED BET
                      </span>
                      <span className="shrink-0 text-right text-xs sm:text-sm font-bold text-[#10b981]">
                        {profit > 0 ? profit.toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-tight">
                        TOTAL AMOUNT (IN PTS)
                      </span>
                      <span className="shrink-0 text-right text-xs sm:text-sm font-bold text-black">
                        {stake > 0 ? stake.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Bet Button */}
              <button
                type="button"
                disabled={isPlacing || stake <= 0}
                onClick={handlePlaceBet}
                className="mt-2.5 w-full rounded-lg bg-[#107c41] hover:bg-[#0c6233] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Place Bet
              </button>
            </div>
          )}
        </div>
      )}
      </section>
    </>
  );
}
