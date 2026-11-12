import { trandingGames } from "@/data/home-page/trandingGames"
const TrandingGames = () => {
  return (
    <section className="w-full min-w-0 px-2.5 pb-3 sm:px-4 sm:pb-4">
      <h1 className="italic mb-2 px-1 text-xl tracking-tight sm:text-2xl font-bold">TRANDING GAMES</h1>

      <div className="relative mb-3 h-[2px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[3px] w-16 rounded-full bg-white" />
      </div>

      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-3">
        {trandingGames.map((game) => (
            <div key={game.id} className="overflow-hidden rounded-2xl shadow-md">

                <img 
                    src={game.image}
                    alt="Tranding Games Image"
                    loading="lazy"
                    className="h-[145px] sm:h-[185px] md:h-[220px] lg:h-[280px] w-full object-cover transition-transform duration-300 hover:scale-105"                
                />
            </div>
        ))}
      </div>
    </section>
  )
}

export default TrandingGames
