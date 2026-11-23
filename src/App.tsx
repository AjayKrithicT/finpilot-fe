/**
 * App.tsx
 * Root component: BrowserRouter → ToastProvider → AuthProvider → Routes.
 * ToastProvider must be the outermost context so AuthContext can call useToast().
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { APP_ROUTES } from './constants/routes.constants';
import { UserRole } from './constants/domain.constants';

import { LoginPage } from './pages/LoginPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerWorkspacePage } from './pages/CustomerWorkspacePage';
import { AdminImportPage } from './pages/AdminImportPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />

            {/* Root redirect */}
            <Route
              path={APP_ROUTES.ROOT}
              element={<Navigate to={APP_ROUTES.CUSTOMERS} replace />}
            />

            {/* Authenticated — VIEWER + ADMIN */}
            <Route
              path={APP_ROUTES.CUSTOMERS}
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:customerId"
              element={
                <ProtectedRoute>
                  <CustomerWorkspacePage />
                </ProtectedRoute>
              }
            />

            {/* Authenticated — ADMIN only */}
            <Route
              path={APP_ROUTES.ADMIN_IMPORTS}
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminImportPage />
                </ProtectedRoute>
              }
            />

            {/* Error pages — rendered inside AppShell when authenticated */}
            <Route
              path={APP_ROUTES.FORBIDDEN}
              element={
                <ProtectedRoute>
                  <ForbiddenPage />
                </ProtectedRoute>
              }
            />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
