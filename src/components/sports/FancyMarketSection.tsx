import { useState } from "react";
import { FaLock, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { usePriceDropBlink } from "@/hooks";

import type { FancyMarket } from "@/store/api/sportApi";

interface FancyMarketSectionProps {
  fancyMarkets: Record<string, FancyMarket[]>;
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
}: {
  price?: number;
  size?: number;
  type: "no" | "yes";
  isUnavailable: boolean;
  isSuspended?: boolean;
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
      className={`flex h-8 w-full min-w-0 flex-col items-center justify-center rounded-full transition-colors duration-300 ${activeBgColor}`}
    >
      {unavailable ? (
        <FaLock className={`text-[10px] ${isSuspended ? "text-gray-400" : "text-gray-600"}`} />
      ) : (
        <>
          <span className="text-xs font-bold leading-3 text-black">
            {price}
          </span>

          <span className="text-[9px] leading-3 text-black">
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
}: {
  market: FancyMarket;
}) {
  const runner = market.runners;

  const lay = runner?.lay?.[0];
  const back = runner?.back?.[0];

  const isSuspended =
    market.gameStatus?.toUpperCase() === "SUSPENDED" ||
    runner?.status?.toUpperCase() === "SUSPENDED";

  const isUnavailable =
    isSuspended ||
    runner?.status?.toUpperCase() !== "ACTIVE";

  return (
    <div className="grid min-h-9 grid-cols-[minmax(0,1fr)_54px_54px_56px] items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-black sm:grid-cols-[minmax(0,1fr)_60px_60px_64px] sm:gap-1.5 sm:px-3">
      {/* Market Name - exact text size, weight and color as Tied Match */}
      <span className="min-w-0 truncate pl-1 text-[11px] font-semibold text-black sm:text-xs">
        {runner?.runnerName || market.marketName}
      </span>

      {/* No and Yes container */}
      <div className="relative col-span-2 grid grid-cols-2 gap-1 sm:gap-1.5">
        {/* No - Lay */}
        <FancyOddsCell
          price={lay?.price}
          size={lay?.size}
          type="no"
          isUnavailable={isUnavailable}
          isSuspended={isSuspended}
        />

        {/* Yes - Back */}
        <FancyOddsCell
          price={back?.price}
          size={back?.size}
          type="yes"
          isUnavailable={isUnavailable}
          isSuspended={isSuspended}
        />

        {/* Centered SUSPENDED Overlay when suspended */}
        {isSuspended && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] select-none">
              SUSPENDED
            </span>
          </div>
        )}
      </div>

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
  );
}

// Fancy Category Accordion
function FancyCategory({
  title,
  markets,
}: {
  title: string;
  markets: FancyMarket[];
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
          />
        ))}
      </div>
    </section>
  );
}
