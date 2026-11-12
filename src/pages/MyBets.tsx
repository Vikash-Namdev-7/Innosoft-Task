import { useState, useRef, useMemo } from 'react';
import {
  IoDocumentTextOutline,
  IoReload,
  IoChevronDown,
  IoCalendarOutline,
} from 'react-icons/io5';

interface CurrentBetRecord {
  id: string;
  placeDate: string;
  sportName: string;
  eventName: string;
  market: string;
  betType: 'Back' | 'Lay';
  selection: string;
  userRate: number;
  amount: number;
  liability: number;
  potentialProfit: number;
}

interface PastBetRecord {
  id: string;
  placeDate: string;
  settledAt: string;
  sportName: string;
  eventName: string;
  market: string;
  betType: 'Back' | 'Lay';
  selection: string;
  userRate: number;
  amount: number;
  profitLoss: number;
  status: 'Won' | 'Lost' | 'Void' | 'Settled';
}

const CURRENT_BET_HEADERS = [
  'Place Date',
  'Sport Name',
  'Event Name',
  'Market',
  'Bet Type',
  'Selection',
  'User Rate',
  'Amount',
  'Liability',
  'Potential Profit',
];

const PAST_BET_HEADERS = [
  'Place Date',
  'Settled At',
  'Sport Name',
  'Event Name',
  'Market',
  'Bet Type',
  'Selection',
  'User Rate',
  'Amount',
  'Profit/Loss',
  'Status',
];

// Interactive Date Picker Dropdown Pill
function DatePickerPill({
  value,
  onChange,
}: {
  value: string; // "YYYY-MM-DD"
  onChange: (val: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Format "YYYY-MM-DD" to "DD/MM/YYYY"
  const displayDate = useMemo(() => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  }, [value]);

  const handleClick = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex h-9 min-w-[135px] cursor-pointer items-center justify-between gap-2.5 rounded-full border border-[#234278] bg-[#050c18] px-3.5 text-xs font-bold text-white transition hover:border-[#275cd1] sm:min-w-[145px] sm:text-sm"
    >
      <span className="tracking-wide select-none">{displayDate}</span>
      <IoCalendarOutline className="text-base text-white/90 shrink-0 pointer-events-none" />

      {/* Hidden date input with showPicker */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
      />
    </div>
  );
}

export default function MyBets() {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [selectedSport, setSelectedSport] = useState('All');
  const [startDate, setStartDate] = useState('2026-10-30');
  const [endDate, setEndDate] = useState('2026-11-06');
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock states for current & past bets
  const [currentBets] = useState<CurrentBetRecord[]>([]);
  const [pastBets] = useState<PastBetRecord[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const sportsOptions = [
    'All',
    'Cricket',
    'Soccer',
    'Tennis',
    'Kabaddi',
    'Horse Racing',
    'Greyhound Racing',
    'Casino',
  ];

  const headers = activeTab === 'current' ? CURRENT_BET_HEADERS : PAST_BET_HEADERS;
  const isCurrent = activeTab === 'current';
  const hasBets = isCurrent ? currentBets.length > 0 : pastBets.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl p-2 sm:p-3">
      {/* Outer Card Container */}
      <div className="w-full space-y-3.5 rounded-2xl border border-[#162e54] bg-[#071328] p-3.5 sm:p-5 shadow-2xl">
        {/* Top Header Banner: Bet History */}
        <div className="flex h-10 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1746a2] via-[#215bc9] to-[#12397e] px-4 text-white shadow-md">
          <IoDocumentTextOutline className="text-lg shrink-0 text-white" />
          <h1 className="text-sm font-semibold tracking-wide text-white">
            Bet History
          </h1>
        </div>

        {/* Filter & Refresh Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sports Dropdown */}
          <div className="relative inline-block w-48 sm:w-56">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="h-9 w-full appearance-none rounded-full border border-[#234278] bg-[#050c18] py-1 pl-4 pr-8 text-xs font-semibold text-white transition focus:border-[#275cd1] focus:outline-none sm:text-sm"
            >
              {sportsOptions.map((sport) => (
                <option key={sport} value={sport} className="bg-[#071328] text-white">
                  {sport}
                </option>
              ))}
            </select>
            <IoChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          </div>

          {/* Date range pickers (visible in Past Bet as per design) */}
          {!isCurrent && (
            <>
              <DatePickerPill value={startDate} onChange={setStartDate} />
              <DatePickerPill value={endDate} onChange={setEndDate} />
            </>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh bets"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#215bc9] text-white shadow transition-all hover:bg-[#1a4ea8] active:scale-95"
          >
            <IoReload
              className={`text-base transition-transform duration-500 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>

        {/* Tabs: Current Bet / Past Bet */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`h-8 rounded-full px-4 text-xs font-semibold transition sm:text-sm ${
              activeTab === 'current'
                ? 'bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Current Bet
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`h-8 rounded-full px-4 text-xs font-semibold transition sm:text-sm ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past Bet
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-[#1d3969] shadow-lg">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full min-w-[950px] border-collapse text-center">
              {/* Dynamic Table Header based on active tab */}
              <thead>
                <tr className="h-10 bg-gradient-to-r from-[#163f8c] via-[#2058c7] to-[#123777] text-xs font-semibold text-white sm:text-sm">
                  {headers.map((header, idx) => (
                    <th
                      key={header}
                      className={`px-3 py-2 font-semibold whitespace-nowrap ${
                        idx !== headers.length - 1 ? 'border-r border-white/10' : ''
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {!hasBets ? (
                  <tr className="h-10 bg-white">
                    <td
                      colSpan={headers.length}
                      className="py-3 text-center text-xs font-semibold text-gray-900 sm:text-sm"
                    >
                      No bets placed yet
                    </td>
                  </tr>
                ) : isCurrent ? (
                  currentBets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="border-t border-gray-200 bg-white text-xs text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{bet.placeDate}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.sportName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.eventName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.market}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            bet.betType === 'Back'
                              ? 'bg-[#72bbef] text-black'
                              : 'bg-[#f994ba] text-black'
                          }`}
                        >
                          {bet.betType}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.selection}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.userRate}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.amount}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold text-red-600">
                        {bet.liability}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold text-green-600">
                        {bet.potentialProfit}
                      </td>
                    </tr>
                  ))
                ) : (
                  pastBets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="border-t border-gray-200 bg-white text-xs text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{bet.placeDate}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.settledAt}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.sportName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.eventName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.market}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            bet.betType === 'Back'
                              ? 'bg-[#72bbef] text-black'
                              : 'bg-[#f994ba] text-black'
                          }`}
                        >
                          {bet.betType}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.selection}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.userRate}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.amount}</td>
                      <td
                        className={`px-3 py-2 whitespace-nowrap font-semibold ${
                          bet.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {bet.profitLoss >= 0 ? `+${bet.profitLoss}` : bet.profitLoss}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                            bet.status === 'Won'
                              ? 'bg-green-100 text-green-700'
                              : bet.status === 'Lost'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {bet.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination & Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1.5">
          {/* Rows per page */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="h-8.5 sm:h-9 appearance-none rounded-lg border border-[#234278] bg-[#050c18] py-1 pl-3 pr-7 text-xs font-semibold text-white focus:border-[#275cd1] focus:outline-none sm:text-sm"
            >
              <option value="10" className="bg-[#071328]">10</option>
              <option value="25" className="bg-[#071328]">25</option>
              <option value="50" className="bg-[#071328]">50</option>
              <option value="100" className="bg-[#071328]">100</option>
            </select>
            <IoChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          </div>

          {/* Active Page Number */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded bg-[#215bc9] text-xs font-bold text-white shadow sm:text-sm"
            >
              {currentPage}
            </button>
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8.5 sm:h-9 items-center gap-1 rounded-lg border border-[#234278] bg-[#050c18] px-3.5 text-xs font-semibold text-gray-300 transition hover:border-[#275cd1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex h-8.5 sm:h-9 items-center gap-1 rounded-lg border border-[#234278] bg-[#050c18] px-3.5 text-xs font-semibold text-gray-300 transition hover:border-[#275cd1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
