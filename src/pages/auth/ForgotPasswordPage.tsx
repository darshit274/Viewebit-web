import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);

      const response = await authService.forgotPassword(data.email);

      if (response.success) {
        toast.success('Password reset link sent to your email!');
        navigate('/auth/reset-password', { state: { email: data.email } });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-500 font-medium text-sm"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;