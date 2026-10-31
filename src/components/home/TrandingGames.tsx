import { trandingGames } from "@/data/home-page/trandingGames"
const TrandingGames = () => {
  return (
    <section className="w-full min-w-0 px-4 pb-4">
      <h1 className="italic mb-3 px-2 text-xl tracking-tight sm:text-2xl font-bold">TRANDING GAMES</h1>

      <div className="relative mb-3 h-[3px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[4px] w-16 rounded-full bg-white" />
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {trandingGames.map((game) => (
            <div key={game.id} className="overflow-hidden rounded-2xl">

                <img 
                    src={game.image}
                    alt="Tranding Games Image"
                    loading="lazy"
                    className="h-[180px] w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-[220px] lg:-[330px]"                
                />
            </div>
        ))}
      </div>
    </section>
  )
}

export default TrandingGames
