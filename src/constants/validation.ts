/**
 * Validation constants
 */

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Enter your email address.',
  EMAIL_INVALID: 'That email address does not look right.',
  PASSWORD_MIN_LENGTH: `Use at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`,
} as const;
