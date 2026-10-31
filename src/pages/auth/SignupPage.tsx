
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { PhoneInput } from 'react-international-phone';
import { data, useNavigate } from 'react-router-dom';
import { SignupCredentials } from '@/types';
import 'react-international-phone/style.css';
import { Controller, useForm } from 'react-hook-form';
import {
  useSendOtpMutation,
  useRegisterMutation,
} from '@/store/api/authApi';

function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('India');
  const [dialCode, setDialCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  // const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  // const [formData, setFormData] = useState<SignupCredentials>({
  //   username: '',
  //   password: '',
  //   referralCode: '',
  //   phone: '',
  // });

  const {
    register: registerField,
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<SignupCredentials>({
    defaultValues: {
      username: '',
      password: '',
      referralCode: '',
      phone: '',
    }
  })

  // const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   const { name, value } = e.currentTarget;

  //   if (
  //     name !== 'username' &&
  //     name !== 'password' &&
  //     name !== 'referralCode'
  //   ) {
  //     return;
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   setError('');
  // };

  // const handlePhoneChange = (value: string): void => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     phone: value,
  //   }));

  //   setOtpSent(false);
  //   setError('');
  // };

  const handleSendOTP = async (): Promise<void> => {

    const isPhoneValid = await trigger('phone');

    if(!isPhoneValid) return;

    setApiError('');
    setOtpSent(false);

    try {
      await sendOtp({
        mobile: getValues('phone'),
        country,
        type: 'register',
      }).unwrap();

      setOtpSent(true);

    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string };
        error?: string;
      };

      setApiError(
        apiError.data?.message ||
          apiError.error ||
          'Failed to send OTP. Please try again.',
      );
    }
  };


  // Sign Up
  const handleSignup = async (
    data: SignupCredentials
  ): Promise<void> => {
    setApiError('');

    try {
      const response = await register({
        username: data.username.trim(),
        password: data.password,
        referralCode: data.referralCode.trim() || undefined,
        mobile: data.phone,
        dialCode,
        country,
        mobileVerificationCode: '123456',
      }).unwrap();

      console.log('Registration successful:', response);

      navigate('/login');

    } catch (err: unknown) {
      const apiError = err as {
        data?: {
          message?: string | string[];
        };
        error?: string;
      };

      const message = apiError.data?.message;

      setApiError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              apiError.error ||
              'Registration failed. Please try again.',
      );
    }
  };

  return (
    <div className="bg-[#0c1a37]/100 w-full min-h-screen overflow-hidden text-white">
      <div className="flex flex-col gap-6 w-[350px] mx-auto mt-5">
        <a
          href="/"
          className="flex justify-center items-center h-11 shrink-0 object-contain"
        >
          <img
            src="https://kailash.insoftdemo.site/images/logo.png"
            alt="Logo"
            className="h-full object-contain"
          />
        </a>

        <div className="border border-white bg-black rounded-2xl text-center">
          <div className="flex justify-between items-center px-3 pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex justify-center items-center gap-2"
            >
              <FaArrowLeft height={2} width={2} />
              Back
            </button>
          </div>

          <h1 className="mx-auto font-bold text-2xl mt-2">Sign In</h1>

          <p className="text-sm text-gray-300 mt-2 px-4">
            Create your account by following these simple steps.
          </p>

          <form onSubmit={handleSubmit(handleSignup)}>

            {/* Username  */}
            <div className="flex flex-col items-start p-4">
              <label htmlFor="username" className="text-sm pb-2">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
                {...registerField('username', {
                  required: 'Username is required',
                  validate: (value) => 
                    !!value.trim() || 'Username is required',
                })}
                className="w-full px-3 py-2 rounded-sm text-black"
              />
            </div>

            {errors.username && (
              <p className='text-red-400 text-xs mt-1'>
                {errors.username.message}
              </p>
            )}

            <div className="flex flex-col items-start px-4">
              <label htmlFor="password" className="text-sm pb-2">
                Password
              </label>

              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="new-password"
                  {...registerField('password', {
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 character long'
                    }
                  })}
                  className="relative rounded-sm w-full px-3 py-2 text-black"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-x-1/2 text-black"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            {errors.password && (
              <p className='text-red-400 text-xs mt-1'>
                {errors.password.message}
              </p>
            )}

            <div className="flex flex-col items-start p-4">
              <label htmlFor="referralCode" className="text-sm pb-2">
                Referral Code
              </label>

              <input
                id="referralCode"
                type="text"
                placeholder="Referral Code"
                {...registerField('referralCode')}
                className="w-full px-3 py-2 rounded-sm text-black"
              />
            </div>

            <div className="w-full max-w-xl text-white flex flex-col items-start px-4">
              <label htmlFor="phone" className="text-sm pb-2">
                Phone Number
              </label>

              <div className="flex items-stretch gap-1.5 w-full">
                <div className="min-w-0 flex-1">
                  {/* <PhoneInput
                    defaultCountry="in"
                    value={formData.phone}
                    onChange={(value, meta) => {
                      handlePhoneChange(value);
                      setCountry(meta.country.name);
                      setDialCode(`+${meta.country.dialCode}`);
                    }}
                    inputProps={{
                      id: 'phone',
                      placeholder: 'Enter phone number',
                      autoComplete: 'tel',
                      required: true,
                    }}
                    className="phone-input-custom"
                  /> */}

                  <Controller 
                      name='phone'
                      control={control}
                      rules={{
                        required: 'Phone number is required',
                        validate: (value) => {
                          const digits = value.replace(/\D/g, '');

                          return (
                            (digits.length >= 10 && digits.length <= 15) ||
                            'Please enter a valid phone number'
                          );
                        },
                      }}

                      render={({ field }) => (
                        <PhoneInput
                            defaultCountry='in'
                            value={field.value}
                            onChange={(value, meta) => {
                              field.onChange(value);

                              setCountry(meta.country.name);
                              setDialCode(`+${meta.country.dialCode}`);

                              setOtpSent(false);
                              setApiError('');
                            }}
                            inputProps={{
                              id: 'phone',
                              placeholder: 'Enter phone number',
                              autoComplete: 'tel',
                              onBlur: field.onBlur,
                            }}
                            className='phone-input-custom'
                          />
                      )}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOtp}
                  className="w-[60px] shrink-0 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-700 px-2 text-base text-[11px] font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingOtp
                    ? 'Sending...'
                    : otpSent
                      ? 'Sent'
                      : 'Send OTP'}
                </button>
              </div>

              {errors.phone && (
                <p className='text-red-400 text-xs mt-1'>
                  {errors.phone.message}
                </p>
              )}

            </div>
            

            {/* {Api Error} */}
            {apiError && (
              <p
                role="alert"
                className="text-red-400 text-sm text-left px-4 mt-3"
              >
                {apiError}
              </p>
            )}

            {otpSent && !apiError && (
              <p
                role="status"
                className="text-green-400 text-sm text-left px-4 mt-3"
              >
                OTP sent successfully.
              </p>
            )}

            <div className="flex justify-center items-center mb-2 text-[11px] gap-1">
              <p className="text-green-400">Already have an account</p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="underline decoration-white"
              >
                Login
              </button>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="mb-5 bg-[linear-gradient(90.12deg,#00c2a8_-0.18%,#005d8b_100.26%)] rounded-full text-lg px-[130px] py-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>

      <p className="text-[11px] max-w-[480px] mx-auto text-center mt-5 mb-6">
        Disclaimer: Please note that Gambling involves a financial risk and
        could be addictive over time if not practised within limits. Only 18+
        people should use the services and should use it responsibly. Players
        should be aware of any financial risk and govern themselves accordingly.
      </p>
    </div>
  );
}

export default SignupPage;
