import ForgotPassword from '@/pages/auth/ForgotPassword';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    // login: builder.mutation<
    //   {
    //     success: boolean;
    //     accessToken?: string;
    //     type: string;
    //     role: { id: number; name: string };
    //     passwordChanged: boolean;
    //     mfaRequired?: boolean;
    //     isTelegramEnabled?: boolean;
    //   },
    //   {
    //     username: string;
    //     password: string;
    //     device: string;
    //     isTermCondition: boolean;
    //   }
    // >({
    //   query: (body) => ({
    //     url: '/auth/login',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    //logout
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // change password
    changePassword: builder.mutation({
      query: (body: { oldPassword: string; newPassword: string }) => ({
        url: '/users/me/change-password',
        method: 'POST',
        body,
      }),
    }),

    //Demo Login
    demoLogin: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/demo/login',
        method: 'POST',
      }),
    }),

    sendOtp: builder.mutation<
      any,
      {
        mobile: string;
        type: 'register' | 'forgot-password';
        email?: string;
        country?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/send-code', // Actual backend endpoint se replace karo
        method: 'POST',
        body,
      }),
    }),

    register: builder.mutation<
      any,
      {
        username: string;
        password: string;
        referralCode?: string;
        firstname?: string;
        lastname?: string;
        email?: string;
        dialCode?: string;
        mobile?: string;
        country?: string;
        emailVerificationCode?: string;
        mobileVerificationCode?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<
      {
        success: boolean;
        accessToken: string;
        type: string;
        role: {
          id: number;
          name: string;
        };
        passwordChanged: boolean;
        isSelfRegistered: boolean;
      },
      {
        password: string;
        username: string;
        device: string;
        captchaId?: string;
        captchaText?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    //Forgot Password
    ForgotPassword: builder.mutation<
      any,
      {
        mobile: string;
        email?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    //Reset Password
    resetPassword: builder.mutation<
      any,
      {
        code: string;
        newPassword: string;
        mobile: string;
        email?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useDemoLoginMutation,
  useSendOtpMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
