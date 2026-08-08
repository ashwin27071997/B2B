import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient inside component to avoid shared state between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Cache time: how long inactive data stays in cache
            gcTime: 1000 * 60 * 30, // 30 minutes
            // Retry failed requests
            retry: 1,
            // Refetch on window focus (useful for dashboard data)
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry failed mutations
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
