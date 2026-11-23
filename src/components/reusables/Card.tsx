/**
 * Card.tsx
 * Standard surface container with optional title, subtitle, and header action slot.
 */

import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  noPadding = false,
}: CardProps) {
  const hasHeader = title ?? subtitle ?? headerAction;

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-xs ${className}`}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-[#E2E8F0]">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15px] font-semibold leading-[22px] text-[#0F172A] truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
