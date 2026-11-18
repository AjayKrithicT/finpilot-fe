/**
 * PortfolioModule.tsx
 * Orchestrates the full portfolio tab: fetches data, handles loading/error/empty,
 * and composes KpiGrid → AccountCards → AllocationChart → PositionsTable.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchCustomerPortfolio } from '../../services/portfolio.api';
import { ApiClientError } from '../../services/apiClient';
import { UI_COPY } from '../../constants/ui.constants';
import { PortfolioKpiGrid } from './PortfolioKpiGrid';
import { AccountSummaryCards } from './AccountSummaryCards';
import { AssetAllocationChart } from './AssetAllocationChart';
import { PositionsTable } from './PositionsTable';
import { Card } from '../reusables/Card';
import { ErrorBanner } from '../reusables/ErrorBanner';
import { KpiGridSkeleton, CardGridSkeleton, TableSkeleton } from '../reusables/Skeleton';
import type { PortfolioResponse } from '../../types/portfolio.types';

interface PortfolioModuleProps {
  customerId: string;
}

export function PortfolioModule({ customerId }: PortfolioModuleProps) {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerPortfolio(customerId);
      setPortfolio(data);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC,
      );
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return <ErrorBanner message={error} onRetry={() => void load()} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <KpiGridSkeleton />
        <CardGridSkeleton count={3} />
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <TableSkeleton rows={6} cols={10} />
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="space-y-6">
      {/* KPI summary + freshness */}
      <PortfolioKpiGrid
        totals={portfolio.totals}
        snapshotDate={portfolio.snapshot_date}
        priceAsOf={portfolio.price_as_of}
      />

      {/* Account summary cards */}
      <Card
        title={UI_COPY.PORTFOLIO.ACCOUNTS_SECTION_TITLE}
        noPadding={portfolio.accounts.length > 0}
      >
        <div className={portfolio.accounts.length > 0 ? 'p-5' : ''}>
          <AccountSummaryCards accounts={portfolio.accounts} />
        </div>
      </Card>

      {/* Asset allocation donut */}
      <Card title={UI_COPY.PORTFOLIO.ALLOCATION_CHART_TITLE}>
        <AssetAllocationChart allocations={portfolio.allocation_by_asset_class} />
      </Card>

      {/* Holdings positions table */}
      <div>
        <h2 className="text-[18px] font-semibold leading-[26px] text-[#0F172A] mb-4">
          {UI_COPY.PORTFOLIO.POSITIONS_SECTION_TITLE}
        </h2>
        <PositionsTable customerId={customerId} />
      </div>
    </div>
  );
}
