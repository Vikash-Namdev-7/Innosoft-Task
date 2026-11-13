import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDemoLogin, logout } from './authSlice';

export interface ActiveBet {
  eventId: number;
  eventName: string;
  marketId: string;
  marketName: string;
  marketCategory: string;
  marketType: string;
  selectionId: string;
  runnerName: string;
  betOn: 'BACK' | 'LAY';
  rate: number;
  stake: number;
  position: number;
  fancyPercentage: number;
  minBet?: number;
  maxBet?: number;
  minRate?: number;
  maxRate?: number;
}

export interface PlacedBet {
  id: string;
  eventId: number;
  eventName: string;
  marketId: string;
  marketName: string;
  marketCategory?: string;
  marketType: string;
  selectionId: string;
  runnerName: string;
  betOn: 'BACK' | 'LAY';
  rate: number;
  stake: number;
  position?: number;
  fancyPercentage?: number;
  status: 'OPEN' | 'SETTLED' | 'CANCELLED';
  placedAt: string;
}

interface BetState {
  activeBet: ActiveBet | null;
  isOpenMobile: boolean;
  placedBets: PlacedBet[];
}

function loadPlacedBets(): PlacedBet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('unsettled_placed_bets');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function savePlacedBets(bets: PlacedBet[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('unsettled_placed_bets', JSON.stringify(bets));
  } catch {}
}

const initialState: BetState = {
  activeBet: null,
  isOpenMobile: false,
  placedBets: loadPlacedBets(),
};

export const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    selectBet: (state, action: PayloadAction<ActiveBet>) => {
      state.activeBet = action.payload;
      state.isOpenMobile = true;
    },
    setStake: (state, action: PayloadAction<number>) => {
      if (state.activeBet) {
        state.activeBet.stake = Math.max(0, action.payload);
      }
    },
    addStake: (state, action: PayloadAction<number>) => {
      if (state.activeBet) {
        state.activeBet.stake = (state.activeBet.stake || 0) + action.payload;
      }
    },
    setRate: (state, action: PayloadAction<number>) => {
      if (state.activeBet) {
        state.activeBet.rate = Math.max(0, action.payload);
      }
    },
    clearBet: (state) => {
      state.activeBet = null;
      state.isOpenMobile = false;
    },
    closeMobileBetSlip: (state) => {
      state.isOpenMobile = false;
      state.activeBet = null;
    },
    recordPlacedBet: (state, action: PayloadAction<PlacedBet>) => {
      state.placedBets.unshift(action.payload);
      savePlacedBets(state.placedBets);
    },
    settleBet: (state, action: PayloadAction<string>) => {
      state.placedBets = state.placedBets.filter((b) => b.id !== action.payload);
      savePlacedBets(state.placedBets);
    },
    settleEventBets: (state, action: PayloadAction<number | string>) => {
      state.placedBets = state.placedBets.filter(
        (b) => String(b.eventId) !== String(action.payload)
      );
      savePlacedBets(state.placedBets);
    },
    clearAllPlacedBets: (state) => {
      state.placedBets = [];
      savePlacedBets([]);
    },
  },
  extraReducers: (builder) => {
    // Reset placed bets and active bet when a demo user logs in fresh or logs out
    builder
      .addCase(setDemoLogin, (state) => {
        state.placedBets = [];
        state.activeBet = null;
        state.isOpenMobile = false;
        savePlacedBets([]);
      })
      .addCase(logout, (state) => {
        state.placedBets = [];
        state.activeBet = null;
        state.isOpenMobile = false;
        savePlacedBets([]);
      });
  },
});

export const {
  selectBet,
  setStake,
  addStake,
  setRate,
  clearBet,
  closeMobileBetSlip,
  recordPlacedBet,
  settleBet,
  settleEventBets,
  clearAllPlacedBets,
} = betSlice.actions;

export default betSlice.reducer;

