'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { signUp } from '@/lib/api';
import { validateEmail } from '@/lib/utils';
import { ArrowRight, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden auth-background">
      {/* Animated background blobs */}
      <div className="blob large" style={{ top: '-6rem', right: '-10rem', background: 'radial-gradient(circle at 80% 20%, rgba(236,72,153,0.9), rgba(249,115,22,0.4))' }} />
      <div className="blob medium" style={{ bottom: '-6rem', left: '-6rem', background: 'radial-gradient(circle at 20% 80%, rgba(99,102,241,0.85), rgba(168,85,247,0.4))', animationDelay: '1.2s' }} />
      <div className="blob small" style={{ top: '18%', left: '-4rem', background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), rgba(16,185,129,0.2))', animationDelay: '2.8s' }} />

      <div className="w-full max-w-md animate-welcome z-10">
        <div className="glass-premium rounded-[2.5rem] p-8 md:p-10 border border-white/20 relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 mb-6 animate-float">
              <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="h2 mb-2">Join TaskFlow Pro</h2>
            <p className="body text-base opacity-70">Start your journey to absolute productivity.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/30"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/30"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/30"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Verify password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-xl bg-muted/30"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              fullWidth
              className="h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 group mt-4"
            >
              Create Account
              {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-ui-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/sign-in"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
