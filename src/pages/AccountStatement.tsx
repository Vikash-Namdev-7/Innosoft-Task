import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RiBankLine } from 'react-icons/ri';
import { IoCalendarOutline, IoReload, IoChevronDown } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import type { RootState } from '@/store';
import {
  useGetMyTransactionsQuery,
  type TransactionItem,
} from '@/store/api/userApi';

const TYPE_OPTIONS = ['All', 'Debit', 'Credit'] as const;

const CONTEXT_OPTIONS = [
  'All',
  'Won',
  'Lost',
  'Bonus',
  'Sports Rollback',
  'Casino Rollback',
  'Deposit',
  'Withdrawal',
] as const;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Format ISO date string to "13-11-26, 5:30:29 PM" matching reference images
function formatTransactionTime(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch {
    return String(isoString);
  }
}

// Format numbers with 2 decimals
function formatAmount(val?: string | number | null): string {
  if (val == null || val === '') return '0.00';
  const num = Number(val);
  return isNaN(num) ? String(val) : num.toFixed(2);
}

// Date helpers: format "YYYY-MM-DD"
const getTodayString = (): string => new Date().toISOString().split('T')[0] ?? '';
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0] ?? '';
};

// Date Picker Dropdown Pill
function DatePickerPill({
  value,
  onChange,
  className = '',
}: {
  value: string; // "YYYY-MM-DD"
  onChange: (val: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Format "YYYY-MM-DD" to "DD/MM/YYYY" matching reference image
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
      className={`relative flex h-9 cursor-pointer items-center justify-between gap-2 rounded-full border border-gray-700 bg-black/80 px-3.5 text-xs sm:text-sm font-semibold text-white transition hover:border-gray-500 ${className}`}
    >
      <span className="tracking-wide select-none truncate">{displayDate}</span>
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

// Custom Dropdown Pill component matching Reference Images 4 & 5
function CustomDropdown({
  value,
  options,
  onChange,
  className = '',
}: {
  value: string;
  options: readonly string[];
  onChange: (val: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-full border border-gray-700 bg-black/80 px-3.5 text-xs sm:text-sm font-semibold text-white transition hover:border-gray-500"
      >
        <span className="truncate">{value}</span>
        <IoChevronDown
          className={`shrink-0 text-sm text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[140px] z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-700 bg-black p-1 shadow-2xl">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`flex w-full items-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-left transition ${
                value === opt
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountStatement() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isDemoUser = useSelector((state: RootState) => state.auth.isDemoUser);

  // Filter States
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All');
  const [startDate, setStartDate] = useState(() => getPastDateString(7));
  const [endDate, setEndDate] = useState(() => getTodayString());
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert dates to ISO strings for API
  const fromDate = useMemo(() => {
    if (!startDate) return undefined;
    try {
      const d = new Date(startDate);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    } catch {
      return undefined;
    }
  }, [startDate]);

  const toDate = useMemo(() => {
    if (!endDate) return undefined;
    try {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      return d.toISOString();
    } catch {
      return undefined;
    }
  }, [endDate]);

  // Stable query arguments (avoids infinite re-render loop by omitting dynamic Date.now())
  const queryArgs = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
    ...(selectedType && selectedType !== 'All' ? { type: selectedType } : {}),
    ...(selectedContext && selectedContext !== 'All' ? { context: selectedContext } : {}),
  }), [currentPage, pageSize, fromDate, toDate, selectedType, selectedContext]);

  // Fetch Transactions API
  const {
    data: responseData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyTransactionsQuery(queryArgs, {
    skip: !isAuthenticated,
  });

  // Transactions list: use server data when available
  const transactions: TransactionItem[] = useMemo(() => {
    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    return [];
  }, [responseData?.data]);

  const isInitialLoading = isLoading && !responseData;
  const pagination = responseData?.pagination;
  const totalPages = pagination?.totalPage || 1;

  // Refresh Handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Reset to page 1 on filter changes
  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    setCurrentPage(1);
  };

  const handleContextChange = (val: string) => {
    setSelectedContext(val);
    setCurrentPage(1);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setCurrentPage(1);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val: number) => {
    setPageSize(val);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-w-0 space-y-3 p-2 sm:p-3 text-white">
      {/* 1. Header Banner with Bank Icon (Blue gradient theme matching application) */}
      <div className="flex h-10 sm:h-11 w-full items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#1746a2] via-[#1c55bd] to-[#0c1a36] px-4 shadow-md">
        <RiBankLine className="text-lg sm:text-xl text-white shrink-0" />
        <h1 className="text-xs sm:text-sm font-bold tracking-wide text-white">
          Account Statement
        </h1>
      </div>

      {/* 2. Filters Section */}
      <div className="rounded-2xl border border-gray-800 bg-[#0d0d0d] p-3 sm:p-4 shadow-xl">
        {/* Desktop View: Single horizontal line aligned to the right (Image 2) */}
        <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3.5">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-300">Type</span>
            <CustomDropdown
              value={selectedType}
              options={TYPE_OPTIONS}
              onChange={handleTypeChange}
              className="w-28"
            />
          </div>

          {/* Context Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-300">Context</span>
            <CustomDropdown
              value={selectedContext}
              options={CONTEXT_OPTIONS}
              onChange={handleContextChange}
              className="w-40"
            />
          </div>

          {/* From Date */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-300">From</span>
            <DatePickerPill
              value={startDate}
              onChange={handleStartDateChange}
              className="w-36"
            />
          </div>

          {/* To Date */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-300">To</span>
            <DatePickerPill
              value={endDate}
              onChange={handleEndDateChange}
              className="w-36"
            />
          </div>

          {/* Circular Refresh Button with Blue Background (Image 2) */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Transactions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition active:scale-95"
          >
            <IoReload
              className={`text-base font-bold ${
                isRefreshing || isFetching ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile View: Stacked fields matching Image 1 */}
        <div className="space-y-3 lg:hidden">
          {/* Type (Full width) */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-300">
              Type
            </label>
            <CustomDropdown
              value={selectedType}
              options={TYPE_OPTIONS}
              onChange={handleTypeChange}
              className="w-full"
            />
          </div>

          {/* Context (Full width) */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-300">
              Context
            </label>
            <CustomDropdown
              value={selectedContext}
              options={CONTEXT_OPTIONS}
              onChange={handleContextChange}
              className="w-full"
            />
          </div>

          {/* From Date, To Date & Refresh Button in one row */}
          <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 pt-0.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300">
                From
              </label>
              <DatePickerPill
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-300">
                To
              </label>
              <DatePickerPill
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition active:scale-95 mb-0.5"
            >
              <IoReload
                className={`text-base font-bold ${
                  isRefreshing || isFetching ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Account Statement Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#0d0d0d] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse">
            {/* Table Header: Blue gradient replacing red from reference */}
            <thead>
              <tr className="h-11 sm:h-12 bg-gradient-to-r from-[#1746a2] via-[#1c55bd] to-[#0c1a36] text-white">
                <th className="px-4 py-3 text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap rounded-tl-2xl">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Transaction Time
                </th>
                <th className="px-4 py-3 text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Context
                </th>
                <th className="px-4 py-3 text-center text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap rounded-tr-2xl">
                  Balance
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isInitialLoading ? (
                <tr>
                  <td colSpan={8} className="bg-white py-10 text-center text-gray-600">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span className="text-xs sm:text-sm font-medium">
                        Loading statement...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : error && (error as any)?.status !== 404 ? (
                <tr>
                  <td colSpan={8} className="bg-white py-8 text-center text-red-600">
                    <p className="text-xs sm:text-sm font-bold">
                      Failed to load account statement.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-500"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="bg-white py-3.5 sm:py-4 text-center text-xs sm:text-sm font-normal text-black"
                  >
                    No transaction found
                  </td>
                </tr>
              ) : (
                transactions.map((tx: TransactionItem) => {
                  const isCredit = String(tx.type).toLowerCase() === 'credit';
                  const isConfirmed = String(tx.status).toLowerCase() === 'confirmed';

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-200 bg-white text-black transition hover:bg-gray-50/80"
                    >
                      {/* 1. Transaction ID */}
                      <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-black whitespace-nowrap">
                        {tx.id}
                      </td>

                      {/* 2. Transaction Time (13-11-26, 5:30:29 PM) */}
                      <td className="px-4 py-3.5 text-xs sm:text-sm font-normal text-black whitespace-nowrap">
                        {formatTransactionTime(tx.timestamp)}
                      </td>

                      {/* 3. Description */}
                      <td className="px-4 py-3.5 text-xs sm:text-sm font-medium text-black">
                        <span className="block max-w-[260px] truncate sm:max-w-none">
                          {tx.narration || '-'}
                        </span>
                      </td>

                      {/* 4. Type (Pill Badge: Credit / Debit) */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                            isCredit
                              ? 'border border-[#22c55e] text-[#16a34a] bg-white'
                              : 'border border-[#ef4444] text-[#dc2626] bg-white'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      {/* 5. Amount (+1000.00 / -500.00) */}
                      <td className="px-4 py-3.5 text-right text-xs sm:text-sm font-bold whitespace-nowrap">
                        <span
                          className={isCredit ? 'text-[#16a34a]' : 'text-[#dc2626]'}
                        >
                          {isCredit ? '+' : '-'}
                          {formatAmount(tx.amount)}
                        </span>
                      </td>

                      {/* 6. Context (Deposit, Won, Lost, etc.) */}
                      <td className="px-4 py-3.5 text-left text-xs sm:text-sm font-medium text-black whitespace-nowrap">
                        {tx.context || '-'}
                      </td>

                      {/* 7. Status (Confirmed solid green badge) */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-sm ${
                            isConfirmed ? 'bg-[#107c41]' : 'bg-yellow-600'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      {/* 8. Balance */}
                      <td className="px-4 py-3.5 text-right text-xs sm:text-sm font-bold text-black whitespace-nowrap">
                        {formatAmount(tx.runningBalance ?? tx.availableBalance)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Pagination Section matching reference images */}
      <div className="flex items-center justify-between pt-1 text-white">
        {/* Left: Page Size Select Dropdown */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 appearance-none rounded-lg border border-gray-700 bg-[#111111] pl-3 pr-7 text-xs font-bold text-white transition focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <IoChevronDown className="pointer-events-none absolute right-2 top-2.5 text-xs text-gray-400" />
        </div>

        {/* Center: Current Page Badge (Blue box matching theme) */}
        <div className="flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow">
            {currentPage}
          </div>
        </div>

        {/* Right: Previous & Next Controls */}
        <div className="flex items-center gap-1.5">
          {/* Desktop Previous / Next with text (Image 2) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-[#111111] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
            >
              <FaChevronLeft className="text-[10px]" />
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-[#111111] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
            >
              Next
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          {/* Mobile Previous / Next icon buttons (Image 1) */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-[#111111] text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              title="Previous Page"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-[#111111] text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              title="Next Page"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

