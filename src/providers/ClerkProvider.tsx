import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Auth features will not work.\n' +
    'Get your key from https://dashboard.clerk.com and add it to .env.local'
  );
}

interface ClerkProviderProps {
  children: ReactNode;
}

export const ClerkProvider = ({ children }: ClerkProviderProps) => {
  if (!PUBLISHABLE_KEY) {
    // Return children without Clerk wrapper if no key (dev mode fallback)
    return <>{children}</>;
  }

  return (
    <BaseClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        // We use custom UI, so minimal Clerk appearance config
        variables: {
          colorPrimary: '#6E7BFF',
          colorBackground: '#08080C',
          colorText: '#EEF0FA',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
};
