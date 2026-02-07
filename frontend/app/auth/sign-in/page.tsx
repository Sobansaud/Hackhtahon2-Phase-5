'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { signIn } from '@/lib/api';
import { validateEmail } from '@/lib/utils';
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden auth-background">
      {/* Animated background blobs */}
      <div className="blob large" style={{ top: '-6rem', left: '-10rem', background: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.9), rgba(124,58,237,0.5))' }} />
      <div className="blob medium" style={{ bottom: '-6rem', right: '-6rem', background: 'radial-gradient(circle at 70% 70%, rgba(236,72,153,0.85), rgba(139,92,246,0.4))', animationDelay: '1.5s' }} />
      <div className="blob small" style={{ top: '20%', right: '-4rem', background: 'radial-gradient(circle at 40% 40%, rgba(56,189,248,0.7), rgba(99,102,241,0.2))', animationDelay: '3s' }} />

      <div className="w-full max-w-md animate-welcome z-10">
        <div className="glass-premium rounded-[2.5rem] p-8 md:p-10 border border-white/20 relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 mb-6 animate-float">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="h2 mb-2">Welcome Back</h2>
            <p className="body text-base opacity-70">Experience the next level of productivity.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted/30"
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-muted/30"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              fullWidth
              className="h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 group mt-4"
            >
              Sign In
              {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-ui-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
