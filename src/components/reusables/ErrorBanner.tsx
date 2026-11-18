/**
 * ErrorBanner.tsx
 * Inline API error alert (role="alert") with optional Retry button.
 */

import { AlertCircleIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { Button } from './Button';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({ message, onRetry, className = '' }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 ${className}`}
    >
      <AlertCircleIcon
        className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <p className="flex-1 text-sm text-[#B91C1C] leading-5">{message}</p>
      {onRetry && (
        <Button
          variant="ghost"
          onClick={onRetry}
          aria-label={UI_COPY.ARIA.RETRY}
          className="shrink-0 text-[#B91C1C] hover:bg-[#FECACA] h-8 px-3 text-xs"
        >
          {UI_COPY.ERRORS.RETRY}
        </Button>
      )}
    </div>
  );
}
