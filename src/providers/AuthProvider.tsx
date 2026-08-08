import { useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants';
import { AuthContext, type AuthContextValue, type AuthUser } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

const mapSupabaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
};

const getErrorMessage = (error: AuthError | null, fallback: string): string => {
  if (!error) return fallback;
  return error.message || fallback;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(mapSupabaseUser(initialSession?.user ?? null));
        setStatus(initialSession ? 'authenticated' : 'unauthenticated');
      } catch {
        setStatus('unauthenticated');
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(mapSupabaseUser(newSession?.user ?? null));
      setStatus(newSession ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return {
            success: false,
            error: getErrorMessage(error, 'Failed to sign in'),
          };
        }

        return { success: true };
      } catch {
        return { success: false, error: 'Failed to sign in. Please try again.' };
      }
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          return {
            success: false,
            error: getErrorMessage(error, 'Failed to create account'),
          };
        }

        return { success: true };
      } catch {
        return {
          success: false,
          error: 'Failed to create account. Please try again.',
        };
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.SSO_CALLBACK}`,
        },
      });

      if (error) {
        return {
          success: false,
          error: getErrorMessage(error, 'Failed to connect with Google'),
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Failed to connect with Google. Please try again.',
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      status,
      isLoaded: status !== 'loading',
      isSignedIn: status === 'authenticated',
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, session, status, signIn, signUp, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
