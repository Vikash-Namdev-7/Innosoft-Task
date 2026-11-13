import { Link, useParams } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { BarChart2, Tv } from 'lucide-react';
import pinIcon from '/images/sportImages/imgi_21_pin.png';

import {
  useGetCatalogueQuery,
  useGetScorecardQuery,
  useGetStakesetQuery,
  useGetBooksetCalculationQuery,
  type Runner,
  type BooksetSelection,
} from '@/store/api/marketApi';
import { useState, useMemo } from 'react';
import { usePriceDropBlink } from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { selectBet } from '@/store/slices/betSlice';
import type { RootState } from '@/store';
import BetSection from '@/components/markets/BetSection';
import {
  calculateMarketExposures,
  formatExposure,
  getExposureColorClass,
} from '@/utils';

import FancyMarketSection from '@/components/markets/FancyMarketSection';

// Convert API date into Indian time and date
function formatTime(value: string) {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return { time: 'Time unavailable', date: '' };
  }

  return {
    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }),
    date: date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }),
  };
}

// Format odds size
function formatSize(size?: number) {
  if (size == null) return '';

  if (size >= 1000) {
    const k = size / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }

  return String(size);
}

// Odds Cell Component
function OddsCell({
  runner,
  type,
  index,
  isSuspended = false,
  className = '',
  onSelect,
}: {
  runner: Runner;
  type: 'back' | 'lay';
  index: number;
  isSuspended?: boolean;
  className?: string;
  onSelect?: (price: number) => void;
}) {
  const odds = type === 'back' ? runner.back : runner.lay;

  const rawPrice =
    odds?.[index]?.price ??
    (index === 0
      ? type === 'back'
        ? runner.backPrice1
        : runner.layPrice1
      : index === 1
        ? type === 'back'
          ? runner.backPrice2
          : runner.layPrice2
        : type === 'back'
          ? runner.backPrice3
          : runner.layPrice3);

  const rawSize =
    odds?.[index]?.size ??
    (index === 0
      ? type === 'back'
        ? runner.backSize1
        : runner.laySize1
      : index === 1
        ? type === 'back'
          ? runner.backSize2
          : runner.laySize2
        : type === 'back'
          ? runner.backSize3
          : runner.laySize3);

  // When only index 2 is shown on small screen, if lay has no layPrice3, fallback to available lay price (e.g. layPrice1 for Bookmaker)
  const price = rawPrice ?? (type === 'lay' && index === 2 ? runner.layPrice1 : undefined);
  const size = rawSize ?? (type === 'lay' && index === 2 ? runner.laySize1 : undefined);

  const unavailable = isSuspended || price == null || runner.status !== 'ACTIVE';

  const isBlinking = !isSuspended && usePriceDropBlink(price);

  // When suspended, use dark slate/charcoal capsules with tint matching reference
  const suspendedBgColor =
    type === 'back' ? 'bg-[#293745]' : 'bg-[#3b2a32]';

  const bgColor = isSuspended
    ? suspendedBgColor
    : unavailable
      ? type === 'back'
        ? 'bg-[#72bbef]/50'
        : 'bg-[#f994ba]/50'
      : type === 'back'
        ? 'bg-[#72bbef]'
        : 'bg-[#f994ba]';

  const activeBgColor = isBlinking
    ? 'bg-[#facc15] animate-odds-blink text-black'
    : bgColor;

  return (
    <div
      onClick={() => {
        if (!unavailable && price != null) {
          onSelect?.(price);
        }
      }}
      className={`h-8 min-w-0 flex-1 flex-col items-center justify-center rounded-full transition-colors duration-300 ${
        unavailable ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-110 active:scale-95'
      } ${activeBgColor} ${className}`}
    >
      {unavailable ? (
        <FaLock className={`text-[10px] ${isSuspended ? 'text-gray-400' : 'text-gray-600'}`} />
      ) : (
        <>
          <span className="text-xs sm:text-[13px] font-bold leading-tight text-black">{price}</span>

          <span className="text-[9px] font-normal leading-tight text-black">{formatSize(size)}</span>
        </>
      )}
    </div>
  );
}



// Market Header Component
function MarketHeader({
  title,
  minBetAmount,
  maxBetAmount,
  isSuspended = false,
}: {
  title: string;
  minBetAmount?: number;
  maxBetAmount?: number;
  isSuspended?: boolean;
}) {
  return (
    <>
      <div className="rounded-t-2xl border bg-white">
        <div className="flex h-9 items-center justify-between rounded-2xl border border-blue-400 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
              <img src={pinIcon} alt="" />
            </span>

            <h2 className="min-w-0 truncate text-xs font-bold uppercase sm:text-sm">
              {title}
            </h2>

            {isSuspended ? (
              <span className="rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider sm:text-xs">
                SUSPENDED
              </span>
            ) : (
              <span className="rounded bg-[#387a38] px-1.5 py-0.5 text-[10px] font-bold text-[#bbf7d0] sm:text-xs">
                CASHOUT
              </span>
            )}
          </div>

          <span className="shrink-0 text-[10px] font-bold tracking-wider text-white sm:text-xs">
            MIN:{minBetAmount ?? 100} MAX:{maxBetAmount ? formatSize(maxBetAmount) : '10K'}
          </span>
        </div>
      </div>

      <div className="flex h-7 items-center justify-between rounded-b-xl bg-white px-3 text-[11px] font-semibold text-black sm:text-xs">
        <span className="min-w-0 flex-1">Market</span>

        <div className="flex shrink-0 items-center justify-around w-[114px] sm:w-[124px] md:w-[48%] md:sm:w-[50%] text-center">
          <span className="flex-1 text-center font-bold">Back</span>
          <span className="flex-1 text-center font-bold">Lay</span>
        </div>
      </div>
    </>
  );
}

// Market Runners Component
function MarketSection({
  title,
  marketId,
  eventId,
  runners,
  minBetAmount,
  maxBetAmount,
  marketStatus,
  matchStatus,
  booksetSelections,
  onSelectOdds,
}: {
  title: string;
  marketId?: string;
  eventId?: number | string;
  runners: Runner[];
  minBetAmount?: number;
  maxBetAmount?: number;
  marketStatus?: string;
  matchStatus?: string;
  booksetSelections?: BooksetSelection[];
  onSelectOdds?: (runner: Runner, type: 'back' | 'lay', price: number) => void;
}) {
  const activeBet = useSelector((state: RootState) => state.bet.activeBet);
  const placedBets = useSelector((state: RootState) => state.bet.placedBets);
  const sortedRunners = [...runners].sort(
    (a, b) => (a.sortPriority ?? a.selectionId) - (b.sortPriority ?? b.selectionId)
  );

  const isBookmaker = title.toUpperCase().includes('BOOKMAKER');
  const hasSuspendedRunner = runners.some(
    (r) => r.status?.toUpperCase() === 'SUSPENDED'
  );

  const isMarketSuspended =
    matchStatus?.toUpperCase() === 'SUSPENDED' ||
    marketStatus?.toUpperCase() === 'SUSPENDED';

  // Dynamic exposure calculation for all runners in this market (persisting placed bets until settled)
  const { exposures, hasExposure } = useMemo(() => {
    return calculateMarketExposures({
      backendSelections: booksetSelections,
      allRunners: runners,
      unsettledBets: placedBets,
      proposedBets: activeBet,
      currentMarketId: marketId,
    });
  }, [booksetSelections, runners, placedBets, activeBet, marketId]);

  return (
    <section className="min-w-0">
      <MarketHeader
        title={title}
        minBetAmount={minBetAmount}
        maxBetAmount={maxBetAmount}
        isSuspended={isMarketSuspended}
      />

      <div className="mt-1 space-y-1">
        {sortedRunners.map((runner) => {
          const isRunnerSuspended =
            isMarketSuspended ||
            runner.status?.toUpperCase() === 'SUSPENDED' ||
            (Boolean(runner.status) && runner.status.toUpperCase() !== 'ACTIVE');

          const isSelectedForBet =
            Boolean(activeBet) &&
            String(activeBet?.selectionId) === String(runner.selectionId) &&
            (marketId ? activeBet?.marketId === marketId : true);

          const runnerExposure = exposures[String(runner.selectionId)];

          return (
            <div key={runner.selectionId} className="w-full">
              <div className="flex min-h-9 items-center justify-between gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black">
                <div className="flex min-w-0 flex-1 items-center justify-between gap-1 pl-1 pr-1.5 sm:pr-2">
                  <span className="truncate text-[11px] font-semibold sm:text-xs">
                    {runner.runnerName}
                  </span>
                  {hasExposure && runnerExposure !== undefined && (
                    <span
                      className={`shrink-0 text-xs sm:text-sm font-bold tabular-nums tracking-tight ${getExposureColorClass(runnerExposure)}`}
                    >
                      {formatExposure(runnerExposure)}
                    </span>
                  )}
                </div>

                {/* Odds container: when suspended, renders full-width pill across all odds matching reference */}
                {isRunnerSuspended ? (
                  <div className="flex shrink-0 items-center w-[114px] sm:w-[124px] md:w-[48%] md:sm:w-[50%]">
                    <div className="flex h-8 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#303e48] via-[#3c3a43] to-[#4a393f] text-white font-bold text-[11px] sm:text-xs tracking-widest uppercase select-none shadow-inner">
                      SUSPENDED
                    </div>
                  </div>
                ) : (
                  <div className="relative flex shrink-0 items-center gap-1 w-[114px] sm:w-[124px] md:w-[48%] md:sm:w-[50%]">
                    {/* Back Odds */}
                    <div className="flex flex-1 min-w-0 gap-0.5 justify-end">
                      {[0, 1, 2].map((index) => (
                        <OddsCell
                          key={index}
                          runner={runner}
                          type="back"
                          index={index}
                          className={index !== 2 ? 'hidden md:flex' : 'flex'}
                          onSelect={(price) => onSelectOdds?.(runner, 'back', price)}
                        />
                      ))}
                    </div>

                    {/* Lay Odds */}
                    <div className="flex flex-1 min-w-0 gap-0.5 justify-start">
                      {[0, 1, 2].map((index) => (
                        <OddsCell
                          key={index}
                          runner={runner}
                          type="lay"
                          index={index}
                          className={index !== 0 ? 'hidden md:flex' : 'flex'}
                          onSelect={(price) => onSelectOdds?.(runner, 'lay', price)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline Bet Section directly under the clicked runner on small screens (< lg) */}
              {isSelectedForBet && (
                <div className="my-1.5 w-full lg:hidden">
                  <BetSection isMobile eventId={eventId} />
                </div>
              )}
            </div>
          );
        })}

        {sortedRunners.length === 0 && (
          <p className="rounded-xl bg-[#151515] p-4 text-center text-xs text-gray-400">
            No runners available for this market.
          </p>
        )}
      </div>
    </section>
  );
}



// Main Match Details Component
export default function MatchDetails() {
  const dispatch = useDispatch();
  const activeBet = useSelector((state: RootState) => state.bet.activeBet);
  
  const { matchId } = useParams<{ matchId: string }>();

  // Fetch catalogue details using fixture ID
  const { data, isLoading, isError, error } = useGetCatalogueQuery(matchId!, {
    skip: !matchId,
    pollingInterval: 2000,
    skipPollingIfUnfocused: true,
  });

  // Fetch scorecard / Live TV URLs
  const { data: scorecardData } = useGetScorecardQuery(matchId!, {
    skip: !matchId,
  });

  // Fetch Stakeset automatically on entering Match Details page
  useGetStakesetQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Fetch Bookset Calculation API for current event
  const { data: booksetData } = useGetBooksetCalculationQuery(
    Number(matchId) || matchId!,
    {
      skip: !matchId,
      // pollingInterval: 5000,
      skipPollingIfUnfocused: true,
    }
  );

  // Active widget tab: 'odds' (default, content collapsed), 'scorecard', or 'tv'
  const [activeWidgetTab, setActiveWidgetTab] = useState<'odds' | 'scorecard' | 'tv'>('odds');

  // Get actual catalogue data from API
  const match = data?.catalogue;
  const betConfig = data?.betConfig;

  // Get all market groups
  const markets = Object.entries(match?.markets ?? {});

  const FancyMarket = match?.fancyMarkets ?? {};

  // Scorecard & Live TV URLs
  const scorecardUrl = scorecardData?.scorecardUrl ?? null;
  const liveTvUrl = scorecardData?.liveTvUrl ?? null;
  


  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-black p-4 text-center text-white">
        Loading match details...
      </main>
    );
  }

  // Error State
  if (isError || !match) {
    return (
      <main className="min-h-screen bg-black p-3 text-white">
        <Link
          to="/sport/inplay"
          className="mb-3 inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white"
        >
          <FaArrowLeft />
          Back to matches
        </Link>

        <p className="rounded-xl bg-[#151515] p-4 text-center text-xs">
          Unable to load match details. Please try again.
        </p>
      </main>
    );
  }

  const { time, date } = formatTime(match.startTime);

  return (
    <main className="min-h-screen w-full min-w-0 bg-black p-2 text-white">
      {/* Match Information */}
      <div className="mb-2 flex min-w-0 items-center gap-3 rounded-xl bg-[#111111] px-3 py-2">
        <div className="rounded-lg bg-blue-600 px-3 py-1.5 shadow-sm">
          <h1 className="max-w-[280px] truncate text-xs font-bold text-white sm:max-w-none sm:text-sm">
            {match.eventName}
          </h1>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold uppercase text-white sm:text-sm">{time}</span>
          <span className="text-[11px] text-gray-300 sm:text-xs">{date}</span>
        </div>
      </div>

      {/* Widget Tabs Box: ODDS / Scorecard / Live TV (visible when right sidebar collapses) */}
      <div className="mb-2 overflow-hidden rounded-lg border border-blue-600 bg-black lg:hidden">
        {/* 3 Tabs Row */}
        <div className={`grid grid-cols-3 ${activeWidgetTab !== 'odds' ? 'border-b border-blue-600' : ''}`}>
          <button
            type="button"
            onClick={() => setActiveWidgetTab('odds')}
            className={`flex h-9 items-center justify-center border-r border-blue-600 text-xs font-bold uppercase tracking-wider transition-colors sm:h-10 sm:text-sm ${
              activeWidgetTab === 'odds'
                ? 'bg-blue-600 text-white'
                : 'bg-black text-white hover:bg-white/10'
            }`}
          >
            ODDS
          </button>

          <button
            type="button"
            onClick={() => setActiveWidgetTab(activeWidgetTab === 'scorecard' ? 'odds' : 'scorecard')}
            className={`flex h-9 items-center justify-center border-r border-blue-600 transition-colors sm:h-10 ${
              activeWidgetTab === 'scorecard'
                ? 'bg-blue-600 text-white'
                : 'bg-black text-white hover:bg-white/10'
            }`}
            title="Scorecard"
          >
            <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveWidgetTab(activeWidgetTab === 'tv' ? 'odds' : 'tv')}
            className={`flex h-9 items-center justify-center transition-colors sm:h-10 ${
              activeWidgetTab === 'tv'
                ? 'bg-blue-600 text-white'
                : 'bg-black text-white hover:bg-white/10'
            }`}
            title="Live TV"
          >
            <Tv className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Content: Scorecard */}
        {activeWidgetTab === 'scorecard' && (
          <div className="bg-black">
            {scorecardUrl ? (
              <iframe
                src={scorecardUrl}
                title="Scorecard"
                className="h-[280px] w-full border-none sm:h-[380px] md:h-[480px]"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="flex h-32 items-center justify-center text-xs font-semibold text-white sm:text-sm">
                Live score unavailable
              </div>
            )}
          </div>
        )}

        {/* Content: Live TV */}
        {activeWidgetTab === 'tv' && (
          <div className="bg-black">
            {liveTvUrl ? (
              <iframe
                src={liveTvUrl}
                title="Live TV"
                className="h-[280px] w-full border-none sm:h-[380px] md:h-[480px] lg:h-[540px]"
                allow="autoplay; encrypted-media"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-32 items-center justify-center text-xs font-semibold text-white sm:text-sm">
                Live stream unavailable
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Markets & Fancy Markets (visible when ODDS tab is active on mobile, or always on desktop where right sidebar is open) */}
      <div className={activeWidgetTab !== 'odds' ? 'hidden lg:block space-y-3' : 'space-y-3'}>
        <div className="space-y-3">
          {markets.map(([marketGroupName, marketList]) =>
            marketList.map((market, index) => {
              const isBookmaker = (market.marketName || marketGroupName)
                .toLowerCase()
                .includes('bookmaker');
              const defaultMin =
                isBookmaker && betConfig?.bookmakerMinBetAmount
                  ? Number(betConfig.bookmakerMinBetAmount)
                  : betConfig?.minBetAmount
                    ? Number(betConfig.minBetAmount)
                    : 100;
              const defaultMax =
                isBookmaker && betConfig?.bookmakerMaxBetAmount
                  ? Number(betConfig.bookmakerMaxBetAmount)
                  : betConfig?.maxBetAmount
                    ? Number(betConfig.maxBetAmount)
                    : 10000;

              // Compute dynamic rate limits 
              const defaultMinRate = 
                isBookmaker && betConfig?.bookmakerMinRate
                  ? Number(betConfig.bookmakerMinRate)
                  : betConfig?.minRate
                    ? Number(betConfig.minRate)
                    : undefined;


              const defaultMaxRate = 
                isBookmaker && betConfig?.bookmakerMaxRate
                  ? Number(betConfig.bookmakerMaxRate)
                  : betConfig?.maxRate
                    ? Number(betConfig.maxRate)
                    : undefined;

              const marketMinRate = 
                market.minRate != null ? Number(market.minRate) : defaultMinRate
              
              const marketMaxRate = 
                market.maxRate != null ? Number(market.maxRate) : defaultMaxRate

              // Match market with Bookset API response
              const matchingBooksetMarket = booksetData?.find((bm) => {
                if (bm.marketId != null && market.marketId != null) {
                  if (String(bm.marketId) === String(market.marketId)) {
                    return true;
                  }
                }
                if (bm.marketExternalId) {
                  const ext = bm.marketExternalId.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const mName = (market.marketName || marketGroupName).toLowerCase().replace(/[^a-z0-9]/g, '');
                  if (ext === mName) return true;
                }
                return false;
              });

              return (
                <MarketSection
                  key={market.marketId || `${marketGroupName}-${index}`}
                  eventId={matchId}
                  marketId={market.marketId}
                  title={market.marketName || marketGroupName}
                  runners={market.runners ?? []}
                  minBetAmount={market.minBetAmount ?? defaultMin}
                  maxBetAmount={market.maxBetAmount ?? defaultMax}
                  marketStatus={market.status}
                  matchStatus={match.status}
                  booksetSelections={matchingBooksetMarket?.selections}
                  onSelectOdds={(runner, type, price) => {
                    dispatch(
                      selectBet({
                        eventId: Number(matchId),
                        eventName: match.eventName,
                        marketId: market.marketId,
                        marketName: market.marketName || marketGroupName,
                        marketCategory: market.type || 'wpmaket',
                        marketType: (market.marketName || marketGroupName)
                          .toUpperCase()
                          .includes('BOOKMAKER')
                          ? 'BOOKMAKER'
                          : 'NORMAL',
                        selectionId: String(runner.selectionId),
                        runnerName: runner.runnerName,
                        betOn: type === 'back' ? 'BACK' : 'LAY',
                        rate: price,
                        stake: 0,
                        position: 0,
                        fancyPercentage: 0,
                        minBet: market.minBetAmount ?? defaultMin,
                        maxBet: market.maxBetAmount ?? defaultMax,
                        minRate: marketMinRate,
                        maxRate: marketMaxRate,
                      })
                    );
                  }}
                />
              );
            })
          )}

          {markets.length === 0 && (
            <p className="rounded-xl bg-[#151515] p-4 text-center text-xs text-gray-400">
              No markets available for this match.
            </p>
          )}
        </div>
        <FancyMarketSection
          fancyMarkets={FancyMarket}
          eventId={Number(matchId)}
          eventName={match.eventName}
          betConfig={betConfig}
        />
      </div>
    </main>
  );
}
