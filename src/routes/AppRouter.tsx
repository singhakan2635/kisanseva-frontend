import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Public pages — loaded eagerly
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/public/TermsOfServicePage';
import { DataDeletionPage } from '@/pages/public/DataDeletionPage';

// Farmer pages — lazy loaded
const FarmerDashboard = lazy(() => import('@/pages/farmer/FarmerDashboard').then(m => ({ default: m.FarmerDashboard })));

// Expert pages — lazy loaded
const ExpertDashboard = lazy(() => import('@/pages/expert/ExpertDashboard').then(m => ({ default: m.ExpertDashboard })));

// Admin pages — lazy loaded
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <LoadingSpinner size="lg" />
    </div>
  );
}

/** Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />

          {/* Farmer routes */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route element={<MainLayout />}>
              <Route path="/farmer" element={<FarmerDashboard />} />
            </Route>
          </Route>

          {/* Expert routes */}
          <Route element={<ProtectedRoute allowedRoles={['expert']} />}>
            <Route element={<MainLayout />}>
              <Route path="/expert" element={<ExpertDashboard />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
