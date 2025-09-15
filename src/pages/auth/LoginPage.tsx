import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../store';
import { loginSuccess, setLoading, setError } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Temporary test login function for development
  const handleTestLogin = () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiN2EzMTY3ZjItNzVhMy00NDAzLTk4MDgtYjRjZDkwZjFjZDQ0IiwiZW1haWwiOiJmcmVzaEBleGFtcGxlLmNvbSIsImlhdCI6MTc1NzQ5MDI3MSwiZXhwIjoxNzU3NTc2NjcxfQ.SQVonYNgyaVvT5Nl8n4PLYfLDgs0mPEPJidwlEWmzeY';
    const testUser = {
      uuid: '7a3167f2-75a3-4403-9808-b4cd90f1cd44',
      username: 'freshuser', 
      email: 'fresh@example.com',
      isEmailVerified: false
    };
    
    dispatch(loginSuccess({
      user: testUser,
      token: testToken,
    }));
    toast.success('Test login successful!');
    navigate('/pdfs');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authService.login(data.email, data.password);
      
      if (response.success) {
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
        }));
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        dispatch(setError(response.message));
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';

      // Check if error is due to unverified email
      if (errorMessage.includes('Please verify your email before logging in') ||
          errorMessage.includes('verify your email') ||
          error?.response?.status === 403) {

        try {
          // Automatically send OTP to user's email
          await authService.resendOTP(data.email);

          toast.success('OTP sent to your email. Please verify to continue.');
          navigate('/verify-otp', {
            state: {
              email: data.email,
              type: 'login-verification',
              password: data.password
            }
          });
          return;

        } catch (otpError) {
          // If OTP sending fails, show the original error
          toast.error('Please verify your email. Unable to send OTP automatically.');
          dispatch(setError(errorMessage));
          return;
        }
      }

      // For other errors, show normal error message
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        
        {/* Development Test Login Button */}
        {/* <button
          type="button"
          onClick={handleTestLogin}
          className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
        >
          🧪 Test Login (Development)
        </button> */}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;