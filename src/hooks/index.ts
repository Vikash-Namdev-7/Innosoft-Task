// Export all custom hooks for easy importing
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useThrottle, useThrottledValue } from './useThrottle';
export { useClipboard, useAutoCopy } from './useClipboard';
export {
  useOutsideClick,
  useOutsideClickMultiple,
  useToggleWithOutsideClick,
} from './useOutsideClick';
export { useLocalStorage } from './useLocalStorage';
export { usePriceDropBlink, usePriceIncreaseBlink } from './usePriceDropBlink';

// Redux hooks
export { useAppDispatch, useAppSelector, useAuth, useProfile, useIsAuthenticated } from './redux';
