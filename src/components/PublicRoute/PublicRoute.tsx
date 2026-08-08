import { memo, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface PublicRouteProps {
  children: ReactNode;
  /** Route to redirect to if already authenticated */
  redirectTo?: string;
}

/**
 * Route wrapper that redirects authenticated users away from public pages
 * (e.g., login page should redirect to dashboard if already signed in)
 */
export const PublicRoute = memo(
  ({ children, redirectTo = ROUTES.DASHBOARD }: PublicRouteProps) => {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
      return null;
    }

    if (isSignedIn) {
      return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
  }
);

PublicRoute.displayName = 'PublicRoute';
