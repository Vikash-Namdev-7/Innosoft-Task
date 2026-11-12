type Game = {
  id: number;
  image: string;
};

type GameSectionProps = {
  title: string;
  games: Game[];
};

const Games = ({ title, games }: GameSectionProps) => {
  return (
    <section className="w-full min-w-0 px-2.5 pt-2 sm:px-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h1 className="italic px-1 text-xl tracking-tight sm:text-2xl uppercase font-bold">
          {title}
        </h1>
      </div>

      <div className="relative mb-3 h-[2px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[3px] w-16 rounded-full bg-white" />
      </div>

      {/* Game Cards */}
      <div className="flex gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {games.map((game) => (
          <div
            key={game.id}
            className="group relative flex-none w-[115px] sm:w-[135px] md:w-[155px] overflow-hidden rounded-2xl bg-gray-900 shadow-md"
          >
            <img
              src={game.image}
              alt={title}
              loading="lazy"
              className="h-[155px] sm:h-[185px] md:h-[210px] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Games;
