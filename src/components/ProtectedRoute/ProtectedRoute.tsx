import { memo, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/shared';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Route to redirect to if not authenticated */
  redirectTo?: string;
}

/**
 * Route wrapper that requires authentication
 * Redirects to login if not signed in, preserving the intended destination
 */
export const ProtectedRoute = memo(
  ({ children, redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) => {
    const { isLoaded, isSignedIn } = useAuth();
    const location = useLocation();

    if (!isLoaded) {
      return <LoadingSpinner fullScreen text="Loading..." />;
    }

    if (!isSignedIn) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
  }
);

ProtectedRoute.displayName = 'ProtectedRoute';
