import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline, IoChevronBack, IoAdd, IoRemove } from 'react-icons/io5';
import {
  useGetStakesetQuery,
  useUpdateStakesetMutation,
  parseStakeSetResponse,
  type StakeSetItem,
} from '@/store/api/marketApi';

export type StakeItem = StakeSetItem;

// 9 default Stake values
const DEFAULT_STAKES: StakeItem[] = [
    { id: 1, label: '100', value: 100 },
    { id: 2, label: '500', value: 500 },
    { id: 3, label: '1000', value: 1000 },
    { id: 4, label: '5000', value: 5000 },
    { id: 5, label: '10000', value: 10000 },
    { id: 6, label: '25000', value: 25000 },
    { id: 7, label: '50000', value: 50000 },
    { id: 8, label: '100000', value: 100000 },
    { id: 9, label: '500000', value: 500000 },
];

export default function StakeSettings() {
    const navigate = useNavigate();
    const [stakes, setStakes] = useState<StakeItem[]>(DEFAULT_STAKES);
    const [showSavedToast, setShowSavedToast] = useState(false);

    // Call GET /stakeset automatically on navigating to Stake Settings
    const { data: stakesetData, isFetching: isStakesetFetching } = useGetStakesetQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateStakesetApi, { isLoading: isSavingApi }] = useUpdateStakesetMutation();

    // Populate from API response whenever stakesetData is loaded
    useEffect(() => {
        if (stakesetData) {
            const parsed = parseStakeSetResponse(stakesetData);
            if (parsed && parsed.length > 0) {
                setStakes(parsed);
            }
        }
    }, [stakesetData]);

    // Clean up any old localStorage key from earlier versions
    useEffect(() => {
        try {
            localStorage.removeItem('user_stake_settings');
        } catch {}
    }, []);

    // Handle label change - ONLY changes label, NEVER touches value
    const handleLabelChange = (id: number, newLabel: string) => {
        setStakes((prev) =>
            prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
        );
    };

    // Handle value change directly - ONLY changes value, NEVER touches label
    const handleValueChange = (id: number, val: number) => {
        const safeVal = Math.max(0, isNaN(val) ? 0 : val);
        setStakes((prev) =>
            prev.map((item) => (item.id === id ? { ...item, value: safeVal } : item))
        );
    };

    // Handle increment and decrement in amount with smart step - ONLY changes value, NEVER touches label
    const handleStep = (id: number, direction: 1 | -1) => {
        setStakes((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                let step = 100;
                if (item.value >= 100000) step = 50000;
                else if (item.value >= 10000) step = 5000;
                else if (item.value >= 1000) step = 500;
                else if (item.value <= 100) step = 50;

                const nextVal = Math.max(0, item.value + direction * step);
                return { 
                    ...item, 
                    value: nextVal,
                };
            })
        );
    };

    // Save changes directly via API
    const handleSave = async () => {
        try {
            await updateStakesetApi({ stakes }).unwrap();
        } catch (err) {
            console.error('Failed to update stakes via API:', err);
        }
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2500);
    };

    const handleReset = () => {
        setStakes(DEFAULT_STAKES);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2500);
    };

    return (
        <div className="mx-auto w-full max-w-7xl min-h-[calc(100vh-56px)] p-2 sm:p-4 flex flex-col justify-between">
            <div>
                {/* Mobile Back Button (only on small screens) */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white sm:hidden"
                >
                    <IoChevronBack className="text-base" />
                    <span>Back</span>
                </button>

                {/* Master Outer Box (encloses header, subtitle and 9 cards matching reference layout) */}
                <div className="w-full rounded-3xl border border-white/10 bg-[#060b14] p-3 sm:p-5 shadow-2xl space-y-3.5">
                    {/* Top Header Banner */}
                    <div className="flex h-11 w-full items-center justify-between rounded-full bg-gradient-to-r from-[#1746a2] via-[#215bc9] to-[#12397e] px-4 sm:px-6 shadow-md text-white">
                        <div className="flex items-center gap-2.5">
                            <IoSettingsOutline className="text-lg sm:text-xl text-white" />
                            <h1 className="text-xs font-bold uppercase tracking-wide sm:text-sm">
                                Stake Settings
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-full bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold text-white/90 transition active:scale-95"
                                title="Reset to default stakes"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-full bg-[#087BC1] hover:bg-[#066ba8] px-5 sm:px-6 py-1 text-xs font-bold text-white shadow transition active:scale-95 sm:text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Saved Success Toast */}
                    {showSavedToast && (
                        <div className="rounded-lg bg-emerald-900/90 border border-emerald-500 py-1.5 px-3 text-center text-xs font-semibold text-emerald-200 shadow">
                            Stake settings saved successfully!
                        </div>
                    )}

                    {/* Subtitle text */}
                    <p className="px-1 text-xs font-semibold text-gray-200 sm:text-sm">
                        Change your input variable and label setting:
                    </p>

                    {/* 3 Columns Grid across full screen width */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {stakes.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-0 overflow-hidden space-y-3 rounded-2xl border border-white/10 bg-[#080d19] p-3.5 sm:p-4 shadow-lg transition hover:border-blue-500/50"
                            >
                                {/* Row 1: Button Label */}
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                    <span className="w-24 sm:w-28 shrink-0 text-xs sm:text-sm font-bold text-white">
                                        Button Label
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => handleLabelChange(item.id, e.target.value)}
                                            className="h-10 w-full rounded-full bg-[#111726] pl-5 sm:pl-6 pr-4 text-left text-sm sm:text-base font-bold text-white outline-none border border-white/10 focus:border-blue-500 shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Input Value with Minus [-] and Plus [+] Steppers */}
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                    <span className="w-24 sm:w-28 shrink-0 text-xs sm:text-sm font-bold text-white">
                                        Input Value
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex h-10 w-full items-center justify-between rounded-full bg-[#111726] px-1.5 border border-white/10 shadow-inner">
                                            {/* Minus button */}
                                            <button
                                                type="button"
                                                onClick={() => handleStep(item.id, -1)}
                                                className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow transition active:scale-90"
                                                title="Decrease"
                                            >
                                                <IoRemove className="text-base font-bold" />
                                            </button>

                                            {/* Value input (centered) */}
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => handleValueChange(item.id, parseInt(e.target.value) || 0)}
                                                className="w-full min-w-0 text-center text-sm sm:text-base font-bold text-white bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />

                                            {/* Plus button */}
                                            <button
                                                type="button"
                                                onClick={() => handleStep(item.id, 1)}
                                                className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow transition active:scale-90"
                                                title="Increase"
                                            >
                                                <IoAdd className="text-base font-bold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-8 pb-4 text-center text-[11px] font-semibold tracking-wider text-gray-500">
                RULES AND REGULATIONS © 2026
            </div>
        </div>
    );
}
