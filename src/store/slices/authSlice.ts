import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  tempAuthToken: string | null;
  isAuthenticated: boolean;
  isDemoUser: boolean;
  demoBalance: number;
  demoExposure: number;
  isLoading: boolean;
  error: string | null;
}

// Get initial token from cookies
const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('authToken') || null;
};

const isDemoSaved =
  typeof window !== 'undefined' && localStorage.getItem('is_demo_user') === 'true';

const savedDemoBalance =
  typeof window !== 'undefined' && localStorage.getItem('demo_balance')
    ? Number(localStorage.getItem('demo_balance'))
    : 1000;

const savedDemoExposure =
  typeof window !== 'undefined' && localStorage.getItem('demo_exposure')
    ? Number(localStorage.getItem('demo_exposure'))
    : 0;

const initialState: AuthState = {
  accessToken: getInitialToken(),
  tempAuthToken: null,
  isAuthenticated: Boolean(getInitialToken()) || isDemoSaved,
  isDemoUser: isDemoSaved,
  demoBalance: savedDemoBalance,
  demoExposure: savedDemoExposure,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set token after successful login
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.accessToken = token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;

      // Save in cookie (1 day expiry)
      Cookies.set('authToken', token, {
        expires: 1, // 1 day
        secure: true,
        sameSite: 'strict',
      });
    },

    // Set demo login with clean initial 1000 balance and fresh session
    setDemoLogin: (state, action: PayloadAction<string | undefined>) => {
      state.isDemoUser = true;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;

      const token = action.payload || 'demo_token_user';
      state.accessToken = token;

      // Always reset demo balance to ₹1000 and exposure to 0 on fresh login
      state.demoBalance = 1000;
      state.demoExposure = 0;

      if (typeof window !== 'undefined') {
        localStorage.setItem('is_demo_user', 'true');
        localStorage.setItem('demo_balance', '1000');
        localStorage.setItem('demo_exposure', '0');
        // Clear all previously placed demo bets so fresh session starts empty
        localStorage.removeItem('demo_placed_bets');
        localStorage.removeItem('unsettled_placed_bets');
      }

      Cookies.set('authToken', token, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });
    },

    // Deduct demo balance when placing a bet
    deductDemoBalance: (
      state,
      action: PayloadAction<{ stake: number; liability?: number }>
    ) => {
      state.demoBalance = Math.max(0, state.demoBalance - action.payload.stake);
      state.demoExposure =
        (state.demoExposure || 0) + (action.payload.liability ?? action.payload.stake);

      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_balance', String(state.demoBalance));
        localStorage.setItem('demo_exposure', String(state.demoExposure));
      }
    },

    // Reset demo balance back to 1000
    resetDemoBalance: (state) => {
      state.demoBalance = 1000;
      state.demoExposure = 0;
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_balance', '1000');
        localStorage.setItem('demo_exposure', '0');
      }
    },

    setTempAuthToken: (state, action: PayloadAction<string | null>) => {
      state.tempAuthToken = action.payload;
    },

    // Remove token on logout and clean demo session
    logout: (state) => {
      const wasDemo = state.isDemoUser;
      state.accessToken = null;
      state.tempAuthToken = null;
      state.isAuthenticated = false;
      state.isDemoUser = false;
      state.demoBalance = 1000;
      state.demoExposure = 0;
      state.isLoading = false;
      state.error = null;

      // Remove from cookie and storage
      Cookies.remove('authToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('is_demo_user');
        localStorage.removeItem('demo_balance');
        localStorage.removeItem('demo_exposure');
        // If demo session, clear all demo bets from storage
        if (wasDemo) {
          localStorage.removeItem('demo_placed_bets');
          localStorage.removeItem('unsettled_placed_bets');
        }
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setToken,
  setDemoLogin,
  deductDemoBalance,
  resetDemoBalance,
  setTempAuthToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
