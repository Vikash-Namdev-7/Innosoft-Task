import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { PhoneInput } from 'react-international-phone';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/store/api/authApi';

import 'react-international-phone/style.css';

function ForgotPassword() {
  const navigate = useNavigate();

  // Initialize with India's country code
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // For useForm
  const {
    register,
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '+91',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Send OTP
  const handleSendOTP = async () => {
    const isPhoneValid = await trigger('phone');

    if (!isPhoneValid) {
      return;
    }

    const phone = getValues('phone');

    setError('');
    setSuccess('');
    setOtpSent(false);

    try {
      await forgotPassword({
        mobile: phone,
      }).unwrap();

      setOtpSent(true);
      setSuccess('OTP sent successfully.');
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string };
        error?: string;
      };

      setError(apiError.data?.message || apiError.error || 'Failed to send OTP. Please try again.');
    }
  };

  // Reset password
  const handleResetPassword = async (data: {
    phone: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => {

    setError('');
    setSuccess('');

    if (!otpSent) {
      setError('Please request OTP first.');
      return;
    }

    try {
      await resetPassword({
        code: data.otp.trim(),
        newPassword: data.newPassword,
        mobile: data.phone,
      }).unwrap();

      setSuccess('Password reset successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string };
        error?: string;
      };

      setError(apiError.data?.message || apiError.error || 'Unable to reset password.');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0c1a37] px-4 pb-6 pt-5 text-white">
      {/* Logo */}
      <Link to="/" className="mx-auto flex h-11 items-center justify-center">
        <img
          src="https://kailash.insoftdemo.site/images/logo.png"
          alt="KailashBook"
          className="h-full object-contain"
        />
      </Link>

      {/* Main Card */}
      {/* Removed overflow-hidden so country dropdown is not clipped */}
      <div className="mx-auto mt-10 w-full max-w-[398px] rounded-xl border border-gray-300">
        <div className="px-6 pb-5 pt-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm transition hover:text-teal-400"
          >
            <FaArrowLeft size={16} />
            Back
          </button>

          {/* Heading */}
          <h1 className="mt-2 text-center text-xl font-bold tracking-tight">
            Forgot Username/Password?
          </h1>

          <p className="mx-auto mt-1 max-w-[350px] text-center text-sm leading-5 text-white">
            We'll send OTP on your registered number associated with username.
          </p>

          <form onSubmit={handleSubmit(handleResetPassword)} className="mt-7 flex flex-col gap-4">
            {/* Phone Number */}
            <div className="relative z-50 flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm">
                Phone Number
              </label>

              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  validate: (value) => {
                    const digits = value.replace(/\D/g, '');

                    return (
                      (digits.length >= 10 && digits.length <= 15) ||
                      'Please enter a valid phone number.'
                    );
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="in"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      setOtpSent(false);
                      setError('');
                      setSuccess('');
                    }}
                    inputProps={{
                      id: 'phone',
                      type: 'tel',
                      placeholder: 'Enter phone number',
                      autoComplete: 'tel',
                      onBlur: field.onBlur,
                    }}
                    className="!w-full !rounded-lg !bg-[#d9d9d9]"
                    inputClassName="!h-12 !w-full !min-w-0 !border-0 !bg-transparent !px-3 !text-base !text-black !outline-none"
                    countrySelectorStyleProps={{
                      buttonClassName:
                        '!h-12 !min-w-[84px] !border-0 !border-r !border-solid !border-[#c5c5c5] !bg-transparent !px-3',
                      dropdownStyleProps: {
                        className: '!z-[9999] !w-[280px] !max-w-[85vw]',
                        style: {
                          zIndex: 9999,
                          maxHeight: '250px',
                          overflowY: 'auto',
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Phone validation error */}
              {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}

              {/* Send OTP Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOtp}
                  className="w-[177px] rounded-full bg-gradient-to-r from-teal-500 to-cyan-700 px-5 py-3 text-base font-semibold uppercase text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP */}
            <input
              type="text"
              placeholder="Enter OTP"
              autoComplete="one-time-code"
              {...register('otp', {
                required: 'OTP is required',
                validate: (value) => !!value.trim() || 'OTP is required',
              })}
              className="w-full rounded-md bg-[#d9d9d9] px-4 py-5 text-base text-black outline-none placeholder:text-[#647b94] focus:ring-2 focus:ring-teal-500"
            />
            {errors.otp && <p className="text-sm text-red-400">{errors.otp.message}</p>}

            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter New Password"
                autoComplete="new-password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
                className="w-full rounded-md bg-[#d9d9d9] px-4 py-5 pr-11 text-base text-black outline-none placeholder:text-[#647b94] focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <IoEye size={19} /> : <IoEyeOff size={19} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-sm text-red-400">{errors.newPassword.message}</p>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Enter Confirm Password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === getValues('newPassword') || 'Passwords do not match',
                })}
                className="w-full rounded-md bg-[#d9d9d9] px-4 py-5 pr-11 text-base text-black outline-none placeholder:text-[#647b94] focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <IoEye size={19} /> : <IoEyeOff size={19} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}

            {/* Error Message */}
            {error && (
              <p role="alert" className="text-center text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p role="status" className="text-center text-sm text-green-400">
                {success}
              </p>
            )}

            {/* Reset Password */}
            <button
              type="submit"
              disabled={!otpSent || isResetting}
              className="w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-700 py-4 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        {/* Bottom Sign In Section */}
        <div className="border-t border-gray-300 px-3 py-3 text-center text-xs">
          <span className="text-teal-400">Have an account? </span>

          <Link
            to="/login"
            className="font-semibold text-white underline underline-offset-2 hover:text-teal-400"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mx-auto mt-10 max-w-[550px] text-center text-[11px] leading-[17px] text-white">
        Disclaimer: Please note that Gambling involves a financial risk and could be addictive over
        time if not practised within limits. Only 18+ people should use the services and should use
        it responsibly. Players should be aware of any financial risk and govern themselves
        accordingly.
      </p>
    </div>
  );
}

export default ForgotPassword;
