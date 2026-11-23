/**
 * useAuth.ts
 * Hook to consume AuthContext. Lives in a separate file so that AuthContext.tsx
 * only exports the AuthProvider component, satisfying react-refresh/only-export-components.
 */

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from '../types/auth.types';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
