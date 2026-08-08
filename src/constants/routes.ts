/**
 * Application route constants
 * Centralized to avoid magic strings and enable easy refactoring
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SSO_CALLBACK: '/sso-callback',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
