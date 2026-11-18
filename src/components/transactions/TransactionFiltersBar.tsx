/**
 * TransactionFiltersBar.tsx
 * Server-side filter controls for the transaction ledger.
 * Account, Instrument, Type, Status, Date range, Reset.
 * Any change fires onChange; parent resets page to 1.
 */

import { UI_COPY } from '../../constants/ui.constants';
import {
  TransactionType,
  TransactionStatus,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
} from '../../constants/domain.constants';
import { Button } from '../reusables/Button';
import type { TransactionFilters } from '../../types/transaction.types';
import type { AccountSummary } from '../../types/customer.types';
import type { InstrumentOption } from '../../types/transaction.types';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  accounts: AccountSummary[];
  instruments: InstrumentOption[];
  onChange: (updated: Partial<TransactionFilters>) => void;
  onReset: () => void;
}

const SELECT_CLS = `h-10 rounded-lg border border-[#E2E8F0] bg-white px-3
  text-sm text-[#0F172A]
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[#2563EB] focus-visible:ring-offset-2`;

const LABEL_CLS = 'text-xs font-medium text-[#475569] mb-1 block';

export function TransactionFiltersBar({
  filters,
  accounts,
  instruments,
  onChange,
  onReset,
}: TransactionFiltersBarProps) {
  const hasActive =
    !!filters.account_id ||
    !!filters.instrument_id ||
    !!filters.transaction_type ||
    !!filters.status ||
    !!filters.from_date ||
    !!filters.to_date;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Account */}
        <div className="flex flex-col min-w-[160px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-account">
            {UI_COPY.TRANSACTIONS.FILTER_ACCOUNT_LABEL}
          </label>
          <select
            id="txn-filter-account"
            value={filters.account_id ?? ''}
            onChange={(e) => onChange({ account_id: e.target.value || undefined })}
            aria-label={UI_COPY.ARIA.FILTER_ACCOUNT}
            className={SELECT_CLS}
          >
            <option value="">{UI_COPY.TRANSACTIONS.FILTER_ACCOUNT_ALL}</option>
            {accounts.map((a) => (
              <option key={a.account_id} value={a.account_id}>
                {a.account_id} — {a.account_type}
              </option>
            ))}
          </select>
        </div>

        {/* Instrument */}
        <div className="flex flex-col min-w-[180px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-instrument">
            {UI_COPY.TRANSACTIONS.FILTER_INSTRUMENT_LABEL}
          </label>
          <select
            id="txn-filter-instrument"
            value={filters.instrument_id ?? ''}
            onChange={(e) => onChange({ instrument_id: e.target.value || undefined })}
            aria-label={UI_COPY.ARIA.FILTER_INSTRUMENT}
            className={SELECT_CLS}
            size={1}
          >
            <option value="">{UI_COPY.TRANSACTIONS.FILTER_INSTRUMENT_ALL}</option>
            {instruments.map((i) => (
              <option key={i.instrument_id} value={i.instrument_id}>
                {i.symbol} — {i.instrument_name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col min-w-[130px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-type">
            {UI_COPY.TRANSACTIONS.FILTER_TYPE_LABEL}
          </label>
          <select
            id="txn-filter-type"
            value={filters.transaction_type ?? ''}
            onChange={(e) =>
              onChange({ transaction_type: (e.target.value as TransactionType) || undefined })
            }
            aria-label={UI_COPY.ARIA.FILTER_TYPE}
            className={SELECT_CLS}
          >
            <option value="">{UI_COPY.TRANSACTIONS.FILTER_TYPE_ALL}</option>
            {Object.values(TransactionType).map((t) => (
              <option key={t} value={t}>{TRANSACTION_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col min-w-[130px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-status">
            {UI_COPY.TRANSACTIONS.FILTER_STATUS_LABEL}
          </label>
          <select
            id="txn-filter-status"
            value={filters.status ?? ''}
            onChange={(e) =>
              onChange({ status: (e.target.value as TransactionStatus) || undefined })
            }
            aria-label={UI_COPY.ARIA.FILTER_STATUS}
            className={SELECT_CLS}
          >
            <option value="">{UI_COPY.TRANSACTIONS.FILTER_STATUS_ALL}</option>
            {Object.values(TransactionStatus).map((s) => (
              <option key={s} value={s}>{TRANSACTION_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* From date */}
        <div className="flex flex-col min-w-[140px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-from">
            {UI_COPY.TRANSACTIONS.FILTER_FROM_DATE_LABEL}
          </label>
          <input
            id="txn-filter-from"
            type="date"
            value={filters.from_date ?? ''}
            onChange={(e) => onChange({ from_date: e.target.value || undefined })}
            aria-label={UI_COPY.ARIA.DATE_FROM}
            className={`${SELECT_CLS} min-w-[140px]`}
          />
        </div>

        {/* To date */}
        <div className="flex flex-col min-w-[140px]">
          <label className={LABEL_CLS} htmlFor="txn-filter-to">
            {UI_COPY.TRANSACTIONS.FILTER_TO_DATE_LABEL}
          </label>
          <input
            id="txn-filter-to"
            type="date"
            value={filters.to_date ?? ''}
            onChange={(e) => onChange({ to_date: e.target.value || undefined })}
            aria-label={UI_COPY.ARIA.DATE_TO}
            className={`${SELECT_CLS} min-w-[140px]`}
          />
        </div>

        {/* Reset */}
        {hasActive && (
          <div className="flex flex-col justify-end">
            <Button variant="ghost" onClick={onReset} className="h-10 self-end">
              {UI_COPY.TRANSACTIONS.RESET_FILTERS}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
