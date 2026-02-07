'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/spinner';
import { signUp } from '@/lib/api';

// Define the form schema with Zod
const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSignUpSuccess?: () => void;
  className?: string;
}

export default function SignUpForm({ onSignUpSuccess, className }: SignUpFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setLoading(true);

    try {
      await signUp(data.email, data.password, '');
      reset(); // Clear the form
      if (onSignUpSuccess) {
        onSignUpSuccess();
      } else {
        // Default behavior: redirect to dashboard
        router.push('/dashboard');
        router.refresh(); // Refresh to update the UI
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message || ''}
            {...register('email')}
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message || ''}
            {...register('password')}
          />
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message || ''}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              Creating account...
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
      </div>
    </form>
  );
}
