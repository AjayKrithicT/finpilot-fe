/**
 * PortfolioKpiGrid.tsx
 * 4 KPI summary cards + data-freshness bar (snapshot_date, price_as_of).
 * Cards: Total Market Value, Total Cost Basis, Unrealised G/L, Active Accounts.
 */

import { CalendarIcon, ClockIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { formatINR, formatSignedINR, formatPercent, formatDate } from '../../utils/formatters';
import type { PortfolioTotals } from '../../types/portfolio.types';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean | null;
}

function KpiCard({ label, value, sub, subPositive }: KpiCardProps) {
  const subColor =
    subPositive === true
      ? 'text-[#047857]'
      : subPositive === false
        ? 'text-[#B91C1C]'
        : 'text-[#64748B]';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-5 flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#64748B]">
        {label}
      </span>
      <span className="text-[28px] font-bold leading-[34px] text-[#0F172A] tabular-nums tracking-tight">
        {value}
      </span>
      {sub && (
        <span className={`text-xs font-medium tabular-nums ${subColor}`}>{sub}</span>
      )}
    </div>
  );
}

interface PortfolioKpiGridProps {
  totals: PortfolioTotals;
  snapshotDate: string | null;
  priceAsOf: string | null;
}

export function PortfolioKpiGrid({
  totals,
  snapshotDate,
  priceAsOf,
}: PortfolioKpiGridProps) {
  const glPositive =
    totals.total_unrealised_gain_loss > 0
      ? true
      : totals.total_unrealised_gain_loss < 0
        ? false
        : null;

  return (
    <div className="space-y-4">
      {/* Freshness bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
          <span className="font-medium text-[#475569]">
            {UI_COPY.PORTFOLIO.SNAPSHOT_DATE_LABEL}:
          </span>
          {formatDate(snapshotDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
          <span className="font-medium text-[#475569]">
            {UI_COPY.PORTFOLIO.PRICE_AS_OF_LABEL}:
          </span>
          {formatDate(priceAsOf)}
        </span>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          label={UI_COPY.PORTFOLIO.KPI_MARKET_VALUE}
          value={formatINR(totals.total_market_value)}
        />
        <KpiCard
          label={UI_COPY.PORTFOLIO.KPI_COST_BASIS}
          value={formatINR(totals.total_cost_basis)}
        />
        <KpiCard
          label={UI_COPY.PORTFOLIO.KPI_UNREALISED_PL}
          value={formatSignedINR(totals.total_unrealised_gain_loss)}
          sub={formatPercent(totals.total_unrealised_gain_loss_pct, true)}
          subPositive={glPositive}
        />
        <KpiCard
          label={UI_COPY.PORTFOLIO.KPI_ACTIVE_ACCOUNTS}
          value={String(totals.active_accounts_count)}
        />
      </div>
    </div>
  );
}
