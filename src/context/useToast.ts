/**
 * useToast.ts
 * Hook to consume ToastContext. Lives in a separate file so that ToastContext.tsx
 * only exports the ToastProvider component, satisfying react-refresh/only-export-components.
 */

import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './ToastContext';

export type { ToastTone } from './ToastContext';

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
