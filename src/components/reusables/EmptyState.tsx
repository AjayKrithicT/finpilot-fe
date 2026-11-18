/**
 * EmptyState.tsx
 * Structured zero-data state with icon, title, message, and optional CTA.
 */

import type { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 px-6 text-center ${className}`}
      role="status"
    >
      <div className="text-[#CBD5E1]">
        {icon ?? <InboxIcon className="w-10 h-10" aria-hidden="true" />}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#0F172A]">{title}</p>
        <p className="text-sm text-[#64748B] mt-1 max-w-xs">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
