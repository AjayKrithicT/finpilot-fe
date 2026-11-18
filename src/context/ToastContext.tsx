/**
 * ToastContext.tsx
 * Lightweight aria-live toast notification queue.
 * Toasts auto-dismiss after 4 seconds.
 * Renders a fixed overlay outside the main layout flow.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  addToast: (message: string, tone: ToastTone) => void;
}

// ── Tone → Tailwind classes ───────────────────────────────────────────────────

const TOAST_CLASSES: Record<ToastTone, string> = {
  success: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
  error:   'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
  warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
  info:    'bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]',
};

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

let _toastCounter = 0;

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, tone: ToastTone) => {
    const id = `toast-${++_toastCounter}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* aria-live region ensures screen readers announce new toasts */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium shadow-md transition-all duration-300 ${TOAST_CLASSES[toast.tone]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
