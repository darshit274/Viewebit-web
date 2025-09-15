import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error('Email not found. Please try forgot password again.');
      navigate('/auth/forgot-password');
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.resetPassword(
        email,
        data.token,
        data.newPassword
      );

      if (response.success) {
        toast.success('Password reset successfully! You can now login.');
        navigate('/auth/login');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Access</h2>
        <p className="text-gray-600 mb-4">Please use the forgot password feature first.</p>
        <button
          onClick={() => navigate('/auth/forgot-password')}
          className="btn-primary"
        >
          Go to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-600">
          Enter the reset token from your email and create a new password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="token" className="form-label">
            Reset Token
          </label>
          <input
            {...register('token')}
            type="text"
            id="token"
            className="form-input"
            placeholder="Enter reset token from email"
          />
          {errors.token && (
            <p className="form-error">{errors.token.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            {...register('newPassword')}
            type="password"
            id="newPassword"
            className="form-input"
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="form-error">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/auth/login')}
          className="text-primary-600 hover:text-primary-500 font-medium text-sm"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;