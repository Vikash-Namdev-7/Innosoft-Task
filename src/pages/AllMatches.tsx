import { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { sportsCategories } from '@/data/home-page/sport';
import MatchCard from '@/components/markets/MatchCard';
import { useGetFixturesQuery } from '@/store/api/marketApi';
import { useLocation } from 'react-router-dom';

export default function allMatches() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');

  const location = useLocation();

  const sportName = location.pathname.split('/').pop()?.toLowerCase();

  // Reset filters when route changes
  useEffect(() => {
    setSelectedSport('All');
    setSearch('');
  }, [location.pathname]);

  // Navbar route name ko API ke expected sport name mein convert karna
  const sportMap: Record<string, string> = {
    cricket: 'Cricket',
    football: 'Soccer',
    soccer: 'Soccer',
    tennis: 'Tennis',
    kabaddi: 'Kabaddi',
    'horse-racing': 'Horse Racing',
    'greyhound': 'Greyhound Racing',
    basketball: 'Basketball',
    baseball: 'Baseball',
    volleyball: 'Volleyball',
    darts: 'Darts',
    futsal: 'Futsal',
    'table-tennis': 'Table Tennis',
  };

  // Check whether current route is Inplay
  const isInplay = sportName === 'inplay' || location.pathname === '/sport/inplay';

  // Get sport name from URL
  const selectSport = sportName && !isInplay ? (sportMap[sportName] || sportName.charAt(0).toUpperCase() + sportName.slice(1)) : undefined;

  console.log('ROUTE DEBUG:', {
    sportName,
    isInplay,
    selectSport,
  });

  // API arguments
  const queryArgs = {
    ...(selectSport && { sport: selectSport }),
    ...(isInplay && { inplay: true }),
    status: 'ACTIVE',
  };

  // Sport API
  const {
    currentData: fixtures,
    isLoading,
    isFetching,
    isError,
  } = useGetFixturesQuery(queryArgs, {
    pollingInterval: 2000,
    skipPollingIfUnfocused: true,
    skip: Boolean(sportName && sportName.toLowerCase() !== 'inplay' && !selectSport),
  });

  // API Fixtures
  const allMatches = fixtures?.fixture ?? [];

  // Search and internal Sport Filter
  const filteredMatches = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return allMatches.filter((item) => {
      const matchesSport =
        selectedSport === 'All' || item.sport.toLowerCase() === selectedSport.toLowerCase();

      const matchesSearch = item.name.toLowerCase().includes(searchText);

      return matchesSport && matchesSearch;
    });
  }, [allMatches, search, selectedSport]);

  // Group matches by sport
  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce<Record<string, typeof filteredMatches>>((groups, item) => {
      const sport = item.sport;

      if (!groups[sport]) {
        groups[sport] = [];
      }

      groups[sport].push(item);

      return groups;
    }, {});
  }, [filteredMatches]);

  // Loading
  if (isLoading || (isFetching && !fixtures)) {
    return <div className="p-6 text-center text-white">Loading Sports...</div>;
  }

  // Error
  if (isError) {
    return (
      <div className="p-6 text-center text-red-400">Unable to load matches. Please try again.</div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-3 mt-6 bg-black text-white">
      {isInplay && (
        <>
          {/* Announcement and Search */}
          <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-[#111111] p-2">
            <div className="relative flex h-8 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-[#275cd1] px-3">
              <span aria-hidden="true" className="z-10 flex h-full items-center shrink-0 bg-[#275cd1] pr-2">
                🔔
              </span>

              <div className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden">
                <span className="animate-marquee whitespace-nowrap text-sm font-semibold text-white">
                  Welcome to KailashBook exchange, Enjoy more services...
                </span>
              </div>
            </div>

            <div className="flex h-8 w-[230px] max-w-[42%] shrink-0 items-center gap-1.5 rounded-full border border-gray-600 px-3 transition focus-within:border-gray-400">
              <input
                type="text"
                placeholder="Search Events"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-400 sm:text-sm"
              />

              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 transition hover:text-white"
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Sport Filters */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedSport('All')}
              className={`flex h-8 mb-2 shrink-0 items-center rounded-full border px-5 text-sm font-semibold transition-colors ${
                selectedSport === 'All'
                  ? 'border-[#234ead] bg-[#275cd1] text-white'
                  : 'border-gray-700 bg-[#111111] text-white/50 hover:text-white/80'
              }`}
            >
              All
            </button>

            {sportsCategories.map((sport, index) => {
              const isSelected = selectedSport.toLowerCase() === sport.name.toLowerCase();

              return (
                <button
                  key={`${sport.id}-${index}`}
                  type="button"
                  onClick={() => setSelectedSport(sport.name)}
                  className={`flex h-8 mb-2 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                    isSelected
                      ? 'border-[#336ae2] bg-[#336ae2] text-white'
                      : 'border-gray-700 bg-[#111111] text-white/50 hover:text-white/80'
                  }`}
                >
                  <img
                    src={sport.icon}
                    alt=""
                    loading="lazy"
                    className={`h-5 w-5 object-contain transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-60'
                    }`}
                  />

                  <span>{sport.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Match Lists Grouped by Sport */}
      <div className="space-y-2">
        {Object.entries(groupedMatches).map(([sport, matches]) => {
          const sportCategory = sportsCategories.find(
            (c) => c.name.toLowerCase() === sport.toLowerCase()
          );

          return (
            <section key={sport} className="min-w-0 space-y-1">
              <div className="flex h-9 items-center justify-between rounded-full border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white">
                <h2 className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
                  {sportCategory?.icon && (
                    <img
                      src={sportCategory.icon}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  <span className="truncate">{sport}</span>

                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    {matches.length}
                  </span>
                </h2>

              <div className="hidden lg:grid w-[48%] grid-cols-3 gap-1 text-center text-sm font-bold sm:w-[50%]">
                <span>1</span>
                <span>X</span>
                <span>2</span>
              </div>
            </div>

            <div className="space-y-1">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        );
      })}

        {filteredMatches.length === 0 && (
          <p className="rounded-xl bg-[#151515] p-6 text-center text-sm text-gray-400">
            No matches found.
          </p>
        )}
      </div>
    </div>
  );
}
