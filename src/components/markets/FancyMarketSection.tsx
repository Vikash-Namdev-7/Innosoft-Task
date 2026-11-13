import { useState } from "react";
import { FaLock, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { usePriceDropBlink } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectBet } from "@/store/slices/betSlice";
import type { RootState } from "@/store";
import BetSection from "@/components/markets/BetSection";

import type { FancyMarket, BetConfig } from "@/store/api/marketApi";

interface FancyMarketSectionProps {
  fancyMarkets: Record<string, FancyMarket[]>;
  eventId?: number;
  eventName?: string;
  betConfig?: BetConfig;
}

const CATEGORY_ORDER = [
  "Normal",
  "Over By Over",
  "Ball By Ball",
];

// Format odds size
function formatSize(size?: number) {
  if (size == null) return "";

  if (size >= 1000) {
    const k = size / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }

  return String(size);
}

// Fancy Odds Cell - exact colors and sizing as Tied Match
function FancyOddsCell({
  price,
  size,
  type,
  isUnavailable,
  isSuspended = false,
  onClick,
}: {
  price?: number;
  size?: number;
  type: "no" | "yes";
  isUnavailable: boolean;
  isSuspended?: boolean;
  onClick?: () => void;
}) {
  const unavailable = isSuspended || isUnavailable || price == null;

  const isBlinking = !isSuspended && usePriceDropBlink(price);

  const suspendedBgColor =
    type === "yes" ? "bg-[#293745]" : "bg-[#3b2a32]";

  const bgColor = isSuspended
    ? suspendedBgColor
    : unavailable
      ? type === "yes"
        ? "bg-[#72bbef]/50"
        : "bg-[#f994ba]/50"
      : type === "yes"
        ? "bg-[#72bbef]"
        : "bg-[#f994ba]";

  const activeBgColor = isBlinking
    ? "bg-[#facc15] animate-odds-blink text-black"
    : bgColor;

  return (
    <div
      onClick={() => {
        if (!unavailable && price != null) {
          onClick?.();
        }
      }}
      className={`flex h-8 w-full min-w-0 flex-col items-center justify-center rounded-full transition-colors duration-300 ${
        unavailable ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-110 active:scale-95'
      } ${activeBgColor}`}
    >
      {unavailable ? (
        <FaLock className={`text-[10px] ${isSuspended ? "text-gray-400" : "text-gray-600"}`} />
      ) : (
        <>
          <span className="text-[13px] sm:text-sm font-bold leading-tight text-black">
            {price}
          </span>

          <span className="text-[9px] sm:text-[9.5px] leading-tight text-black">
            {formatSize(size)}
          </span>
        </>
      )}
    </div>
  );
}

// Single Fancy Market Row
function FancyMarketRow({
  market,
  eventId,
  eventName,
  betConfig,
}: {
  market: FancyMarket;
  eventId?: number;
  eventName?: string;
  betConfig?: BetConfig;
}) {
  const dispatch = useDispatch();
  const activeBet = useSelector((state: RootState) => state.bet.activeBet);
  const runner = market.runners;

  const isSession =
    market.marketCategory?.toLowerCase().includes('session') ||
    market.gameType?.toLowerCase().includes('session') ||
    Boolean(market.ballSession);

  const defaultMinRate =
    isSession && betConfig?.sessionMinRate
      ? Number(betConfig.sessionMinRate)
      : betConfig?.fancyMinRate
        ? Number(betConfig.fancyMinRate)
        : undefined;

  const defaultMaxRate =
    isSession && betConfig?.sessionMaxRate
      ? Number(betConfig.sessionMaxRate)
      : betConfig?.fancyMaxRate
        ? Number(betConfig.fancyMaxRate)
        : undefined;

  const marketMinRate =
    market.minRate != null ? Number(market.minRate) : defaultMinRate;
  const marketMaxRate =
    market.maxRate != null ? Number(market.maxRate) : defaultMaxRate;

  const lay = runner?.lay?.[0];
  const back = runner?.back?.[0];

  const isSuspended =
    market.gameStatus?.toUpperCase() === "SUSPENDED" ||
    runner?.status?.toUpperCase() === "SUSPENDED";

  const isUnavailable =
    isSuspended ||
    runner?.status?.toUpperCase() !== "ACTIVE";

  const runnerSelectionId = String(runner?.selectionId ?? market.marketId);
  const isSelectedForBet =
    Boolean(activeBet) &&
    activeBet?.marketType === 'FANCY' &&
    (String(activeBet?.selectionId) === runnerSelectionId || activeBet?.marketId === market.marketId);

  return (
    <div className="w-full">
      <div className="grid min-h-9 grid-cols-[minmax(0,1fr)_54px_54px_56px] items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black sm:grid-cols-[minmax(0,1fr)_60px_60px_64px] sm:gap-1.5 sm:px-3">
        {/* Market Name - exact text size, weight and color as Tied Match */}
        <span className="min-w-0 truncate pl-1 text-[11px] font-semibold text-black sm:text-xs">
          {runner?.runnerName || market.marketName}
        </span>

        {/* No and Yes container */}
        {isSuspended ? (
          <div className="col-span-2 flex h-8 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#362731] via-[#2a303a] to-[#223344] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white select-none">
            SUSPENDED
          </div>
        ) : (
          <div className="col-span-2 grid grid-cols-2 gap-1 sm:gap-1.5">
            {/* No - Lay */}
            <FancyOddsCell
              price={lay?.price}
              size={lay?.size}
              type="no"
              isUnavailable={isUnavailable}
              onClick={() => {
                if (!eventId || lay?.price == null) return;
                dispatch(
                  selectBet({
                    eventId,
                    eventName: eventName || '',
                    marketId: market.marketId,
                    marketName: market.marketName,
                    marketCategory: market.marketCategory || 'fancy',
                    marketType: 'FANCY',
                    selectionId: String(runner?.selectionId ?? market.marketId),
                    runnerName: runner?.runnerName || market.marketName,
                    betOn: 'LAY',
                    rate: lay.price,
                    stake: 0,
                    position: 0,
                    fancyPercentage: lay.size || 100,
                    minBet: market.minBetAmount ?? 100,
                    maxBet: market.maxBetAmount ?? 10000,
                    minRate: marketMinRate,
                    maxRate: marketMaxRate,
                  })
                );
              }}
            />

            {/* Yes - Back */}
            <FancyOddsCell
              price={back?.price}
              size={back?.size}
              type="yes"
              isUnavailable={isUnavailable}
              onClick={() => {
                if (!eventId || back?.price == null) return;
                dispatch(
                  selectBet({
                    eventId,
                    eventName: eventName || '',
                    marketId: market.marketId,
                    marketName: market.marketName,
                    marketCategory: market.marketCategory || 'fancy',
                    marketType: 'FANCY',
                    selectionId: String(runner?.selectionId ?? market.marketId),
                    runnerName: runner?.runnerName || market.marketName,
                    betOn: 'BACK',
                    rate: back.price,
                    stake: 0,
                    position: 0,
                    fancyPercentage: back.size || 100,
                    minBet: market.minBetAmount ?? 100,
                    maxBet: market.maxBetAmount ?? 10000,
                    minRate: marketMinRate,
                    maxRate: marketMaxRate,
                  })
                );
              }}
            />
          </div>
        )}

        {/* Min / Max */}
        <div className="min-w-0 text-center text-[8px] leading-3 text-black sm:text-[9px]">
          <p className="whitespace-nowrap">
            MIN:{market.minBetAmount ?? "-"}
          </p>
          <p className="whitespace-nowrap">
            MAX:{formatSize(market.maxBetAmount) || "-"}
          </p>
        </div>
      </div>

      {/* Inline Bet Section directly under the clicked runner on small screens (< lg) */}
      {isSelectedForBet && (
        <div className="my-1.5 w-full lg:hidden">
          <BetSection isMobile />
        </div>
      )}
    </div>
  );
}

// Fancy Category Accordion
function FancyCategory({
  title,
  markets,
  eventId,
  eventName,
  betConfig,
}: {
  title: string;
  markets: FancyMarket[];
  eventId?: number;
  eventName?: string;
   betConfig?: BetConfig;
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (markets.length === 0) return null;

  return (
    <section className="space-y-1">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-full items-center justify-between rounded-full border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white"
      >
        <span className="flex min-w-0 items-center gap-2 text-xs font-bold sm:text-sm">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-black">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>

          <span className="truncate">{title}</span>
        </span>

        <div className="grid w-[164px] grid-cols-[54px_54px_56px] items-center gap-1 text-center text-[11px] font-bold sm:w-[184px] sm:grid-cols-[60px_60px_64px] sm:gap-1.5 sm:text-xs">
          <span>No</span>
          <span>Yes</span>
          <span></span>
        </div>
      </button>

      {/* Category Markets */}
      {isOpen && (
        <div className="space-y-1">
          {markets.map((market, index) => (
            <FancyMarketRow
              key={market.marketId || `${title}-${index}`}
              market={market}
              eventId={eventId}
              eventName={eventName}
              betConfig={betConfig}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Main Fancy Market Component
export default function FancyMarketSection({
  fancyMarkets,
  eventId,
  eventName,
  betConfig,
}: FancyMarketSectionProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const availableCategories = Object.keys(fancyMarkets ?? {});

  const categories = [
    ...CATEGORY_ORDER.filter((category) =>
      availableCategories.includes(category)
    ),
    ...availableCategories.filter(
      (category) => !CATEGORY_ORDER.includes(category)
    ),
  ];

  const filteredCategories =
    activeFilter === "All"
      ? categories
      : categories.filter((category) => category === activeFilter);

  const totalMarkets = Object.values(fancyMarkets ?? {}).reduce(
    (total, markets) => total + markets.length,
    0
  );

  if (totalMarkets === 0) return null;

  const filters = ["All", ...categories];

  return (
    <section className="min-w-0 space-y-2">
      {/* Main Fancy Header */}
      <div className="flex h-9 items-center rounded-full border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-900 to-slate-950 px-3 text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <FaLock className="text-xs" />
        </span>

        <h2 className="ml-2 text-xs font-bold uppercase sm:text-sm">
          Fancy
        </h2>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-gray-700 bg-[#151515] p-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-colors sm:text-xs ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-white hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Fancy Categories */}
      <div className="space-y-2">
        {filteredCategories.map((category) => (
          <FancyCategory
            key={category}
            title={category}
            markets={fancyMarkets[category] ?? []}
            eventId={eventId}
            eventName={eventName}
            betConfig={betConfig}
          />
        ))}
      </div>
    </section>
  );
}
