import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// This is a simple placeholder for authentication
// In a real app, you would check if the user is authenticated
const isAuthenticated = true;

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
} 