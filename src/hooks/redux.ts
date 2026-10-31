import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience hooks for common state selections
export const useAuth = () => useAppSelector((state) => state.auth);

// Hook for checking authentication status
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
