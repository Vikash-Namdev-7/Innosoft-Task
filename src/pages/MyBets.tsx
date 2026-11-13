import { useState, useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  IoDocumentTextOutline,
  IoReload,
  IoChevronDown,
  IoCalendarOutline,
} from 'react-icons/io5';
import {
  useGetBetHistoryQuery,
  type BetHistoryItem,
} from '@/store/api/marketApi';

interface BetDisplayRecord {
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
  liability: number;
  potentialProfit: number;
  profitLoss: number;
  status: string;
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

// Helper to format values to exactly 2 decimal places
const format2Decimals = (val: number | string | undefined | null): string => {
  if (val == null || val === '') return '0.00';
  const num = Number(val);
  return isNaN(num) ? String(val) : num.toFixed(2);
};

const getTodayString = (): string => new Date().toISOString().split('T')[0] ?? '';
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0] ?? '';
};

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
  const isDemoUser = useSelector((state: RootState) => state.auth.isDemoUser);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [selectedSport, setSelectedSport] = useState('All');
  const [startDate, setStartDate] = useState(() => getPastDateString(7));
  const [endDate, setEndDate] = useState(() => getTodayString());
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Date filters in ISO format for Bet History API
  const fromDate = useMemo(() => {
    if (!startDate || activeTab === 'current') return undefined;
    try {
      const d = new Date(startDate);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    } catch {
      return undefined;
    }
  }, [startDate, activeTab]);

  const toDate = useMemo(() => {
    if (!endDate || activeTab === 'current') return undefined;
    try {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      return d.toISOString();
    } catch {
      return undefined;
    }
  }, [endDate, activeTab]);

  const betTime: 'CURRENT' | 'PAST' = activeTab === 'current' ? 'CURRENT' : 'PAST';

  // Query Bet History API with pagination and filters
  const {
    data: historyResponse,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    error: historyError,
    refetch: refetchHistory,
  } = useGetBetHistoryQuery(
    {
      page: currentPage,
      limit: Number(pageSize) || 10,
      betTime,
      ...(fromDate ? { fromDate } : {}),
      ...(toDate ? { toDate } : {}),
      ...(selectedSport && selectedSport !== 'All' ? { sport: selectedSport } : {}),
    },
    {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchHistory().unwrap();
    } catch {}
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Reset page when tab, sport or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSport, pageSize]);

  // Combine API bets with local demo fallback (if in demo mode and API returns 0 items)
  const displayBets: BetDisplayRecord[] = useMemo(() => {
    const apiBets = historyResponse?.bets;
    if (Array.isArray(apiBets) && apiBets.length > 0) {
      return apiBets.map((b: BetHistoryItem) => {
        const placeDateFormatted = b.placedAt
          ? new Date(b.placedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : '-';
        const settledAtFormatted = b.settledAt
          ? new Date(b.settledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : '-';
        const isBack = String(b.betOn).toUpperCase() === 'BACK';
        const amountNum = Number(b.amount) || 0;
        const oddsNum = Number(b.odds) || 1;
        const profitLossVal =
          b.profitLoss ?? (b.payout !== undefined ? Number(b.payout) - amountNum : 0);

        const liabilityVal =
          b.liability ??
          (isBack ? amountNum : Number((amountNum * Math.max(0, oddsNum - 1)).toFixed(2)));
        const potentialProfitVal =
          b.potentialProfit ??
          (isBack ? Number((amountNum * Math.max(0, oddsNum - 1)).toFixed(2)) : amountNum);

        return {
          id: String(b.id),
          placeDate: placeDateFormatted,
          settledAt: settledAtFormatted,
          sportName: b.sport || 'Cricket',
          eventName: b.event?.name || 'Match',
          market: b.marketName || 'Match Odds',
          betType: isBack ? 'Back' : 'Lay',
          selection: b.selection || 'Runner',
          userRate: oddsNum,
          amount: amountNum,
          liability: liabilityVal,
          potentialProfit: potentialProfitVal,
          profitLoss: profitLossVal,
          status: b.status || (activeTab === 'current' ? 'Pending' : 'Settled'),
        };
      });
    }

    // Local demo fallback for demo users when API has no records
    if (isDemoUser && typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('demo_placed_bets') || '[]');
        if (Array.isArray(stored)) {
          return stored
            .filter((b: any) => {
              if (
                selectedSport &&
                selectedSport !== 'All' &&
                b.sportName &&
                b.sportName.toLowerCase() !== selectedSport.toLowerCase()
              ) {
                return false;
              }
              const isPending =
                !b.status ||
                b.status.toUpperCase() === 'OPEN' ||
                b.status.toUpperCase() === 'PENDING';
              return activeTab === 'current' ? isPending : !isPending;
            })
            .map((b: any) => ({
              id: String(b.id),
              placeDate: b.placeDate || new Date().toLocaleString('en-IN'),
              settledAt: b.settledAt || '-',
              sportName: b.sportName || 'Cricket',
              eventName: b.eventName || 'Match',
              market: b.market || 'Match Odds',
              betType: b.betType === 'Lay' ? 'Lay' : 'Back',
              selection: b.selection || 'Runner',
              userRate: Number(b.userRate) || 1,
              amount: Number(b.amount) || 0,
              liability: Number(b.liability) || 0,
              potentialProfit: Number(b.potentialProfit) || 0,
              profitLoss: Number(b.profitLoss) || 0,
              status: b.status || (activeTab === 'current' ? 'Pending' : 'Settled'),
            }));
        }
      } catch {}
    }

    return [];
  }, [historyResponse?.bets, isDemoUser, activeTab, selectedSport]);

  const totalItems =
    historyResponse?.pagination?.totalItems !== undefined
      ? historyResponse.pagination.totalItems
      : displayBets.length;

  const totalPages =
    historyResponse?.pagination?.totalPage !== undefined && historyResponse.pagination.totalPage > 0
      ? historyResponse.pagination.totalPage
      : Math.max(1, Math.ceil(totalItems / (Number(pageSize) || 10)));

  const sportsOptions = [
    'All',
    'Cricket',
    'Soccer',
    'Tennis',
    'Basketball',
    'HorseRacing',
    'Greyhound',
    'Other',
  ];

  const headers = activeTab === 'current' ? CURRENT_BET_HEADERS : PAST_BET_HEADERS;
  const isCurrent = activeTab === 'current';
  const hasBets = displayBets.length > 0;
  const isLoading = (isHistoryLoading || isHistoryFetching) && !isRefreshing;

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
              <DatePickerPill value={startDate ?? ''} onChange={setStartDate} />
              <DatePickerPill value={endDate ?? ''} onChange={setEndDate} />
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
                isRefreshing || isHistoryFetching ? 'animate-spin' : ''
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
                {isLoading ? (
                  <tr className="h-20 bg-white">
                    <td
                      colSpan={headers.length}
                      className="py-6 text-center text-xs font-semibold text-gray-700 sm:text-sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <IoReload className="animate-spin text-lg text-[#215bc9]" />
                        <span>Loading bets...</span>
                      </div>
                    </td>
                  </tr>
                ) : historyError && displayBets.length === 0 ? (
                  <tr className="h-14 bg-white">
                    <td
                      colSpan={headers.length}
                      className="py-4 text-center text-xs font-semibold text-red-600 sm:text-sm"
                    >
                      Unable to fetch bet history. Please try refreshing.
                    </td>
                  </tr>
                ) : !hasBets ? (
                  <tr className="h-10 bg-white">
                    <td
                      colSpan={headers.length}
                      className="py-4 text-center text-xs font-semibold text-gray-900 sm:text-sm"
                    >
                      No bets placed yet
                    </td>
                  </tr>
                ) : isCurrent ? (
                  displayBets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="border-t border-gray-200 bg-white text-xs text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{bet.placeDate}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.sportName}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{bet.eventName}</td>
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
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{bet.selection}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.userRate}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{format2Decimals(bet.amount)}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold text-red-600">
                        {format2Decimals(bet.liability)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold text-green-600">
                        {format2Decimals(bet.potentialProfit)}
                      </td>
                    </tr>
                  ))
                ) : (
                  displayBets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="border-t border-gray-200 bg-white text-xs text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{bet.placeDate}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.settledAt}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{bet.sportName}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{bet.eventName}</td>
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
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{bet.selection}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{bet.userRate}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{format2Decimals(bet.amount)}</td>
                      <td
                        className={`px-3 py-2 whitespace-nowrap font-semibold ${
                          bet.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {bet.profitLoss >= 0 ? `+${format2Decimals(bet.profitLoss)}` : format2Decimals(bet.profitLoss)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                            bet.status?.toLowerCase() === 'won'
                              ? 'bg-green-100 text-green-700'
                              : bet.status?.toLowerCase() === 'lost'
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
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <span className="hidden sm:inline">Page</span>
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#215bc9] text-xs font-bold text-white shadow sm:text-sm">
              {currentPage}
            </span>
            <span className="hidden sm:inline">of {totalPages}</span>
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8.5 sm:h-9 items-center gap-1 rounded-lg border border-[#234278] bg-[#050c18] px-3.5 text-xs font-semibold text-gray-300 transition hover:border-[#275cd1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
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
