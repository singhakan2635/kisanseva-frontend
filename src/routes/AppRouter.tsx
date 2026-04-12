import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Public pages — loaded eagerly
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { QRLandingPage } from '@/pages/public/QRLandingPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/public/TermsOfServicePage';
import { DataDeletionPage } from '@/pages/public/DataDeletionPage';

// Farmer pages — lazy loaded
const FarmerDashboard = lazy(() => import('@/pages/farmer/FarmerDashboard').then(m => ({ default: m.FarmerDashboard })));
const ScanPage = lazy(() => import('@/pages/farmer/ScanPage').then(m => ({ default: m.ScanPage })));
const DiagnosisResultPage = lazy(() => import('@/pages/farmer/DiagnosisResultPage').then(m => ({ default: m.DiagnosisResultPage })));
const HistoryPage = lazy(() => import('@/pages/farmer/HistoryPage').then(m => ({ default: m.HistoryPage })));
const MarketPricesPage = lazy(() => import('@/pages/farmer/MarketPricesPage').then(m => ({ default: m.MarketPricesPage })));
const GovtSchemesPage = lazy(() => import('@/pages/farmer/GovtSchemesPage').then(m => ({ default: m.GovtSchemesPage })));
const FarmerProfilePage = lazy(() => import('@/pages/farmer/FarmerProfilePage').then(m => ({ default: m.FarmerProfilePage })));

// Expert pages — lazy loaded
const ExpertDashboard = lazy(() => import('@/pages/expert/ExpertDashboard').then(m => ({ default: m.ExpertDashboard })));

// Admin pages — lazy loaded
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UsersPage = lazy(() => import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const DiagnosesPage = lazy(() => import('@/pages/admin/DiagnosesPage').then(m => ({ default: m.DiagnosesPage })));
const DiseaseDatabasePage = lazy(() => import('@/pages/admin/DiseaseDatabasePage').then(m => ({ default: m.DiseaseDatabasePage })));
const SchemesPage = lazy(() => import('@/pages/admin/SchemesPage').then(m => ({ default: m.SchemesPage })));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const QRCodesPage = lazy(() => import('@/pages/admin/QRCodesPage').then(m => ({ default: m.QRCodesPage })));

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

/** Thin progress bar at top of screen during route transitions */
function NavigationProgress() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timeoutRef.current);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-primary-100/50">
      <div className="h-full w-1/2 bg-primary-600 rounded-r-full animate-nav-progress" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationProgress />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/start" element={<QRLandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />

          {/* Farmer routes */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route element={<MainLayout />}>
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/history" element={<HistoryPage />} />
              <Route path="/farmer/market" element={<MarketPricesPage />} />
              <Route path="/farmer/schemes" element={<GovtSchemesPage />} />
              <Route path="/farmer/profile" element={<FarmerProfilePage />} />
              <Route path="/farmer/diagnosis/result" element={<DiagnosisResultPage />} />
              <Route path="/farmer/diagnosis/:id" element={<DiagnosisResultPage />} />
            </Route>
            {/* ScanPage is full-screen, no MainLayout */}
            <Route path="/farmer/scan" element={<ScanPage />} />
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
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/diagnoses" element={<DiagnosesPage />} />
              <Route path="/admin/database" element={<DiseaseDatabasePage />} />
              <Route path="/admin/schemes" element={<SchemesPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/qr-codes" element={<QRCodesPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
