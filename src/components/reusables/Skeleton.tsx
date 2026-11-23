/**
 * Skeleton.tsx
 * Dimension-matched loading placeholders for KPI cards, tables, and
 * generic blocks. Never leaves a blank screen during fetches.
 */

interface SkeletonProps {
  className?: string;
}

/** Single animated shimmer block — compose into any layout */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[#F1F5F9] ${className}`}
    />
  );
}

/** 4-column KPI card row skeleton */
export function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Table skeleton — renders N placeholder rows */
export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-0" aria-hidden="true" aria-label="Loading table data">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 px-4 py-3 border-b border-[#E2E8F0]"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Card-grid skeleton for goal cards or account cards */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}
