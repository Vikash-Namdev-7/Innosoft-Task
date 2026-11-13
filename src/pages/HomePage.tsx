import IndianCasino from "@/components/home/IndianCasino";
import TrandingGames from "@/components/home/TrandingGames";
import PopularMatches from "@/components/home/PopularMatches";

import Games from "@/components/common/Games";

import { indianCasinoGames } from "@/data/home-page/IndianCasino";
import { recommendedGames } from "@/data/home-page/recommendedGames";
import { slotGames } from "@/data/home-page/slotGames";
import CasinoLobby from "@/components/home/CasinoLobby";
import FooterPage from "./FooterPage";

const HomePage = () => {
  return (
    <div className="min-w-0 w-full">
      <div className="flex gap-2.5 p-2.5 sm:gap-4 sm:p-4">
        <img
          src="https://kailash.insoftdemo.site/images/home/home-section-1.png"
          alt="Home section 1"
          className="h-[125px] w-1/2 min-w-0 rounded-xl object-cover sm:h-[180px] md:h-[210px]"
        />

        <img
          src="https://kailash.insoftdemo.site/images/home/home-section-2.png"
          alt="Home section 2"
          className="h-[125px] w-1/2 min-w-0 rounded-xl object-cover sm:h-[180px] md:h-[210px]"
        />
      </div>

      <h1 className="italic px-2.5 sm:px-4 text-xl tracking-tight sm:text-2xl mb-1.5 font-bold">
        CRICKET BATTLE
      </h1>
      <div className="relative mb-2.5 h-[2px] w-full bg-white/40">
        <div className="absolute left-0 top-0 h-[3px] w-16 rounded-full bg-white" />
      </div>

      <div className="px-2.5 py-1 sm:px-4 sm:py-2">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://kailash.insoftdemo.site/images/home/bannerImage.png"
            alt="Main Banner"
            className="h-[175px] w-full object-cover object-center sm:h-[240px] md:h-[300px] lg:h-[340px]"
          />
        </div>
      </div>

      <PopularMatches />

      <IndianCasino />
      <TrandingGames />

      <Games title="casino games" games={indianCasinoGames} />
      <Games title="recommended games" games={recommendedGames} />
      <Games title="slot games" games={slotGames} />

      <CasinoLobby />
      <FooterPage />
    </div>
  );
};

export default HomePage;