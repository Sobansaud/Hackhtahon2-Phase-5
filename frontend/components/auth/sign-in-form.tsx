'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { signIn } from '@/lib/api';

// Define the form schema with Zod
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSignInSuccess?: () => void;
  className?: string;
}

export default function SignInForm({ onSignInSuccess, className }: SignInFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError('');
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      reset(); // Clear the form
      if (onSignInSuccess) {
        onSignInSuccess();
      } else {
        // Default behavior: redirect to dashboard
        router.push('/dashboard');
        router.refresh(); // Refresh to update the UI
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
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

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </div>
    </form>
  );
}
