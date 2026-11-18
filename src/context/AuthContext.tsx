/**
 * AuthContext.tsx
 * Manages JWT + user session in sessionStorage (cleared on tab close).
 * Exposes login(), logout(), isAuthenticated, isAdmin.
 * Registers the global 401 handler in apiClient on mount.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUnauthorizedHandler } from '../services/apiClient';
import { STORAGE_KEYS } from '../constants/theme.constants';
import { APP_ROUTES } from '../constants/routes.constants';
import { UserRole } from '../constants/domain.constants';
import { UI_COPY } from '../constants/ui.constants';
import type { AuthContextValue, AuthUser, LoginResponse } from '../types/auth.types';
import { useToast } from './ToastContext';

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────────

function readStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    navigate(APP_ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  // Register the 401 teardown handler once on mount
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
      addToast(UI_COPY.ERRORS.SESSION_EXPIRED, 'error');
      navigate(APP_ROUTES.LOGIN, { replace: true });
    });
  }, [navigate, addToast]);

  const login = useCallback(
    (response: LoginResponse) => {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      addToast(UI_COPY.LOGIN.WELCOME_TOAST(response.user.full_name), 'success');
      navigate(APP_ROUTES.CUSTOMERS, { replace: true });
    },
    [navigate, addToast],
  );

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: token !== null && user !== null,
    isAdmin: user?.role === UserRole.ADMIN,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
