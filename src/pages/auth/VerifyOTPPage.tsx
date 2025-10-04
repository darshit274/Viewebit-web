import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../store';
import { loginSuccess, setLoading, setError } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Mail, Check } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be 4 digits').max(4, 'OTP must be 4 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface LocationState {
  email: string;
  type: 'registration' | 'login-verification' | 'forgot-password';
  password?: string;
}

const VerifyOTPPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get state from navigation
  const state = location.state as LocationState;
  const email = state?.email;
  const verificationType = state?.type || 'registration';
  const password = state?.password;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch('otp');

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      toast.error('No email provided for verification');
      navigate('/login');
    }
  }, [email, navigate]);

  // Auto-submit when 4 digits are entered
  useEffect(() => {
    if (otpValue && otpValue.length === 4 && !isLoading && !verified) {
      handleSubmit(onSubmit)();
    }
  }, [otpValue, isLoading, verified, handleSubmit]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    if (!email || isLoading || verified) return;

    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authService.verifyOTP(email, data.otp);

      if (response.success) {
        setVerified(true);
        toast.success('OTP verified successfully!');

        // Handle different verification types
        if (verificationType === 'forgot-password') {
          setTimeout(() => {
            navigate('/reset-password', { state: { email } });
          }, 1000);
        } else if (verificationType === 'login-verification' && password) {
          try {
            const loginResponse = await authService.login(email, password);
            if (loginResponse.success) {
              dispatch(loginSuccess({
                user: loginResponse.user,
                token: loginResponse.token,
              }));
              toast.success('Login successful! Welcome back.');
              setTimeout(() => navigate('/dashboard'), 1000);
            } else {
              toast.error('Email verified. Please login again.');
              setTimeout(() => navigate('/login'), 1000);
            }
          } catch (loginError) {
            toast.error('Email verified. Please login again.');
            setTimeout(() => navigate('/login'), 1000);
          }
        } else {
          toast.success('Account verified successfully!');
          setTimeout(() => navigate('/login'), 1000);
        }
      } else {
        toast.error(response.message || 'OTP verification failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleResendOTP = async () => {
    if (!email || resendLoading || countdown > 0) return;

    try {
      setResendLoading(true);
      setCountdown(60);

      if (verificationType === 'forgot-password') {
        await authService.forgotPassword(email);
      } else {
        await authService.resendOTP(email);
      }

      toast.success('New OTP sent to your email!');
    } catch (error: any) {
      toast.error('Failed to resend OTP. Please try again.');
      setCountdown(0);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('otp', value);
  };

  const getTitle = () => {
    switch (verificationType) {
      case 'forgot-password':
        return 'Reset Password Verification';
      case 'login-verification':
        return 'Account Verification';
      default:
        return 'Email Verification';
    }
  };

  const getSubtitle = () => {
    switch (verificationType) {
      case 'forgot-password':
        return 'Enter the 4-digit code sent to your email';
      case 'login-verification':
        return 'Please verify your email to continue';
      default:
        return 'Enter the 4-digit code to complete registration';
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          {getSubtitle()}
        </p>
        <p className="text-sm text-gray-500">
          Code sent to: <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* OTP Input */}
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-3 text-center"
          >
            Verification Code
          </label>
          <input
            {...register('otp')}
            type="text"
            inputMode="numeric"
            id="otp"
            maxLength={4}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-center text-3xl font-bold tracking-[0.5em] disabled:bg-gray-50"
            placeholder="0000"
            onChange={handleOtpChange}
            disabled={verified}
          />
          {errors.otp && (
            <p className="mt-2 text-sm text-red-600 text-center">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || verified || !otpValue || otpValue.length !== 4}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {verified ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Verified
            </>
          ) : isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>

      {/* Resend & Back Links */}
      <div className="mt-6 space-y-4">
        {/* Resend OTP */}
        <div className="text-center">
          <span className="text-sm text-gray-600">Didn't receive the code? </span>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resendLoading
              ? 'Sending...'
              : countdown > 0
              ? `Resend in ${countdown}s`
              : 'Resend Code'}
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

        {/* Back to Login */}
        <div>
          <Link
            to="/login"
            className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
