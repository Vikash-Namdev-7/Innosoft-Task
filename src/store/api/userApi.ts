
import { apiSlice } from "./apiSlice";

export interface UserProfile {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  dialCode: string;
  mobile: string;
  profileImage: string | null;
  isVerified: boolean;
  country: string;
  status: string;
}

// Profile update request
export interface UpdateProfileRequest {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  dialCode?: string;
  mobile?: string;
  mobileVerificationCode?: string;
  emailVerificationCode?: string;
  country?: string;
}

export interface Wallet {
  id: string;
  balance: number;
  exposure: number;
  // Handle both camelCase and snake_case from API
  bonusBalance: number;
  bonus_balance?: number;
  type: string;
}

export interface TransactionItem {
  id: string;
  walletId?: string;
  amount: string | number;
  availableBalance?: string | number;
  type: string;
  entityId?: string | null;
  context: string;
  meta?: any;
  narration: string;
  utr?: string | null;
  nonce?: string;
  status: string;
  remark?: string | null;
  timestamp: string;
  isCommissionSettled?: boolean;
  currencyId?: number;
  runningBalance?: number | string;
}

export interface TransactionPagination {
  currentPage: number;
  totalPage: number;
  totalItems: number;
  limit: number;
}

export interface TransactionsResponse {
  data: TransactionItem[];
  pagination: TransactionPagination;
}

export interface TransactionsQuery {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
  context?: string;
  t?: number;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Profile
    getMyProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["UserDetails"],
    }),

    // Update Profile
    updateMyProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["UserDetails"],
    }),

    // Get Wallets
    getMyWallets: builder.query<Wallet[], void>({
      query: () => ({
        url: "/users/me/wallets",
        method: "GET",
      }),
    }),

    // Get Transactions / Account Statement
    getMyTransactions: builder.query<TransactionsResponse, TransactionsQuery>({
      query: (params) => {
        const queryParams: Record<string, any> = {
          t: params.t ?? Date.now(),
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        };
        if (params.fromDate) queryParams.fromDate = params.fromDate;
        if (params.toDate) queryParams.toDate = params.toDate;
        if (params.type && params.type !== 'All') queryParams.type = params.type;
        if (params.context && params.context !== 'All') queryParams.context = params.context;

        return {
          url: '/users/me/transactions',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyWalletsQuery,
  useGetMyTransactionsQuery,
} = userApi;
