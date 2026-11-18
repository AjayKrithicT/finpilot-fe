/**
 * Modal.tsx
 * Accessible modal overlay: role="dialog", aria-modal="true", aria-labelledby,
 * Escape key close, backdrop click close.
 */

import { useEffect, useId, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className = '' }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-labelledby={titleId}
        className={`relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E2E8F0]">
          <h2
            id={titleId}
            className="text-[18px] font-semibold leading-[26px] text-[#0F172A]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={UI_COPY.ARIA.CLOSE_MODAL}
            className="text-[#64748B] hover:text-[#0F172A] rounded-lg p-1 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <XIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
