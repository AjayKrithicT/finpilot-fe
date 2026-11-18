/**
 * CustomersPage.tsx
 * Customer directory at /customers.
 * Fetches server-side with debounced search, KYC, and segment filters.
 * Resets page to 1 whenever any filter changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { UI_COPY } from '../constants/ui.constants';
import { PAGINATION_DEFAULTS } from '../constants/domain.constants';
import { fetchCustomers } from '../services/customer.api';
import { ApiClientError } from '../services/apiClient';
import { CustomerFilters } from '../components/customers/CustomerFilters';
import { CustomerTable } from '../components/customers/CustomerTable';
import { TableSkeleton } from '../components/reusables/Skeleton';
import { ErrorBanner } from '../components/reusables/ErrorBanner';
import type { CustomerSummary, CustomerListFilters } from '../types/customer.types';
import type { PaginationMeta } from '../types/common.types';

const DEFAULT_FILTERS: CustomerListFilters = {
  page: PAGINATION_DEFAULTS.PAGE,
  limit: PAGINATION_DEFAULTS.LIMIT,
};

export function CustomersPage() {
  const [filters, setFilters] = useState<CustomerListFilters>(DEFAULT_FILTERS);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    total_items: 0,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (currentFilters: CustomerListFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchCustomers(currentFilters);
      setCustomers(result.data);
      setPagination(result.pagination);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  // Filter change: reset page to 1
  const handleFilterChange = (updated: Partial<CustomerListFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated, page: PAGINATION_DEFAULTS.PAGE }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: PAGINATION_DEFAULTS.PAGE }));
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
          {UI_COPY.CUSTOMERS.PAGE_TITLE}
        </h1>
      </div>

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Error state */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={() => void load(filters)}
        />
      )}

      {/* Table / skeleton */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <TableSkeleton rows={10} cols={8} />
        </div>
      ) : !error ? (
        <CustomerTable
          customers={customers}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      ) : null}
    </div>
  );
}
