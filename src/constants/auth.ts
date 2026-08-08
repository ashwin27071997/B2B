/**
 * Authentication constants
 */

import { ROUTES } from './routes';

export const AUTH = {
  OAUTH_STRATEGIES: {
    GOOGLE: 'oauth_google',
  },
  REDIRECT_URLS: {
    SSO_CALLBACK: ROUTES.SSO_CALLBACK,
    AFTER_AUTH: ROUTES.DASHBOARD,
  },
} as const;

export const AUTH_MESSAGES = {
  NOT_INITIALIZED: 'Authentication not initialized. Please refresh.',
  SIGN_IN_FAILED: 'Failed to sign in. Please try again.',
  SIGN_UP_FAILED: 'Failed to create account. Please try again.',
  SIGN_IN_INCOMPLETE: 'Sign in could not be completed.',
  SIGN_UP_INCOMPLETE: 'Sign up could not be completed.',
  GOOGLE_FAILED: 'Failed to connect with Google.',
} as const;
