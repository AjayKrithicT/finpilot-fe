/**
 * AccountSummaryCards.tsx
 * Per-account valuation cards: provider, account type, status badge,
 * cost basis, market value, and unrealised P&L with color coding.
 */

import { UI_COPY } from '../../constants/ui.constants';
import {
  ACCOUNT_TYPE_LABELS,
} from '../../constants/domain.constants';
import {
  ACCOUNT_STATUS_TONE,
} from '../../constants/theme.constants';
import { formatINR, formatSignedINR, formatPercent } from '../../utils/formatters';
import { Badge } from '../reusables/Badge';
import { EmptyState } from '../reusables/EmptyState';
import type { AccountAllocation } from '../../types/portfolio.types';

interface AccountCardProps {
  account: AccountAllocation;
}

function AccountCard({ account }: AccountCardProps) {
  const isPositive = account.unrealised_gain_loss > 0;
  const isNegative = account.unrealised_gain_loss < 0;
  const plColor = isPositive
    ? 'text-[#047857]'
    : isNegative
      ? 'text-[#B91C1C]'
      : 'text-[#475569]';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-5
      hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#0F172A] truncate">
            {ACCOUNT_TYPE_LABELS[account.account_type]}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5 truncate">
            {UI_COPY.PORTFOLIO.ACCOUNT_PROVIDER_LABEL}: {account.provider}
          </p>
          <p className="font-mono text-[12px] text-[#94A3B8] mt-0.5">
            {account.account_id}
          </p>
        </div>
        <Badge
          label={account.status}
          tone={ACCOUNT_STATUS_TONE[account.status]}
          ariaLabel={`${UI_COPY.PORTFOLIO.ACCOUNT_STATUS_LABEL}: ${account.status}`}
        />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-0.5">
            {UI_COPY.PORTFOLIO.ACCOUNT_COST_BASIS_LABEL}
          </p>
          <p className="text-sm font-medium text-[#0F172A] tabular-nums">
            {formatINR(account.cost_basis)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-0.5">
            {UI_COPY.PORTFOLIO.ACCOUNT_MARKET_VALUE_LABEL}
          </p>
          <p className="text-sm font-medium text-[#0F172A] tabular-nums">
            {formatINR(account.market_value)}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-0.5">
            {UI_COPY.PORTFOLIO.ACCOUNT_PL_LABEL}
          </p>
          <p className={`text-sm font-medium tabular-nums ${plColor}`}>
            {formatSignedINR(account.unrealised_gain_loss)}
            <span className="ml-1.5 text-xs">
              ({formatPercent(account.unrealised_gain_loss_pct, true)})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

interface AccountSummaryCardsProps {
  accounts: AccountAllocation[];
}

export function AccountSummaryCards({ accounts }: AccountSummaryCardsProps) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        title={UI_COPY.PORTFOLIO.EMPTY_TITLE}
        message={UI_COPY.PORTFOLIO.EMPTY_MESSAGE}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {accounts.map((account) => (
        <AccountCard key={account.account_id} account={account} />
      ))}
    </div>
  );
}
