import IndianCasino from "@/components/home/IndianCasino";
import TrandingGames from "@/components/home/TrandingGames";

import Games from "@/components/common/Games";

import { indianCasinoGames } from "@/data/home-page/IndianCasino";
import { recommendedGames } from "@/data/home-page/recommendedGames";
import { slotGames } from "@/data/home-page/slotGames";
import CasinoLobby from "@/components/home/CasinoLobby";
import FooterPage from "./FooterPage";

const HomePage = () => {
  return (
    <div className="min-w-0 w-full">
      <div className="flex gap-4 p-4">
        <img
          src="https://kailash.insoftdemo.site/images/home/home-section-1.png"
          alt="Home section 1"
          className="h-auto w-1/2 min-w-0 rounded-md object-cover sm:h-[180px] md:h-[210px]"
        />

        <img
          src="https://kailash.insoftdemo.site/images/home/home-section-2.png"
          alt="Home section 2"
          className="h-auto w-1/2 min-w-0 rounded-md object-cover sm:h-[180px] md:h-[210px]"
        />
      </div>

      <h1 className="italic px-2 text-xl tracking-tight sm:text-2xl mb-2 font-bold">
        CRICKET BATTLE
      </h1>
      <div className="relative mb-3 h-[2px] w-full bg-white/60">
        <div className="absolute left-0 top-0 h-[3px] w-16  rounded-full bg-white" />
      </div>

      <div className="p-4">
        <img
          src="https://kailash.insoftdemo.site/images/home/bannerImage.png"
          alt="Main Banner"
          className="h-auto w-full object-contain"
        />
      </div>

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