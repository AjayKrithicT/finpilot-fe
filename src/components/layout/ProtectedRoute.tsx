/**
 * ProtectedRoute.tsx
 * Auth check + optional role guard.
 * - Unauthenticated → redirect to /login
 * - Authenticated but wrong role → render ForbiddenPage inline
 * - Authenticated + allowed role → render children inside AppShell
 */

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { APP_ROUTES } from '../../constants/routes.constants';
import { AppShell } from './AppShell';
import type { UserRole } from '../../constants/domain.constants';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // Role restriction check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.FORBIDDEN} replace />;
  }

  return <AppShell>{children}</AppShell>;
}
