
import type { CatalogueRecord, Runner } from '@/data/matchData/matchCatalogues';
import { FaTv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: CatalogueRecord;
}

function OddsCell({
  runner,
  type,
}: {
  runner?: Runner;
  type: 'back' | 'lay';
}) {
  const price =
    type === 'back'
      ? runner?.backPrice1 ?? runner?.back?.[0]?.price
      : runner?.layPrice1 ?? runner?.lay?.[0]?.price;

  const size =
    type === 'back'
      ? runner?.backSize1 ?? runner?.back?.[0]?.size
      : runner?.laySize1 ?? runner?.lay?.[0]?.size;

  const unavailable = price == null || runner?.status !== 'ACTIVE';

  let bgColor = type === 'back' ? 'bg-sky-400' : 'bg-blue-300';

  if (unavailable) {
    bgColor = type === 'back' ? 'bg-sky-200' : 'bg-blue-100';
  }

  let formattedSize = '';

  if (size != null) {
    formattedSize = size >= 1000
      ? `${(size / 1000).toFixed(1)}K`
      : `${size}`;
  }

  return (
    <div
      className={`flex h-8 min-w-0 flex-1 flex-col items-center justify-center rounded-full ${bgColor}`}
    >
      {unavailable ? (
        <span aria-label="Odds unavailable" className="text-[10px]">
          🔒
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

export default function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const catalogue = match.catalogue;

  const runners = catalogue.markets['Match Odds']?.[0]?.runners ?? [];

  const hasBookmaker =
    (catalogue.markets['BOOKMAKER']?.length ?? 0) > 0;

  const hasFancy = Object.values(catalogue.fancyMarkets).some(
    (markets) => markets.length > 0
  );

  return (
    <div
      onClick={() => navigate(`/match/${catalogue.id}`)}
      className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2 py-1 text-black transition hover:border-blue-500"
    >
      {/* Live Status - Red */}
      <div className="w-10 shrink-0 text-center">
        {catalogue.inplay && (
          <span className="bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white">
            LIVE
          </span>
        )}
      </div>

      {/* Match Name and Date */}
      <div className="min-w-0 flex-[1.5] overflow-hidden">
        <p className="truncate text-xs font-semibold leading-4">
          {catalogue.eventName}
        </p>

        <p className="truncate text-[10px] leading-3 text-gray-600">
          ({formatMatchDate(catalogue.startTime)})
        </p>
      </div>

      {/* Bookmaker, Fancy and TV */}
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

        <span
          title="Match TV"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
        >
          <FaTv size={12} />
        </span>
      </div>

      {/* Back and Lay Odds */}
      <div className="flex min-w-0 flex-[2] items-center gap-1">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex min-w-0 flex-1 gap-0.5">
            <OddsCell runner={runners[index]} type="back" />
            <OddsCell runner={runners[index]} type="lay" />
          </div>
        ))}
      </div>
    </div>
  );
}





// import type { CatalogueRecord, Runner } from '@/data/matchData/matchCatalogues';
// import { FaTv } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// interface MatchCardProps {
//   match: CatalogueRecord;
// }

// interface OddsCellProps {
//   runner?: Runner;
//   type: 'back' | 'lay';
// }

// function OddsCell({ runner, type }: OddsCellProps) {
//   const price =
//     type === 'back'
//       ? (runner?.backPrice1 ?? runner?.back?.[0]?.price)
//       : (runner?.layPrice1 ?? runner?.lay?.[0]?.price);

//   const size =
//     type === 'back'
//       ? (runner?.backSize1 ?? runner?.back?.[0]?.size)
//       : (runner?.laySize1 ?? runner?.lay?.[0]?.size);

//   const isUnavailable = price == null || runner?.status !== 'ACTIVE';

//   const formattedSize =
//     size == null
//       ? ''
//       : size >= 1000
//         ? `${Number((size / 1000).toFixed(1))}K`
//         : `${Number(size.toFixed(1))}`;

//   return (
//     <div
//       className={`flex h-10 min-w-0 flex-1 flex-col items-center justify-center rounded-full ${
//         type === 'back'
//           ? isUnavailable
//             ? 'bg-sky-200'
//             : 'bg-sky-400'
//           : isUnavailable
//             ? 'bg-pink-200'
//             : 'bg-pink-400'
//       }`}
//     >
//       {isUnavailable ? (
//         <FaLockIcon />
//       ) : (
//         <>
//           <span className="text-sm font-bold leading-4 text-black">{price}</span>
//           <span className="text-xs leading-3 text-black">{formattedSize}</span>
//         </>
//       )}
//     </div>
//   );
// }

// function FaLockIcon() {
//   return (
//     <span className="text-base text-gray-600" aria-label="Odds unavailable">
//       🔒
//     </span>
//   );
// }

// function formatMatchDate(value: string) {
//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return 'Date unavailable';

//   const datePart = new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: '2-digit',
//     timeZone: 'Asia/Kolkata',
//   }).format(date);

//   const timePart = new Intl.DateTimeFormat('en-GB', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//     timeZone: 'Asia/Kolkata',
//   }).format(date);

//   return `${datePart} ${timePart}`;
// }

// export default function MatchCard({ match }: MatchCardProps) {
//   const navigate = useNavigate();

//   const catalogue = match.catalogue;

//   const matchOdds = catalogue.markets['Match Odds']?.[0];

//   const runners = [...(matchOdds?.runners ?? [])]
//     .sort((a, b) => (a.sortPriority ?? a.selectionId) - (b.sortPriority ?? b.selectionId))
//     .slice(0, 3);

//   const hasBookmaker = Boolean(catalogue.markets['BOOKMAKER']?.length);

//   const hasFancy = Object.values(catalogue.fancyMarkets).some((markets) => markets.length > 0);

//   return (
//     <div
//       onClick={() => navigate(`/match/${catalogue.id}`)}
//       className="flex min-w-0 cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1.5 text-black transition hover:border-blue-400"
//     >
//       {' '}
//       {/* LIVE */}
//       <div className="w-[56px] shrink-0 text-center">
//         {catalogue.inplay && (
//           <span className="bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">LIVE</span>
//         )}
//       </div>
//       {/* Match Name and Date */}
//       <div className="min-w-0 flex-[1.5] overflow-hidden">
//         <p className="truncate text-sm font-semibold leading-5">{catalogue.eventName}</p>
//         <p className="truncate text-xs leading-4 text-gray-600">
//           ({formatMatchDate(catalogue.startTime)})
//         </p>
//       </div>
//       {/* BM, F and TV Icons */}
//       <div className="flex shrink-0 items-center gap-1.5">
//         {hasBookmaker && (
//           <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-xs text-white">
//             BM
//           </span>
//         )}

//         {hasFancy && (
//           <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm text-white">
//             F
//           </span>
//         )}

//         <span
//           title="Match TV"
//           className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white"
//         >
//           <FaTv size={18} />
//         </span>
//       </div>
//       {/* Back and Lay Odds */}
//       <div className="flex min-w-0 flex-[2] items-center gap-1.5">
//         {[0, 1, 2].map((index) => {
//           const runner = runners[index];

//           return (
//             <div
//               key={runner?.selectionId ?? `empty-${index}`}
//               className="flex min-w-0 flex-1 gap-1"
//             >
//               <OddsCell runner={runner} type="back" />
//               <OddsCell runner={runner} type="lay" />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
