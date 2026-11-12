import { casinoLobby } from '@/data/home-page/casinoLobby';

const CasinoLobby = () => {
  return (
    <section className="w-full min-w-0 px-2.5 pb-4 pt-2 sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h1 className="italic px-1 text-xl font-bold uppercase tracking-tight sm:text-2xl">
          CASINO LOBBY
        </h1>
      </div>

      <div className="relative mb-3 h-[2px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[3px] w-16 rounded-full bg-white" />
      </div>

      {/* 2-Row 7-Column Grid matching 2nd Reference Image */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-7">
        {casinoLobby.map((game) => (
          <div
            key={game.id}
            className="group relative overflow-hidden rounded-xl bg-gray-900 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <img
              src={game.image}
              alt={game.name || 'Casino Lobby'}
              loading="lazy"
              className="aspect-[566/418] w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CasinoLobby;
