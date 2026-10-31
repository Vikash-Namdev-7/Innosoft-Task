import { useMemo, useState } from 'react';
import { sportsCategories } from '@/data/home-page/sport';
import { matchCatalogues } from '@/data/matchData/matchCatalogues';
import MatchCard from '@/components/sports/MatchCard';

export default function SportPage() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');

  const filteredMatches = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return matchCatalogues.filter((item) => {
      const catalogue = item.catalogue;

      const matchesSport =
        selectedSport === 'All' ||
        catalogue.sport.toLowerCase() === selectedSport.toLowerCase();

      const matchesSearch = catalogue.eventName
        .toLowerCase()
        .includes(searchText);

      return matchesSport && matchesSearch;
    });
  }, [search, selectedSport]);

  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce<Record<string, typeof filteredMatches>>(
      (groups, item) => {
        const sport = item.catalogue.sport;

        if (!groups[sport]) {
          groups[sport] = [];
        }

        groups[sport].push(item);
        return groups;
      },
      {}
    );
  }, [filteredMatches]);

  return (
    <div className="w-full min-w-0 space-y-3 bg-black text-white">
      {/* Announcement and Search */}
      <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-[#111111] p-2">
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#275cd1] px-3">
          <span aria-hidden="true">🔔</span>

          <p className="truncate text-sm font-semibold">
            Welcome to KailashBook exchange, Enjoy more services.
          </p>
        </div>

        <div className="flex h-8 w-[230px] max-w-[42%] shrink-0 items-center gap-2 rounded-full border border-gray-600 px-3">
          <input
            type="text"
            placeholder="Search Events"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="text-lg text-white/70 transition hover:text-white"
            >
              ×
            </button>
          )}
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
          const isSelected =
            selectedSport.toLowerCase() === sport.name.toLowerCase();

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

      {/* Match Lists Grouped by Sport */}
      <div className="space-y-2">
        {Object.entries(groupedMatches).map(([sport, matches]) => (
          <section key={sport} className="min-w-0 space-y-1">
            <div className="flex h-9 items-center justify-between rounded-full border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white">
              <h2 className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
                <span className="truncate">{sport}</span>

                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {matches.length}
                </span>
              </h2>

              <div className="grid w-[42%] grid-cols-3 text-center text-sm font-bold sm:w-[50%]">
                <span>1</span>
                <span>X</span>
                <span>2</span>
              </div>
            </div>

            <div className="space-y-1">
              {matches.map((match) => (
                <MatchCard
                  key={match.catalogue.id}
                  match={match}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredMatches.length === 0 && (
          <p className="rounded-xl bg-[#151515] p-6 text-center text-sm text-gray-400">
            No matches found.
          </p>
        )}
      </div>
    </div>
  );
}