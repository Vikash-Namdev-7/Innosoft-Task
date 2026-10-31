import { Link, useParams } from 'react-router-dom';
import { FaLock, FaThumbtack, FaArrowLeft } from 'react-icons/fa';
import pinIcon from '/images/sportImages/imgi_21_pin.png';
import {
  matchCatalogues,
  type CatalogueRecord,
  type Runner,
} from '@/data/matchData/matchCatalogues';

type Market = NonNullable<CatalogueRecord['catalogue']['markets'][string]>[number];

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

function formatSize(size?: number) {
  if (size == null) return '';

  return size >= 1000 ? `${(size / 1000).toFixed(1)}K` : String(size);
}

function OddsCell({
  runner,
  type,
  index,
}: {
  runner: Runner;
  type: 'back' | 'lay';
  index: number;
}) {
  const odds = type === 'back' ? runner.back : runner.lay;

  const price =
    odds?.[index]?.price ??
    (index === 0 ? (type === 'back' ? runner.backPrice1 : runner.layPrice1) : undefined);

  const size =
    odds?.[index]?.size ??
    (index === 0 ? (type === 'back' ? runner.backSize1 : runner.laySize1) : undefined);

  const unavailable = price == null || runner.status !== 'ACTIVE';

  let bgColor = type === 'back' ? 'bg-sky-400' : 'bg-blue-300';

  if (unavailable) {
    bgColor = type === 'back' ? 'bg-sky-200' : 'bg-blue-100';
  }

  return (
    <div
      className={`flex h-8 min-w-0 flex-1 flex-col items-center justify-center rounded-full ${bgColor}`}
    >
      {unavailable ? (
        <FaLock className="text-[10px] text-gray-600" />
      ) : (
        <>
          <span className="text-xs font-bold leading-3 text-black">{price}</span>
          <span className="text-[9px] leading-3 text-black">{formatSize(size)}</span>
        </>
      )}
    </div>
  );
}

function MarketHeader({ title, min, max }: { title: string; min: number; max: number }) {
  return (
    <>
      <div className='bg-white border rounded-t-2xl'>
        <div className="flex h-9 items-center gap-2 rounded-2xl border border-blue-400 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
            <img src={pinIcon} alt="" />
          </span>

          <h2 className="min-w-0 flex-1 truncate text-xs font-bold uppercase sm:text-sm">
            {title}
          </h2>

          <span className="shrink-0 text-[9px] font-bold sm:text-[11px]">
            MIN: {min} MAX: {max >= 1000 ? `${max / 1000}K` : max}
          </span>
        </div>
      </div>

      <div className="grid h-7 grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))] items-center rounded-b-xl bg-white px-3 text-[11px] font-semibold text-black sm:text-xs">
        <span>Market</span>
        <span className="text-center">Back</span>
        <span className="text-center">Lay</span>
      </div>
    </>
  );
}

function MarketSection({
  title,
  market,
  min,
  max,
}: {
  title: string;
  market: Market;
  min: number;
  max: number;
}) {
  const runners = [...(market.runners ?? [])].sort(
    (a, b) => Number(a.sortPriority ?? a.selectionId) - Number(b.sortPriority ?? b.selectionId)
  );

  return (
    <section className="min-w-0">
      <MarketHeader
        title={title}
        min={market.minBetAmount ?? min}
        max={market.maxBetAmount ?? max}
      />

      <div className="mt-1 space-y-1">
        {runners.map((runner) => (
          <div
            key={`${market.marketId}-${runner.selectionId}`}
            className="grid min-h-9 grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))] items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black"
          >
            <span className="min-w-0 truncate pl-1 text-[11px] sm:text-xs">
              {runner.runnerName}
            </span>

            <div className="flex min-w-0 gap-1">
              {[0, 1, 2].map((index) => (
                <OddsCell key={index} runner={runner} type="back" index={index} />
              ))}
            </div>

            <div className="flex min-w-0 gap-1">
              {[0, 1, 2].map((index) => (
                <OddsCell key={index} runner={runner} type="lay" index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FancySection({
  title,
  markets,
  min,
  max,
}: {
  title: string;
  markets: CatalogueRecord['catalogue']['fancyMarkets'][string];
  min: number;
  max: number;
}) {
  if (!markets?.length) return null;

  return (
    <section className="min-w-0">
      <MarketHeader title={title} min={min} max={max} />

      <div className="mt-1 space-y-1">
        {markets.map((market) => (
          <div
            key={market.marketId}
            className="grid min-h-9 grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))] items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black"
          >
            <span className="min-w-0 truncate pl-1 text-[11px] sm:text-xs">
              {market.runners.runnerName}
            </span>

            <div className="flex min-w-0 gap-1">
              {[0, 1, 2].map((index) => (
                <OddsCell key={index} runner={market.runners} type="back" index={index} />
              ))}
            </div>

            <div className="flex min-w-0 gap-1">
              {[0, 1, 2].map((index) => (
                <OddsCell key={index} runner={market.runners} type="lay" index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MatchDetails() {
  const { matchId } = useParams<{ matchId: string }>();

  const match = matchCatalogues.find(
    (item) => item.catalogue.id === matchId || item.catalogue.externalId === matchId
  );

  if (!match) {
    return (
      <main className="min-h-screen bg-black p-3 text-white">
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white"
        >
          <FaArrowLeft /> Back to matches
        </Link>

        <p className="rounded-xl bg-[#151515] p-4 text-center text-xs">
          Match not found. Please return to the matches page and select a match.
        </p>
      </main>
    );
  }

  const catalogue = match.catalogue;
  const { time, date } = formatTime(catalogue.startTime);
  const markets = catalogue.markets;
  const config = match.betConfig;

  const min = Number(config.minBetAmount ?? 100);
  const max = Number(config.maxBetAmount ?? 10000);

  const marketGroups = [
    { title: 'Match Odds', items: markets['Match Odds'] ?? [], min, max },
    {
      title: 'Bookmaker',
      items: markets['BOOKMAKER'] ?? [],
      min: Number(config.bookmakerMinBetAmount ?? min),
      max: Number(config.bookmakerMaxBetAmount ?? max),
    },
    { title: 'Tied Match', items: markets['Tied Match'] ?? [], min, max },
  ];

  const fancyGroups = Object.entries(catalogue.fancyMarkets).filter(
    ([, items]) => items.length > 0
  );

  return (
    <main className="min-h-screen w-full min-w-0 bg-black p-2 text-white">
      {/* Match Information */}
      <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2 rounded-xl bg-[#111111] p-2">
        <div className="max-w-full rounded-lg bg-blue-600 px-3 py-1.5">
          <h1 className="truncate text-xs font-bold sm:text-sm">{catalogue.eventName}</h1>
        </div>

        <div className="flex flex-wrap items-center text-center gap-2">
          <span className="text-xs font-bold sm:text-lg uppercase">{time}</span>
          <span className="text-[10px] text-gray-300 sm:text-xs">{date}</span>
        </div>
      </div>

      {/* Main Markets */}
      <div className="space-y-3">
        {marketGroups.map((group) =>
          group.items.map((market) => (
            <MarketSection
              key={market.marketId}
              title={group.title}
              market={market}
              min={group.min}
              max={group.max}
            />
          ))
        )}

        {/* Fancy Markets */}
        {fancyGroups.map(([groupName, items]) => (
          <FancySection
            key={groupName}
            title={groupName}
            markets={items}
            min={Number(config.fancyMinBetAmount ?? min)}
            max={Number(config.fancyMaxBetAmount ?? max)}
          />
        ))}
      </div>
    </main>
  );
}
