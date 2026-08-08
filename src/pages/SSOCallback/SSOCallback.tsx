import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/shared';

export const SSOCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase handles the OAuth callback automatically via detectSessionInUrl
      // We just need to check if there's a session and redirect
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        // If no session, redirect to login
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingSpinner fullScreen text="Completing sign in..." />;
};
