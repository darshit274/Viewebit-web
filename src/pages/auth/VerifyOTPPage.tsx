import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../store';
import { loginSuccess, setLoading, setError } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

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
          // Navigate to reset password page
          setTimeout(() => {
            navigate('/reset-password', { state: { email } });
          }, 1000);
        } else if (verificationType === 'login-verification' && password) {
          // Auto-login after verification
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
          // For new registrations, redirect to dashboard
          // Note: Token would be set during registration if backend provides it
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
      setCountdown(60); // 60 second cooldown

      if (verificationType === 'forgot-password') {
        await authService.forgotPassword(email);
      } else {
        // For registration or login verification, use resend OTP endpoint
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
        return 'Enter the 4-digit code sent to your email to reset your password';
      case 'login-verification':
        return 'Please verify your email to complete the login process';
      default:
        return 'Enter the 4-digit code sent to your email to complete registration';
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getTitle()}</h2>
        <p className="text-gray-600 mb-2">{getSubtitle()}</p>
        <p className="text-sm text-gray-500">
          Code sent to: <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="otp" className="form-label text-center block">
            Verification Code
          </label>
          <input
            {...register('otp')}
            type="text"
            id="otp"
            maxLength={4}
            className="form-input text-center text-2xl font-bold tracking-widest"
            placeholder="0000"
            onChange={handleOtpChange}
            disabled={verified}
            style={{ letterSpacing: '0.5em' }}
          />
          {errors.otp && (
            <p className="form-error text-center">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || verified || !otpValue || otpValue.length !== 4}
          className="btn-primary w-full"
        >
          {verified ? 'Verified ✓' : isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600">Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>

        <div className="border-t pt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;