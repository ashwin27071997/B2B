import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute, ErrorBoundary } from '@/components';
import { LoadingSpinner } from '@/components/shared';
import { ROUTES } from '@/constants';

// Lazy load page components for code splitting
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const BusinessOnboarding = lazy(() =>
  import('@/pages/BusinessOnboarding').then((m) => ({ default: m.BusinessOnboarding }))
);
const ConsultationIntro = lazy(() =>
  import('@/pages/ConsultationIntro').then((m) => ({ default: m.ConsultationIntro }))
);
const ConsultationBooking = lazy(() =>
  import('@/pages/ConsultationBooking').then((m) => ({ default: m.ConsultationBooking }))
);
const ConsultationConfirmed = lazy(() =>
  import('@/pages/ConsultationConfirmed').then((m) => ({ default: m.ConsultationConfirmed }))
);
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const SSOCallback = lazy(() =>
  import('@/pages/SSOCallback').then((m) => ({ default: m.SSOCallback }))
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
          <Routes>
            {/* Public routes */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path={ROUTES.SSO_CALLBACK} element={<SSOCallback />} />

            {/* Protected routes */}
            <Route
              path={ROUTES.BUSINESS_ONBOARDING}
              element={
                <ProtectedRoute>
                  <BusinessOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CONSULTATION_INTRO}
              element={
                <ProtectedRoute>
                  <ConsultationIntro />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CONSULTATION_BOOKING}
              element={
                <ProtectedRoute>
                  <ConsultationBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CONSULTATION_CONFIRMED}
              element={
                <ProtectedRoute>
                  <ConsultationConfirmed />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
