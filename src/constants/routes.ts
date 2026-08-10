/**
 * Application route constants
 * Centralized to avoid magic strings and enable easy refactoring
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  BUSINESS_ONBOARDING: '/onboarding',
  CONSULTATION_INTRO: '/onboarding/consultation',
  CONSULTATION_BOOKING: '/onboarding/consultation/book',
  CONSULTATION_CONFIRMED: '/onboarding/consultation/confirmed',
  DASHBOARD: '/dashboard',
  SSO_CALLBACK: '/sso-callback',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
