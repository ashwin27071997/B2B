import { useAuth as useClerkAuth, useUser, useSignIn, useSignUp } from '@clerk/clerk-react';
import { useCallback, useState } from 'react';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface UseAuthReturn {
  // State
  isLoaded: boolean;
  isSignedIn: boolean;
  user: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    imageUrl: string;
  } | null;
  status: AuthStatus;

  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useClerkAuth();
  const { user } = useUser();
  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const [, setStatus] = useState<AuthStatus>('idle');

  const getStatus = (): AuthStatus => {
    if (!isLoaded) return 'loading';
    if (isSignedIn) return 'authenticated';
    return 'unauthenticated';
  };

  const handleSignIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!signInLoaded || !signIn) {
        return { success: false, error: 'Auth not initialized' };
      }

      setStatus('loading');

      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === 'complete') {
          await setSignInActive?.({ session: result.createdSessionId });
          setStatus('authenticated');
          return { success: true };
        }

        setStatus('unauthenticated');
        return { success: false, error: 'Sign in incomplete' };
      } catch (err: unknown) {
        setStatus('unauthenticated');
        const error = err as { errors?: Array<{ message: string }> };
        return {
          success: false,
          error: error.errors?.[0]?.message || 'Failed to sign in',
        };
      }
    },
    [signIn, signInLoaded, setSignInActive]
  );

  const handleSignUp = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!signUpLoaded || !signUp) {
        return { success: false, error: 'Auth not initialized' };
      }

      setStatus('loading');

      try {
        const result = await signUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === 'complete') {
          await setSignUpActive?.({ session: result.createdSessionId });
          setStatus('authenticated');
          return { success: true };
        }

        // Handle email verification if needed
        if (result.status === 'missing_requirements') {
          // Clerk may require email verification
          setStatus('unauthenticated');
          return { success: true }; // Account created, verification needed
        }

        setStatus('unauthenticated');
        return { success: false, error: 'Sign up incomplete' };
      } catch (err: unknown) {
        setStatus('unauthenticated');
        const error = err as { errors?: Array<{ message: string }> };
        return {
          success: false,
          error: error.errors?.[0]?.message || 'Failed to sign up',
        };
      }
    },
    [signUp, signUpLoaded, setSignUpActive]
  );

  const handleSignInWithGoogle = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!signInLoaded || !signIn) {
      return { success: false, error: 'Auth not initialized' };
    }

    setStatus('loading');

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
      return { success: true };
    } catch (err: unknown) {
      setStatus('unauthenticated');
      const error = err as { errors?: Array<{ message: string }> };
      return {
        success: false,
        error: error.errors?.[0]?.message || 'Failed to sign in with Google',
      };
    }
  }, [signIn, signInLoaded]);

  const handleSignOut = useCallback(async () => {
    setStatus('loading');
    await clerkSignOut();
    setStatus('unauthenticated');
  }, [clerkSignOut]);

  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
        }
      : null,
    status: getStatus(),
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  };
};
