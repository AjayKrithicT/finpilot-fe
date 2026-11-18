/**
 * TransactionsModule.tsx
 * Orchestrates server-filtered transaction ledger.
 * Fetches instruments once on mount; re-fetches transactions on any filter/sort/page change.
 * Filter changes reset page to 1.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchCustomerTransactions, fetchInstruments } from '../../services/transaction.api';
import { ApiClientError } from '../../services/apiClient';
import { UI_COPY } from '../../constants/ui.constants';
import { PAGINATION_DEFAULTS, SortDirection } from '../../constants/domain.constants';
import { TransactionFiltersBar } from './TransactionFiltersBar';
import { TransactionsTable } from './TransactionsTable';
import { TableSkeleton } from '../reusables/Skeleton';
import { ErrorBanner } from '../reusables/ErrorBanner';
import type { TransactionFilters, TransactionItem, InstrumentOption } from '../../types/transaction.types';
import type { AccountSummary } from '../../types/customer.types';
import type { PaginationMeta } from '../../types/common.types';

interface TransactionsModuleProps {
  customerId: string;
  accounts: AccountSummary[];
}

const DEFAULT_FILTERS: TransactionFilters = {
  page: PAGINATION_DEFAULTS.PAGE,
  limit: PAGINATION_DEFAULTS.LIMIT,
  sort_by: 'trade_date',
  sort_dir: SortDirection.DESC,
};

type SortableCol = NonNullable<TransactionFilters['sort_by']>;

export function TransactionsModule({ customerId, accounts }: TransactionsModuleProps) {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    total_items: 0,
    total_pages: 0,
  });
  const [instruments, setInstruments] = useState<InstrumentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load instruments once
  useEffect(() => {
    fetchInstruments()
      .then(setInstruments)
      .catch(() => setInstruments([]));
  }, []);

  const load = useCallback(async (currentFilters: TransactionFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerTransactions(customerId, currentFilters);
      setTransactions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleFilterChange = (updated: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated, page: PAGINATION_DEFAULTS.PAGE }));
  };

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  const handleSort = (col: SortableCol) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: col,
      sort_dir:
        prev.sort_by === col && prev.sort_dir === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC,
      page: PAGINATION_DEFAULTS.PAGE,
    }));
  };

  const handlePageChange = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  const handleLimitChange = (limit: number) =>
    setFilters((prev) => ({ ...prev, limit, page: PAGINATION_DEFAULTS.PAGE }));

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-semibold leading-[26px] text-[#0F172A]">
        {UI_COPY.TRANSACTIONS.SECTION_TITLE}
      </h2>

      <TransactionFiltersBar
        filters={filters}
        accounts={accounts}
        instruments={instruments}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {error && <ErrorBanner message={error} onRetry={() => void load(filters)} />}

      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <TableSkeleton rows={8} cols={9} />
        </div>
      ) : !error ? (
        <TransactionsTable
          transactions={transactions}
          pagination={pagination}
          sortBy={filters.sort_by}
          sortDir={filters.sort_dir}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      ) : null}
    </div>
  );
}
