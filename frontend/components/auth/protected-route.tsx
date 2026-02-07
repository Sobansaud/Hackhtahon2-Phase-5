'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Custom fallback component
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);

      if (!authStatus) {
        // Redirect to sign-in if not authenticated
        router.push('/auth/sign-in');
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Checking authentication..." />
      </div>
    );
  }

  // If authenticated, render the protected content
  if (isAuth) {
    return <>{children}</>;
  }

  // If not authenticated and not loading, return nothing (router.push should handle redirect)
  return null;
}
