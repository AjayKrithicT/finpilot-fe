/**
 * ProtectedRoute.test.tsx
 * Tests:
 *  1. Unauthenticated user is redirected to /login
 *  2. Authenticated VIEWER can access a VIEWER-allowed route
 *  3. Authenticated VIEWER is blocked from ADMIN-only route → /forbidden
 *  4. Authenticated ADMIN can access the ADMIN-only route
 *  5. Logout clears sessionStorage and redirects to /login
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../src/context/ToastContext';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/context/useAuth';
import { ProtectedRoute } from '../src/components/layout/ProtectedRoute';
import { UserRole } from '../src/constants/domain.constants';
import { STORAGE_KEYS } from '../src/constants/theme.constants';
import type { AuthUser } from '../src/types/auth.types';

// ── Mock apiClient so no real fetch occurs ────────────────────────────────────

vi.mock('../src/services/apiClient', () => ({
  registerUnauthorizedHandler: vi.fn(),
  buildQueryString: vi.fn(() => ''),
  ApiClientError: class ApiClientError extends Error {
    code = 'ERR';
    httpStatus = 0;
    details: { field: string; issue: string }[] = [];
    requestId = '';
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    postForm: vi.fn(),
  },
}));

// ── Test data ─────────────────────────────────────────────────────────────────

const VIEWER_USER: AuthUser = {
  user_id: 'U001',
  email: 'viewer@finpilot.local',
  full_name: 'Test Viewer',
  role: UserRole.VIEWER,
};

const ADMIN_USER: AuthUser = {
  user_id: 'U002',
  email: 'admin@finpilot.local',
  full_name: 'Test Admin',
  role: UserRole.ADMIN,
};

function seedSession(user: AuthUser, token = 'test-token') {
  sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
}

// ── Minimal tree builder ──────────────────────────────────────────────────────

function AppTree({ initialPath, adminOnly = false }: { initialPath: string; adminOnly?: boolean }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/forbidden" element={<div>Forbidden Page</div>} />
            <Route path="/customers" element={<div>Customers Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/imports"
              element={
                <ProtectedRoute allowedRoles={adminOnly ? [UserRole.ADMIN] : undefined}>
                  <div>Admin Import Page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

// ── LogoutButton helper component ─────────────────────────────────────────────

function LogoutButton() {
  const { logout } = useAuth();
  return <button type="button" onClick={logout}>Sign out</button>;
}

function LogoutTree() {
  return (
    <MemoryRouter initialEntries={['/protected']}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <LogoutButton />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProtectedRoute — access control', () => {
  beforeEach(() => clearSession());
  afterEach(() => clearSession());

  it('redirects unauthenticated user to /login', () => {
    render(<AppTree initialPath="/protected" />);
    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('renders protected content for authenticated VIEWER', () => {
    seedSession(VIEWER_USER);
    render(<AppTree initialPath="/protected" />);
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('blocks VIEWER from ADMIN-only route → /forbidden', () => {
    seedSession(VIEWER_USER);
    render(<AppTree initialPath="/admin/imports" adminOnly />);
    expect(screen.getByText('Forbidden Page')).toBeTruthy();
    expect(screen.queryByText('Admin Import Page')).toBeNull();
  });

  it('allows ADMIN to access ADMIN-only route', () => {
    seedSession(ADMIN_USER);
    render(<AppTree initialPath="/admin/imports" adminOnly />);
    expect(screen.getByText('Admin Import Page')).toBeTruthy();
  });
});

describe('Logout — session teardown', () => {
  beforeEach(() => clearSession());
  afterEach(() => clearSession());

  it('clears sessionStorage TOKEN and USER on logout', async () => {
    seedSession(VIEWER_USER);
    render(<LogoutTree />);

    expect(screen.getByText('Sign out')).toBeTruthy();
    fireEvent.click(screen.getByText('Sign out'));

    await waitFor(() => {
      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });

  it('navigates to /login after logout', async () => {
    seedSession(VIEWER_USER);
    render(<LogoutTree />);

    fireEvent.click(screen.getByText('Sign out'));

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeTruthy();
    });
  });
});
