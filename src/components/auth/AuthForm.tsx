import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mode === 'signup' && (
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...register('fullName', { required: 'Full name is required' })}
          error={errors.fullName?.message}
          fullWidth
        />
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email?.message}
        fullWidth
      />

      <Input
        label="Password"
        type="password"
        placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
        {...register('password', { 
          required: 'Password is required',
          minLength: mode === 'signup' 
            ? { value: 6, message: 'Password must be at least 6 characters' }
            : undefined
        })}
        error={errors.password?.message}
        fullWidth
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
};