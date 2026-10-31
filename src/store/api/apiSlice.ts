import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState, endpoint }) => {
    // APIs where token should NOT be sent
    // const noAuthEndpoints = ['getEvents', 'getCatalogueByEventId', 'getcatalogueByEventId'];
    // if (noAuthEndpoints.includes(endpoint)) {
    //   return headers;
    // }

    const token = (getState() as RootState).auth.accessToken;
    const tempAuthToken = (getState() as RootState).auth.tempAuthToken;
    const finalToken = token || tempAuthToken;
    if (finalToken) {
      headers.set('authorization', `Bearer ${finalToken}`);
    }
    // headers.set('content-type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    setTimeout(() => {
      if (window.location.pathname === '/login') return;
      window.location.href = '/login';
    }, 2000);
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  tagTypes: [
    'UserDetails',
    'Auth',
    'Competitions',
    'Events',
    'Bookset',
    'StakeSet',
    'BetHistory',
    'OneClickBetting',
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = apiSlice;

export default apiSlice;
