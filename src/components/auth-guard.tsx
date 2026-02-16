import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/contexts/auth-context';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect while still checking auth state
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
