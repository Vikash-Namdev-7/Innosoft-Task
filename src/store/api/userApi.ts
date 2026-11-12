
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
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyWalletsQuery,
} = userApi;
