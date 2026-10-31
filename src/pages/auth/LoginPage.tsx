import { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '@/types';
import { useDemoLoginMutation, useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';

function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // const [formData, setFormData] = useState<LoginCredentials>({
  //   username: '',
  //   password: '',
  // });


  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React Hook Form 
  const {
    register,
    handleSubmit,
    formState: { errors: validationErrors },
  } = useForm<LoginCredentials>();

  // Normal Login Api
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();


  // Demo Login Api
  const [demoLogin, { isLoading: isDemoLoginLoading }] = useDemoLoginMutation();


  // Demo Login Handler
  const handleDemoLogin = async () => {

    setError('');

    try {
      const response = await demoLogin().unwrap();

      console.log('Demo Login Response:', response);

      if (response?.accessToken) {
        dispatch(setToken(response.accessToken));
      }

      navigate("/home");

    } catch (error) {
      console.error('Demo Login Failed:', error);
    }
  };


  // Normal Login handler
  const onSubmit = async (data: LoginCredentials) => {
    setError('');

    try {
      
      const response = await login({
        username: data.username.trim(),
        password: data.password,
        device: 'Desktop',
      }).unwrap();

      console.log('Login Response:', response);

      if(response.success && response.accessToken) {
        dispatch(setToken(response.accessToken));
        navigate('/home');
      } else {
        setError('Login failed. Please check your creadentials.');
      }


    } catch (err: unknown) {
      
      console.error('Login Error:', err);

      if(typeof err === 'object' && err != null && 'data' in err) {
        const apiError = err as {
          data?: { message?: string };
        };

        setError (
          apiError.data?.message ||
            'Login failed. Please check your username and password.'
        );
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
    }
  };


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const { name, value } = e.currentTarget;

  //   if (name !== 'username' && name !== 'password') {
  //     return;
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   setError('');
  // };

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  //   e.preventDefault();
  //   setError('');

  //   if (!formData.username.trim() || !formData.password) {
  //     setError('Please enter username and password.');
  //     return;
  //   }

  //   try {
  //     const response = await login({
  //       password: formData.password,
  //       username: formData.username.trim(),
  //       device: 'Desktop',
  //     }).unwrap();

  //     if (response.success && response.accessToken) {
  //       dispatch(setToken(response.accessToken));
  //     }

  //     if (!response.success) {
  //       setError('Login failed. Please check your creadentials.');
  //       return;
  //     }

  //     console.log('Login successful:', response);

  //     navigate('/home');
  //   } catch (err: unknown) {
  //     console.error('Login error:', err);

  //     if (typeof err === 'object' && err !== null && 'data' in err) {
  //       const apiError = err as {
  //         data?: { message?: string };
  //       };

  //       setError(
  //         apiError.data?.message || 'Login failed. Please check your username and password.'
  //       );
  //     } else {
  //       setError('Unable to connect to the server. Please try again.');
  //     }
  //   }

  //   console.log('Login Data:', formData);
  // };

  return (
    <div className="bg-[#0c1a37]/100 w-full min-h-screen overflow-hidden text-white ">
      <div className="flex flex-col gap-6 w-[350px] mx-auto mt-5  ">

        {/* Logo  */}
        <a href="/" className="flex justify-center items-center h-11 shrink-0 object-contain ">
          <img
            src="https://kailash.insoftdemo.site/images/logo.png"
            alt="Logo"
            className="h-full object-contain "
          />
        </a>

        <div className="border border-white rounded-2xl text-center ">

          {/* Header  */}
          <div className="flex justify-between items-center px-3 pt-3  ">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex justify-center items-center gap-2 "
            >
              <FaArrowLeft height={2} width={2} /> Back
            </button>


            {/* Demo Login  */}
            <button
              type="button"
              disabled={isDemoLoginLoading}
              onClick={handleDemoLogin}
              className="bg-[linear-gradient(90.12deg,#00c2a8_-0.18%,#005d8b_100.26%)] rounded-full text-[12px] px-4 py-2"
            >
              {isDemoLoginLoading ? 'Demo Logging...' : 'Demo Login'}
            </button>
          </div>

          <h1 className="mx-auto font-bold text-2xl mt-2">Sign In</h1>

          <p className="text-sm text-gray-300 mt-2">Please enter your login details here.</p>


          {/* Login Form  */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Username  */}
            <div className="flex flex-col items-start p-4 ">
              <label htmlFor="username">Username*</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
                {...register('username', {
                  required: 'Username is required',
                  validate: (value) => 
                    value.trim().length > 0 ||
                    `Usernam cannot be empty`,
                })}
                className="w-full px-3 py-2 rounded-sm text-black"
              />
            </div>

            {validationErrors.username && (
              <p className='text-red-400 text-xs mt-1'>
                {validationErrors.username.message}
              </p>
            )}

            
            {/* Password  */}
            <div className="flex flex-col items-start px-4">
              <label htmlFor="">Password*</label>

              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    }
                  })}
                  className="relative rounded-sm w-full px-3 py-2 text-black"
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                >
                  {!showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            {validationErrors.password && (
              <p className='text-red-400 text-xs mt-1'>
                {validationErrors.password.message}
              </p>
            )}

            {/* API Error  */}
            {error && (
              <p role="alert" className="text-red-400 text-sm mt-2 px-4">
                {error}
              </p>
            )}

            <p
              onClick={() => navigate('/forgot-password')}
              className="text-[11px] cursor-pointer text-right mr-3 my-3"
            >
              Forgot your password?
            </p>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="bg-[linear-gradient(90.12deg,#00c2a8_-0.18%,#005d8b_100.26%)] rounded-full text-lg px-20 py-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="border border-b-1 my-3"></div>

          <div className="flex justify-center items-center mb-2 text-[11px] gap-1">
            <p className="">Don't have an account? </p>
            <button
              type="button"
              className="underline decoration-white"
              onClick={() => navigate('/signup')}
            >
              {' '}
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] max-w-[480px] mx-auto text-center mt-5">
        Disclaimer: Please note that Gambling involves a financial risk and could be addictive over
        time if not practised within limits. Only 18+ people should use the services and should use
        it responsibly. Players should be aware of any financial risk and govern themselves
        accordingly.
      </p>
    </div>
  );
}

export default LoginPage;
