import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, QueryProvider } from '@/providers';
import '@/theme/globalStyles.css';
import App from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
