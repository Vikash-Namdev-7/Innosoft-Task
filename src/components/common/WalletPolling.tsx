import { useSelector } from 'react-redux';
import { useGetMyWalletsQuery } from '@/store/api/userApi';
import type { RootState } from '@/store';

export default function WalletPolling() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Polls wallet API every 2 seconds when user is authenticated
  useGetMyWalletsQuery(undefined, {
    pollingInterval: 2000,
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  return null;
}