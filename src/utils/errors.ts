/**
 * Clerk error type definition
 */
export interface ClerkError {
  errors?: Array<{
    code: string;
    message: string;
    longMessage?: string;
    meta?: Record<string, unknown>;
  }>;
}

/**
 * Extract user-friendly error message from Clerk error
 */
export const getClerkErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  const clerkError = error as ClerkError;
  return clerkError?.errors?.[0]?.message || fallbackMessage;
};

/**
 * Check if error is a Clerk error
 */
export const isClerkError = (error: unknown): error is ClerkError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as ClerkError).errors)
  );
};
