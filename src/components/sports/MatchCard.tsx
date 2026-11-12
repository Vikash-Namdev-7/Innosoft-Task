import type { Fixture, Runner } from '@/store/api/sportApi';
import { FaLock, FaTv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePriceDropBlink } from '@/hooks';

interface MatchCardProps {
  match: Fixture;
}

function OddsCell({
  runner,
  type,
  isSuspended = false,
}: {
  runner?: Runner;
  type: 'back' | 'lay';
  isSuspended?: boolean;
}) {
  const price =
    type === 'back'
      ? runner?.backPrice1 ?? runner?.back?.[0]?.price
      : runner?.layPrice1 ?? runner?.lay?.[0]?.price;

  const size =
    type === 'back'
      ? runner?.backSize1 ?? runner?.back?.[0]?.size
      : runner?.laySize1 ?? runner?.lay?.[0]?.size;

  const unavailable = isSuspended || price == null || runner?.status !== 'ACTIVE';

  const isBlinking = !isSuspended && usePriceDropBlink(price);

  let bgColor = type === 'back' ? 'bg-[#72bbef]' : 'bg-[#f994ba]';

  if (isSuspended) {
    bgColor = type === 'back' ? 'bg-[#293745]' : 'bg-[#3b2a32]';
  } else if (unavailable) {
    bgColor = type === 'back' ? 'bg-[#72bbef]/50' : 'bg-[#f994ba]/50';
  }

  const activeBgColor = isBlinking
    ? 'bg-[#facc15] animate-odds-blink text-black'
    : bgColor;

  let formattedSize = '';

  if (size != null) {
    formattedSize = size >= 1000
      ? `${(size / 1000).toFixed(1)}K`
      : `${size}`;
  }

  return (
    <div
      className={`flex h-8 min-w-0 flex-1 flex-col items-center justify-center rounded-full transition-colors duration-300 ${activeBgColor}`}
    >
      {unavailable ? (
        <span aria-label="Odds unavailable" className={`flex items-center justify-center text-[10px] ${isSuspended ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaLock size={10} />
        </span>
      ) : (
        <>
          <span className="text-xs font-bold leading-3 text-black">
            {price}
          </span>

          <span className="text-[9px] leading-3 text-black">
            {formattedSize}
          </span>
        </>
      )}
    </div>
  );
}

function formatMatchDate(value: string) {
  const date = new Date(value);

  if (isNaN(date.getTime())) return 'Date unavailable';

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });

  return `${datePart} ${timePart}`;
}

function getUpcomingTiming(value: string) {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return { dayText: 'Upcoming', timeText: '-- : --' };
  }

  // Format in Asia/Kolkata timezone
  const kolkataDateStr = date.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
  const now = new Date();
  const kolkataNowStr = now.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });

  const isToday = kolkataDateStr === kolkataNowStr;

  let dayText = '';
  if (isToday) {
    dayText = 'Today';
  } else {
    dayText = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      timeZone: 'Asia/Kolkata',
    });
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const parts = formatter.formatToParts(date);
  let hour = '';
  let minute = '';
  let dayPeriod = '';

  for (const part of parts) {
    if (part.type === 'hour') hour = part.value.padStart(2, '0');
    if (part.type === 'minute') minute = part.value.padStart(2, '0');
    if (part.type === 'dayPeriod') dayPeriod = part.value.toUpperCase();
  }

  const timeText = hour && minute && dayPeriod ? `${hour} : ${minute} ${dayPeriod}` : '';

  return { dayText, timeText };
}

export default function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();

  const { dayText, timeText } = getUpcomingTiming(match.startTime);

  // API Fixture Details 
  const sortedRunners = [...(match.runners ?? [])].sort(
    (a, b) =>
      (a.sortPriority ?? a.selectionId) -
      (b.sortPriority ?? b.selectionId)
  );

  const drawRunner = sortedRunners.find(
    (r) =>
      r.runnerName?.toLowerCase().includes('draw') ||
      r.runnerName?.toLowerCase().includes('tie')
  );

  let runner1: Runner | undefined;
  let runnerX: Runner | undefined;
  let runner2: Runner | undefined;

  if (drawRunner) {
    const teams = sortedRunners.filter((r) => r !== drawRunner);
    runner1 = teams[0];
    runnerX = drawRunner;
    runner2 = teams[1];
  } else if (sortedRunners.length === 2) {
    runner1 = sortedRunners[0];
    runnerX = undefined;
    runner2 = sortedRunners[1];
  } else {
    runner1 = sortedRunners[0];
    runnerX = sortedRunners[2];
    runner2 = sortedRunners[1];
  }

  const displayRunners = [runner1, runnerX, runner2];

  const hasBookmaker = match.isBookmaker;
  const hasFancy = match.isFancy;

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className="flex min-w-0 cursor-pointer items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-1 py-1 text-black transition hover:border-blue-500"
    >
      {/* Match info and badges */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-1.5 overflow-hidden pr-2 lg:pr-0">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {/* Live Status or Upcoming Timing Badge */}
          {match.inplay ? (
            <div className="flex w-[68px] shrink-0 items-center justify-center">
              <img
                src="/market-section/live.gif"
                alt="LIVE"
                className="h-5 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="flex h-8 w-[58px] shrink-0 flex-col items-center justify-center rounded-full bg-[#0a58ca] px-1 text-white shadow-sm">
              <span className="text-[10px] font-medium leading-none">
                {dayText}
              </span>
              <span className="mt-0.5 text-[9px] font-bold tracking-tight leading-none">
                {timeText}
              </span>
            </div>
          )}

          {/* Match Name and Date */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-xs font-semibold leading-4">
              {match.name}
            </p>

            {match.inplay && (
              <p className="truncate text-[10px] leading-3 text-gray-600">
                ( {formatMatchDate(match.startTime)} )
              </p>
            )}
          </div>
        </div>

        {/* Bookmaker, Fancy and TV (aligns right when odds are hidden) */}
        <div className="flex shrink-0 items-center gap-1">
          {hasBookmaker && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
              BM
            </span>
          )}

          {hasFancy && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              F
            </span>
          )}

          {match.inplay && (
            <span
              title="Match TV"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <FaTv size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Back and Lay Odds - 1, X, 2 (hidden when right sidebar collapses < lg) */}
      {(() => {
        const isMatchSuspended =
          match.status?.toUpperCase() === 'SUSPENDED' ||
          (displayRunners.length > 0 &&
            displayRunners.every(
              (r) => Boolean(r?.status && r.status.toUpperCase() === 'SUSPENDED')
            ));

        return (
          <div className="relative hidden lg:grid w-[48%] grid-cols-3 gap-1 shrink-0 sm:w-[50%]">
            {displayRunners.map((runner, index) => {
              const isRunnerSuspended =
                isMatchSuspended ||
                Boolean(runner?.status && runner.status.toUpperCase() === 'SUSPENDED');

              return (
                <div key={index} className="flex min-w-0 flex-1 gap-0.5">
                  <OddsCell runner={runner} type="back" isSuspended={isRunnerSuspended} />
                  <OddsCell runner={runner} type="lay" isSuspended={isRunnerSuspended} />
                </div>
              );
            })}

            {isMatchSuspended && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span className="text-xs font-black tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] select-none">
                  SUSPENDED
                </span>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
