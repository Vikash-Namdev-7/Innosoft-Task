import { Link, useParams } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import pinIcon from '/images/sportImages/imgi_21_pin.png';

import { useGetCatalogueQuery, type Runner } from '@/store/api/sportApi';
import { useEffect } from 'react';
import { usePriceDropBlink } from '@/hooks';

import FancyMarketSection from '@/components/sports/FancyMarketSection';

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
}: {
  runner: Runner;
  type: 'back' | 'lay';
  index: number;
  isSuspended?: boolean;
  className?: string;
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
      className={`h-8 min-w-0 flex-1 flex-col items-center justify-center rounded-full transition-colors duration-300 ${activeBgColor} ${className}`}
    >
      {unavailable ? (
        <FaLock className={`text-[10px] ${isSuspended ? 'text-gray-400' : 'text-gray-600'}`} />
      ) : (
        <>
          <span className="text-xs font-bold leading-3 text-black">{price}</span>

          <span className="text-[9px] leading-3 text-black">{formatSize(size)}</span>
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
  runners,
  minBetAmount,
  maxBetAmount,
  marketStatus,
  matchStatus,
}: {
  title: string;
  runners: Runner[];
  minBetAmount?: number;
  maxBetAmount?: number;
  marketStatus?: string;
  matchStatus?: string;
}) {
  const sortedRunners = [...runners].sort(
    (a, b) => (a.sortPriority ?? a.selectionId) - (b.sortPriority ?? b.selectionId)
  );

  const isMarketSuspended =
    matchStatus?.toUpperCase() === 'SUSPENDED' ||
    marketStatus?.toUpperCase() === 'SUSPENDED';

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

          return (
            <div
              key={runner.selectionId}
              className="flex min-h-9 items-center justify-between gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black"
            >
              <span className="min-w-0 flex-1 truncate pl-1 text-[11px] font-semibold sm:text-xs">
                {runner.runnerName}
              </span>

              {/* Odds container: matches inplay MatchCard width and pill sizing */}
              <div className="relative flex shrink-0 items-center gap-1 w-[114px] sm:w-[124px] md:w-[48%] md:sm:w-[50%]">
                {/* Back Odds */}
                <div className="flex flex-1 min-w-0 gap-0.5 justify-end">
                  {[0, 1, 2].map((index) => (
                    <OddsCell
                      key={index}
                      runner={runner}
                      type="back"
                      index={index}
                      isSuspended={isRunnerSuspended}
                      className={index !== 2 ? 'hidden md:flex' : 'flex'}
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
                      isSuspended={isRunnerSuspended}
                      className={index !== 2 ? 'hidden md:flex' : 'flex'}
                    />
                  ))}
                </div>

                {/* Centered SUSPENDED Overlay when suspended */}
                {isRunnerSuspended && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] select-none">
                      SUSPENDED
                    </span>
                  </div>
                )}
              </div>
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
  
  const { matchId } = useParams<{ matchId: string }>();

  // Fetch catalogue details using fixture ID
  const { data, isLoading, isError, error } = useGetCatalogueQuery(matchId!, {
    skip: !matchId,
    pollingInterval: 2000,
    skipPollingIfUnfocused: true,
  });

  // console.log('Match ID:', matchId);
  // console.log('Catalogue API Data:', data);
  // console.log('Catalogue API Error:', error);

  // Get actual catalogue data from API
  const match = data?.catalogue;
  const betConfig = data?.betConfig;

  // // For fetching Fancy data
  // useEffect(() => {
  //   if (match) {
  //     console.log("========== FANCY MARKET DATA ==========");
  //     console.log("Fancy Markets:", match.fancyMarkets);
  //     console.log("Fancy Market JSON:", JSON.stringify(match.fancyMarkets, null, 2));
  //   }
  // }, [match]); 

  // console.log(match?.fancyMarkets);
  // Get all market groups
  const markets = Object.entries(match?.markets ?? {});

  const FancyMarket = match?.fancyMarkets ?? {};

  console.log("Fancy Markets:", match?.fancyMarkets);
console.log("Normal Fancy:", match?.fancyMarkets?.Normal);
console.log("Over By Over:", match?.fancyMarkets?.["Over By Over"]);
console.log("Ball By Ball:", match?.fancyMarkets?.["Ball By Ball"]);


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

      {/* All Markets */}
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

            return (
              <MarketSection
                key={market.marketId || `${marketGroupName}-${index}`}
                title={market.marketName || marketGroupName}
                runners={market.runners ?? []}
                minBetAmount={market.minBetAmount ?? defaultMin}
                maxBetAmount={market.maxBetAmount ?? defaultMax}
                marketStatus={market.status}
                matchStatus={match.status}
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
      <FancyMarketSection fancyMarkets={FancyMarket} />
    </main>
  );
}
