
import React, { useEffect } from 'react';
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from 'react-icons/io5';

import { useAppDispatch, useProfile } from '@/hooks';

import {
  setActiveTab,
  setPersonalField,
  setPersonalInfo,
  setPasswordField,
  togglePasswordVisibility,
  resetPersonalForm,
  resetPasswordForm,
  setFeedback,
  clearFeedback,
  type PersonalInfoState,
} from '@/store/slices/profileSlice';

import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  type UpdateProfileRequest,
} from '@/store/api/userApi';

import { useSendOtpMutation, useChangePasswordMutation } from '@/store/api/authApi';

export default function Profile() {
  const dispatch = useAppDispatch();

  const {
    activeTab,
    personalInfo,
    password,
    feedback,
  } = useProfile();

  // Get Current User Profile (GET /users/me)
  const {
    data: user,
    isLoading,
    isError,
  } = useGetMyProfileQuery();

  // Mutation for updating profile: PATCH /users/me
  const [updateMyProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();

  // Mutation for sending OTP: POST /auth/send-code
  const [sendOtpApi, { isLoading: isSendingOtp }] = useSendOtpMutation();

  // Mutation for changing password: POST /users/me/change-password
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Populate Personal Info from API
  useEffect(() => {
    if (user) {
      dispatch(
        setPersonalInfo({
          username: user.username ?? '',
          firstname: user.firstname ?? '',
          lastname: user.lastname ?? '',
          phoneNumber: user.mobile ?? '',
          email: user.email ?? '',
          dialCode: user.dialCode ?? '+91',
          country: user.country ?? 'India',
        })
      );
    }
  }, [user, dispatch]);

  // Auto-clear feedback notification after 3 seconds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (feedback) {
      timer = setTimeout(() => {
        dispatch(clearFeedback());
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [feedback, dispatch]);

  // Handle Personal Info Changes
  const handlePersonalChange = (
    field: keyof PersonalInfoState,
    value: string
  ) => {
    dispatch(setPersonalField({ field, value }));
  };

  // Reset personal form back to user profile values
  const handleResetPersonal = () => {
    if (user) {
      dispatch(
        setPersonalInfo({
          username: user.username ?? '',
          firstname: user.firstname ?? '',
          lastname: user.lastname ?? '',
          phoneNumber: user.mobile ?? '',
          otp: '',
          email: user.email ?? '',
          dialCode: user.dialCode ?? '+91',
          country: user.country ?? 'India',
        })
      );
      dispatch(
        setFeedback({
          message: 'Personal info reset to saved profile.',
          type: 'info',
        })
      );
    } else {
      dispatch(resetPersonalForm());
    }
  };

  // Handle Password Changes
  const handlePasswordChange = (
    field: 'oldPassword' | 'newPassword' | 'confirmPassword',
    value: string
  ) => {
    dispatch(setPasswordField({ field, value }));
  };

  // Send OTP to mobile via POST /auth/send-code
  const handleSendOTP = async () => {
    const phone = personalInfo.phoneNumber.trim();
    if (!phone) {
      dispatch(
        setFeedback({
          message: 'Please enter a valid phone number first.',
          type: 'error',
        })
      );
      return;
    }

    try {
      const response = await sendOtpApi({
        mobile: phone,
        country: user?.country || personalInfo.country || 'India',
        type: 'register',
      }).unwrap();

      dispatch(
        setFeedback({
          message: response?.message || 'Verification code sent successfully!',
          type: 'success',
        })
      );
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string | string[] };
        error?: string;
      };

      const rawMessage = apiError.data?.message;
      const errorMsg =
        (Array.isArray(rawMessage) ? rawMessage[0] : rawMessage) ||
        apiError.error ||
        'Failed to send verification code. Please try again.';

      dispatch(
        setFeedback({
          message: errorMsg,
          type: 'error',
        })
      );
    }
  };

  // Save Personal Information via PATCH /users/me
  const handleSavePersonal = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      // Split username or fallback to ensure firstname & lastname are non-empty
      const rawUsername = (user?.username || personalInfo.username || 'User').trim();
      const parts = rawUsername.split(/[\s_.-]+/);
      const fallbackFirst = parts[0] || 'User';
      const fallbackLast = (parts.length > 1 ? parts.slice(1).join(' ') : parts[0]) || 'User';

      const payload: UpdateProfileRequest = {
        username: rawUsername,
        firstname: user?.firstname?.trim() || fallbackFirst,
        lastname: user?.lastname?.trim() || fallbackLast,
        email: personalInfo.email.trim() || user?.email || '',
        dialCode: user?.dialCode || personalInfo.dialCode || '+91',
        mobile: personalInfo.phoneNumber.trim() || user?.mobile || '',
        mobileVerificationCode: personalInfo.otp.trim() || '',
        emailVerificationCode: personalInfo.otp.trim() || '',
        country: user?.country || personalInfo.country || 'India',
      };

      await updateMyProfile(payload).unwrap();

      // Clear OTP field after successful update
      dispatch(setPersonalField({ field: 'otp', value: '' }));

      dispatch(
        setFeedback({
          message: 'Profile updated successfully!',
          type: 'success',
        })
      );
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string | string[] };
        error?: string;
      };

      const rawMessage = apiError.data?.message;
      const errorMsg =
        (Array.isArray(rawMessage) ? rawMessage[0] : rawMessage) ||
        apiError.error ||
        'Failed to update profile. Please try again.';

      dispatch(
        setFeedback({
          message: errorMsg,
          type: 'error',
        })
      );
    }
  };

  // Update Password via POST /users/me/change-password
  const handleUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Frontend validation
    if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
      dispatch(setFeedback({ message: 'Please fill in all password fields.', type: 'error' }));
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      dispatch(setFeedback({ message: 'New password and confirm password do not match.', type: 'error' }));
      return;
    }

    try {
      await changePassword({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      }).unwrap();

      // Clear password fields on success
      dispatch(resetPasswordForm());
      dispatch(setFeedback({ message: 'Password updated successfully!', type: 'success' }));
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string | string[] }; error?: string };
      const rawMessage = apiError.data?.message;
      const errorMsg =
        (Array.isArray(rawMessage) ? rawMessage[0] : rawMessage) ||
        apiError.error ||
        'Failed to update password. Please try again.';

      dispatch(setFeedback({ message: errorMsg, type: 'error' }));
    }
  };

  // Profile Avatar Initial
  const avatarInitial =
    user?.firstname?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    'U';

  const displayName =
    user?.firstname && user?.lastname
      ? `${user.firstname} ${user.lastname}`
      : user?.username ?? 'User';

  return (
    <div className="flex w-full min-w-0 flex-col md:flex-row md:min-h-[calc(100vh-56px)]">

      {/* Redux-Managed Feedback Alert Toast */}
      {feedback && (
        <div
          className={`fixed top-16 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold text-white shadow-2xl transition-all sm:text-sm ${
            feedback.type === 'error'
              ? 'border-red-400 bg-[#3b1219]'
              : feedback.type === 'success'
                ? 'border-green-400 bg-[#0d3420]'
                : 'border-blue-400 bg-[#0d2149]'
          }`}
        >
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Left Column: User Profile & Tab Navigation */}
      <div className="w-full shrink-0 border-b border-white/10 p-4 sm:p-5 md:w-60 md:border-b-0 md:border-r lg:w-64">

        {/* User Info Header */}
        <div className="flex items-center gap-3 md:pb-4">

          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1746a2] to-[#215bc9] text-lg font-bold text-white shadow-md">
              {avatarInitial}
            </div>
          )}

          <span className="truncate text-sm font-semibold tracking-wide text-white">
            {displayName}
          </span>
        </div>

        {/* Divider (desktop/tablet sidebar only) */}
        <div className="hidden h-px w-full bg-white/10 md:block" />

        {/* Navigation Tabs (desktop/tablet sidebar only; mobile uses bottom icon bar) */}
        <div className="hidden space-y-2 pt-4 md:block">

          {/* Tab 1: Personal Info */}
          <button
            type="button"
            onClick={() => dispatch(setActiveTab('personal'))}
            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all ${
              activeTab === 'personal'
                ? 'bg-[#121c2e] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === 'personal' ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow">
                <IoPersonOutline className="text-base" />
              </span>
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400">
                <IoPersonOutline className="text-lg" />
              </span>
            )}

            <span className="truncate text-xs font-semibold sm:text-sm">
              Personal Info
            </span>
          </button>

          {/* Tab 2: Change Password */}
          <button
            type="button"
            onClick={() => dispatch(setActiveTab('password'))}
            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all ${
              activeTab === 'password'
                ? 'bg-[#121c2e] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === 'password' ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow">
                <IoLockClosedOutline className="text-base" />
              </span>
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400">
                <IoLockClosedOutline className="text-lg" />
              </span>
            )}

            <span className="truncate text-xs font-semibold sm:text-sm">
              Change Password
            </span>
          </button>
        </div>
      </div>

      {/* Right Column: Profile Content Area */}
      <div className="flex flex-1 min-w-0 flex-col justify-between p-3 sm:p-5 lg:p-6">

        <div>

          {/* Top Header Banner */}
          <div className="flex h-10 w-full items-center gap-3 rounded-full bg-gradient-to-r from-[#1746a2] via-[#215bc9] to-[#12397e] px-5 text-white shadow-md">
            <IoPersonOutline className="text-lg shrink-0 text-white" />

            <h1 className="text-xs font-semibold tracking-wide text-white sm:text-sm">
              My Profile
            </h1>
          </div>

          {/* Loading State */}
          {isLoading && (
            <p className="pt-4 text-sm text-gray-400">
              Loading profile information...
            </p>
          )}

          {/* Error State */}
          {isError && (
            <p className="pt-4 text-sm text-red-400">
              Failed to load profile information. Please try again.
            </p>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <form
              onSubmit={handleSavePersonal}
              className="space-y-6 pt-6 sm:space-y-7 sm:pt-8"
            >

              {/* Field 1: Username */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    Username
                  </span>
                </div>

                <input
                  type="text"
                  readOnly
                  value={user?.username ?? personalInfo.username ?? ''}
                  className="h-[50px] w-full rounded-full bg-[#131b2c] px-6 text-xs text-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:px-7 sm:text-sm"
                />
              </div>

              {/* Field 2: Phone Number + Send OTP */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                      Phone Number
                    </span>
                  </div>

                  <input
                    type="tel"
                    value={personalInfo.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePersonalChange('phoneNumber', e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="h-[50px] w-full rounded-full bg-[#131b2c] px-6 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:px-7 sm:text-sm"
                  />
                </div>

                {/* Send OTP Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isSendingOtp}
                    onClick={handleSendOTP}
                    className="h-10 rounded-full bg-gradient-to-r from-[#1746a2] to-[#215bc9] px-7 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {isSendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* Field 5: OTP */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    OTP
                  </span>
                </div>

                <input
                  type="text"
                  value={personalInfo.otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePersonalChange('otp', e.target.value)
                  }
                  placeholder="Enter OTP if phone changed"
                  className="h-[50px] w-full rounded-full bg-[#131b2c] px-6 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:px-7 sm:text-sm"
                />
              </div>

              {/* Field 6: Email Address */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    Email Address
                  </span>
                </div>

                <input
                  type="email"
                  value={personalInfo.email}
                  placeholder="Enter"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePersonalChange('email', e.target.value)
                  }
                  className="h-[50px] w-full rounded-full bg-[#131b2c] px-6 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:px-7 sm:text-sm"
                />
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-4 sm:pt-6">

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleResetPersonal}
                  className="h-10 rounded-full bg-gradient-to-r from-[#1746a2] to-[#215bc9] px-7 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="h-10 rounded-full bg-gradient-to-r from-[#1746a2] to-[#215bc9] px-8 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>

              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form
              onSubmit={handleUpdatePassword}
              className="space-y-6 pt-6 sm:space-y-7 sm:pt-8"
            >

              {/* Field 1: Old Password */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    Old Password
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={password.showOldPassword ? 'text' : 'password'}
                    value={password.oldPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('oldPassword', e.target.value)
                    }
                    placeholder="Enter Old Password"
                    className="h-[50px] w-full rounded-full bg-[#131b2c] pl-6 pr-14 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:pl-7 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => dispatch(togglePasswordVisibility('old'))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                  >
                    {password.showOldPassword ? (
                      <IoEyeOffOutline className="text-lg" />
                    ) : (
                      <IoEyeOutline className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Field 2: New Password */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    New Password
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={password.showNewPassword ? 'text' : 'password'}
                    value={password.newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('newPassword', e.target.value)
                    }
                    placeholder="Enter New Password"
                    className="h-[50px] w-full rounded-full bg-[#131b2c] pl-6 pr-14 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:pl-7 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => dispatch(togglePasswordVisibility('new'))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                  >
                    {password.showNewPassword ? (
                      <IoEyeOffOutline className="text-lg" />
                    ) : (
                      <IoEyeOutline className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Field 3: Confirm Password */}
              <div className="relative">
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-block rounded-full border border-gray-500/80 bg-[#000000] px-4 py-0.5 text-[11px] font-medium text-gray-200 shadow-sm sm:bg-[#070b14]">
                    Confirm Password
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={password.showConfirmPassword ? 'text' : 'password'}
                    value={password.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('confirmPassword', e.target.value)
                    }
                    placeholder="Confirm New Password"
                    className="h-[50px] w-full rounded-full bg-[#131b2c] pl-6 pr-14 text-xs text-white placeholder-gray-400 outline-none transition focus:border-[#215bc9] sm:h-[52px] sm:pl-7 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => dispatch(togglePasswordVisibility('confirm'))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                  >
                    {password.showConfirmPassword ? (
                      <IoEyeOffOutline className="text-lg" />
                    ) : (
                      <IoEyeOutline className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-4 sm:pt-6">

                <button
                  type="button"
                  disabled={isChangingPassword}
                  onClick={() => dispatch(resetPasswordForm())}
                  className="h-10 rounded-full bg-gradient-to-r from-[#1746a2] to-[#215bc9] px-7 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="h-10 rounded-full bg-gradient-to-r from-[#1746a2] to-[#215bc9] px-8 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>

              </div>
            </form>
          )}

          {/* Mobile Bottom Tab Icons (visible on small screens only) */}
          <div className="mt-6 flex w-full items-center justify-center gap-4 rounded-xl border border-white/10 bg-[#070b14] py-2.5 md:hidden">
            <button
              type="button"
              aria-label="Personal Info"
              onClick={() => dispatch(setActiveTab('personal'))}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                activeTab === 'personal'
                  ? 'bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <IoPersonOutline className="text-xl" />
            </button>

            <button
              type="button"
              aria-label="Change Password"
              onClick={() => dispatch(setActiveTab('password'))}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-[#1746a2] to-[#215bc9] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <IoLockClosedOutline className="text-xl" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 pb-4 text-center text-[11px] font-semibold tracking-wider text-gray-500 md:pt-10">
          RULES AND REGULATIONS © 2026
        </div>

      </div>
    </div>
  );
}
