import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const response = await authService.register({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      if (response.success) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-otp', {
          state: {
            email: data.email,
            type: 'registration'
          }
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="form-input"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}
        </div>

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
          <label htmlFor="mobile" className="form-label">
            Mobile Number
          </label>
          <input
            {...register('mobile')}
            type="tel"
            id="mobile"
            className="form-input"
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
            <p className="form-error">{errors.mobile.message}</p>
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
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
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
            placeholder="Confirm your password"
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;