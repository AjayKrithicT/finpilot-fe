/**
 * auth.types.ts
 * Authentication DTOs and AuthContext contract.
 */

import type { UserRole } from '../constants/domain.constants';

// ── API DTOs ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// ── Context Contract ──────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
}
