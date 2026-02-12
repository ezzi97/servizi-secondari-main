import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/contexts/auth-context';

type GuestGuardProps = {
  children: ReactNode;
};

/** Redirects authenticated users away from public pages (login, sign-up, etc.) */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
