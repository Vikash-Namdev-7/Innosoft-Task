import { Link } from "react-router-dom";
import { FaChevronRight } from 'react-icons/fa';
import { indianCasinoGames } from "@/data/home-page/IndianCasino";

export default function TrendingGamesSidebar () {

  const games = indianCasinoGames.slice(0,12);

  return (
    <aside className="w-full min-w-0 rounded-xl bg-[#275cd1] p-2">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between rounded-lg bg-black px-3 py-3">
        <h2 className="text-[13px] font-semibold text-white/70">
          Trending Games
        </h2>

        <Link to="/games"
          className="flex items-center gap-1 text-sm text-white transition hover:text-blue-300">
          See More
          <FaChevronRight size={11}/>
        </Link>
      </div>

      
      {/* Games Image */}
      <div className="grid grid-cols-3 gap-2">
        {games.map((game, index) => (
          <Link 
            key={game.id ?? index}
            to="/games"
            className="group block min-w-0 overflow-hidden rounded-xl bg-black"
          >
            <img 
              src={game.image}
              alt=""
              loading="lazy"
              decoding="async"
                className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>

    </aside>
  )
}