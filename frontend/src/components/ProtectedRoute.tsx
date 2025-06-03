'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip auth checks in local development unless explicitly enabled
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to login with the original URL as the 'from' parameter
        const currentPath = window.location.pathname;
        const redirectPath = `${redirectTo}?from=${encodeURIComponent(currentPath)}`;
        router.push(redirectPath);
      }
      setChecking(false);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="large" text="Loading..." color="primary" />
      </div>
    );
  }

  // Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current path for redirect after login
      const currentPath = window.location.pathname;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="large" 
          color="primary" 
          text="Checking authentication..." 
        />
      </div>
    );
  }

  // Only render children if user is authenticated
  return user ? <>{children}</> : null;
}

