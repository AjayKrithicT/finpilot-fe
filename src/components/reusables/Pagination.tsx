/**
 * Pagination.tsx
 * Server-synchronized pagination bar: item range label, page-size selector,
 * Previous / Next buttons. All strings from UI_COPY.
 */

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { PAGINATION_DEFAULTS } from '../../constants/domain.constants';
import type { PaginationMeta } from '../../types/common.types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  className = '',
}: PaginationProps) {
  const { page, limit, total_items, total_pages } = meta;
  const from = total_items === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total_items);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#E2E8F0] text-sm text-[#475569] ${className}`}
    >
      {/* Item range label */}
      <span className="tabular-nums">
        {UI_COPY.PAGINATION.SHOWING(from, to, total_items)}
      </span>

      <div className="flex items-center gap-3">
        {/* Rows-per-page selector */}
        {onLimitChange && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="page-limit-select"
              className="text-xs text-[#64748B] whitespace-nowrap"
            >
              {UI_COPY.PAGINATION.ROWS_PER_PAGE}
            </label>
            <select
              id="page-limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-[#E2E8F0] bg-white px-2 text-sm
                text-[#0F172A] focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              {PAGINATION_DEFAULTS.LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={UI_COPY.ARIA.PAGINATION_PREV}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-[#E2E8F0]
            bg-white text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Current page indicator */}
        <span className="tabular-nums text-xs font-medium text-[#0F172A]">
          {page} / {total_pages}
        </span>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          aria-label={UI_COPY.ARIA.PAGINATION_NEXT}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-[#E2E8F0]
            bg-white text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
