/**
 * CustomerFilters.tsx
 * Debounced search input (300 ms) + KYC Status and Segment dropdown filters.
 * Calls onChange whenever any value changes; resets page to 1 handled by parent.
 */

import { useEffect, useRef, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { KycStatus, CustomerSegment, KYC_STATUS_LABELS } from '../../constants/domain.constants';
import { UI_COPY } from '../../constants/ui.constants';
import { Button } from '../reusables/Button';
import type { CustomerListFilters } from '../../types/customer.types';

const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  [CustomerSegment.MASS]: 'Mass',
  [CustomerSegment.AFFLUENT]: 'Affluent',
  [CustomerSegment.HNI]: 'HNI',
};

interface CustomerFiltersProps {
  filters: CustomerListFilters;
  onChange: (updated: Partial<CustomerListFilters>) => void;
  onReset: () => void;
}

export function CustomerFilters({ filters, onChange, onReset }: CustomerFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search → 300 ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ search: searchInput || undefined });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external reset back into local state
  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const hasActiveFilters =
    !!filters.search || !!filters.kyc_status || !!filters.segment;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={UI_COPY.CUSTOMERS.SEARCH_PLACEHOLDER}
          aria-label={UI_COPY.ARIA.SEARCH_CUSTOMERS}
          className="w-full h-10 rounded-lg border border-[#E2E8F0] bg-white
            pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 transition-colors"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]
              hover:text-[#475569] rounded focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <XIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* KYC Status */}
      <select
        value={filters.kyc_status ?? ''}
        onChange={(e) =>
          onChange({ kyc_status: (e.target.value as KycStatus) || undefined })
        }
        aria-label={UI_COPY.ARIA.FILTER_KYC}
        className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3
          text-sm text-[#0F172A] min-w-[160px]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
      >
        <option value="">{UI_COPY.CUSTOMERS.FILTER_KYC_ALL}</option>
        {Object.values(KycStatus).map((s) => (
          <option key={s} value={s}>
            {KYC_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {/* Segment */}
      <select
        value={filters.segment ?? ''}
        onChange={(e) =>
          onChange({ segment: (e.target.value as CustomerSegment) || undefined })
        }
        aria-label={UI_COPY.ARIA.FILTER_SEGMENT}
        className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3
          text-sm text-[#0F172A] min-w-[150px]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
      >
        <option value="">{UI_COPY.CUSTOMERS.FILTER_SEGMENT_ALL}</option>
        {Object.values(CustomerSegment).map((s) => (
          <option key={s} value={s}>
            {SEGMENT_LABELS[s]}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset} className="h-10 px-3 text-sm">
          {UI_COPY.CUSTOMERS.RESET_FILTERS}
        </Button>
      )}
    </div>
  );
}
