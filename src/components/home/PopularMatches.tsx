import { Link } from 'react-router-dom';
import MatchCard from '@/components/markets/MatchCard';
import {
  useGetPopularEventsQuery,
  normalizePopularEvent,
} from '@/store/api/marketApi';

export default function PopularMatches() {
  const { data, isLoading, isFetching, isError } = useGetPopularEventsQuery(undefined, {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
  });

  const rawEvents = data?.events ?? [];
  const events = rawEvents.map(normalizePopularEvent);

  return (
    <section className="w-full min-w-0 px-2.5 pb-3 sm:px-4 sm:pb-4">
      {/* Header with Title and View All */}
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <h2 className="italic text-xl font-bold tracking-tight text-white sm:text-2xl uppercase">
          Popular Matches
        </h2>

        <Link
          to="/sport/inplay"
          className="text-xs font-semibold text-blue-400 transition hover:text-blue-300 sm:text-sm"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Decorative accent underline */}
      <div className="relative mb-3 h-[2px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[3px] w-16 rounded-full bg-white" />
      </div>

      {/* Content based on query state */}
      {isLoading || (isFetching && !data) ? (
        <div className="space-y-1.5 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 w-full rounded-full border border-gray-800 bg-[#151515]"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-[#151515] p-4 text-center text-xs text-gray-400">
          Unable to load popular matches. Please try again later.
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-1">
          {events.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-[#151515] p-5 text-center text-xs text-gray-400 sm:text-sm">
          No popular matches available right now.
        </div>
      )}
    </section>
  );
}

