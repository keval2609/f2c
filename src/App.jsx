// src/App.jsx
// Key Google Sign-In routes:
//   /role-select  — shown to NEW Google users (needsRoleSelection === true)
//   /farmer-setup — farmer onboarding (profile + payout)
//   /onboarding   — customer onboarding (delivery address)
//
// AuthContext.loginWithGoogle sets needsRoleSelection = true for new Google users,
// which makes ProtectedRoute redirect them to /role-select automatically.

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageSpinner from './components/ui/PageSpinner';

import { useAuth } from './context/AuthContext';

// ── Lazy-loaded pages (each becomes its own chunk) ────────────────────────
const DiscoveryPage          = lazy(() => import('./pages/DiscoveryPage'));
const FarmerProfilePage      = lazy(() => import('./pages/FarmerProfilePage'));
const CheckoutPage           = lazy(() => import('./pages/CheckoutPage'));
const LoginPage              = lazy(() => import('./pages/LoginPage'));
const SignupPage             = lazy(() => import('./pages/SignupPage'));
const RoleSelectPage         = lazy(() => import('./pages/RoleSelectPage'));
const OnboardingPage         = lazy(() => import('./pages/OnboardingPage'));
const FarmerSetupPage        = lazy(() => import('./pages/FarmerSetupPage'));
const FarmerDashboardPage    = lazy(() => import('./pages/FarmerDashboardPage'));
const ChatListPage           = lazy(() => import('./pages/ChatListPage'));
const ChatPage               = lazy(() => import('./pages/ChatPage'));
const AddProductPage         = lazy(() => import('./pages/AddProductPage'));
const EditFarmerProfilePage  = lazy(() => import('./pages/EditFarmerProfilePage'));

// ── Root route: farmers → dashboard, everyone else → discovery ────────────
function RootRoute() {
  const { user, isFarmer, loading } = useAuth();
  if (loading) return null;
  if (user && isFarmer) return <Navigate to="/dashboard" replace />;
  return <DiscoveryPage />;
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageSpinner />}>
        <Routes>

          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/farmer/:id" element={<FarmerProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Google Sign-In: role selection for brand-new Google users ─ */}
          {/* needsRoleSelection flag (set in AuthContext) drives users here  */}
          <Route path="/role-select" element={<RoleSelectPage />} />

          {/* ── Onboarding (any authenticated user) ─────────────────────── */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer-setup"
            element={
              <ProtectedRoute>
                <FarmerSetupPage />
              </ProtectedRoute>
            }
          />

          {/* ── Checkout (any authenticated user) ───────────────────────── */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* ── Messaging (any authenticated user) ──────────────────────── */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ChatListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:farmerId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* ── Farmer Dashboard (farmer-only) ──────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute requiredRole="farmer">
                <EditFarmerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ── Product management (farmer-only) ────────────────────────── */}
          <Route
            path="/dashboard/add-product"
            element={
              <ProtectedRoute requiredRole="farmer">
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-product/:id"
            element={
              <ProtectedRoute requiredRole="farmer">
                <AddProductPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </AppShell>
  );
}
