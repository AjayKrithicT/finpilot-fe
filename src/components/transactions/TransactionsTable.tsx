/**
 * TransactionsTable.tsx
 * Server-sorted and paginated transaction ledger table.
 * Sortable columns: trade_date, amount, transaction_type, status.
 */

import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import {
  SortDirection,
  TransactionStatus,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
} from '../../constants/domain.constants';
import {
  TRANSACTION_TYPE_TONE,
  TRANSACTION_STATUS_TONE,
} from '../../constants/theme.constants';
import { formatINR, formatDate, formatQuantity } from '../../utils/formatters';
import { Badge } from '../reusables/Badge';
import { Pagination } from '../reusables/Pagination';
import { EmptyState } from '../reusables/EmptyState';
import type { TransactionItem, TransactionFilters } from '../../types/transaction.types';
import type { PaginationMeta } from '../../types/common.types';

type SortableCol = NonNullable<TransactionFilters['sort_by']>;

interface TransactionsTableProps {
  transactions: TransactionItem[];
  pagination: PaginationMeta;
  sortBy: SortableCol | undefined;
  sortDir: SortDirection | undefined;
  onSort: (col: SortableCol) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TH_BASE = 'px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#64748B] whitespace-nowrap';
const TD = 'px-4 py-3 text-sm align-middle';

function SortIcon({ col, sortBy, sortDir }: {
  col: SortableCol;
  sortBy: SortableCol | undefined;
  sortDir: SortDirection | undefined;
}) {
  if (sortBy !== col) {
    return <ChevronUpIcon className="w-3 h-3 text-[#CBD5E1] ml-1 inline" aria-hidden="true" />;
  }
  return sortDir === SortDirection.ASC
    ? <ChevronUpIcon className="w-3 h-3 text-[#2563EB] ml-1 inline" aria-hidden="true" />
    : <ChevronDownIcon className="w-3 h-3 text-[#2563EB] ml-1 inline" aria-hidden="true" />;
}

export function TransactionsTable({
  transactions,
  pagination,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onLimitChange,
}: TransactionsTableProps) {
  const sortableHeader = (col: SortableCol, label: string, align: 'left' | 'right' = 'left') => (
    <th
      scope="col"
      className={`${TH_BASE} text-${align} cursor-pointer hover:text-[#0F172A] select-none`}
      onClick={() => onSort(col)}
      aria-label={UI_COPY.ARIA.SORT_COLUMN(label)}
    >
      {label}
      <SortIcon col={col} sortBy={sortBy} sortDir={sortDir} />
    </th>
  );

  if (transactions.length === 0) {
    return (
      <EmptyState
        title={UI_COPY.TRANSACTIONS.EMPTY_TITLE}
        message={UI_COPY.TRANSACTIONS.EMPTY_MESSAGE}
      />
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead className="bg-[#F1F5F9]">
            <tr>
              <th className={`${TH_BASE} text-left`} scope="col">
                {UI_COPY.TRANSACTIONS.TABLE_COL_ID}
              </th>
              {sortableHeader('trade_date', UI_COPY.TRANSACTIONS.TABLE_COL_DATE)}
              <th className={`${TH_BASE} text-left`} scope="col">
                {UI_COPY.TRANSACTIONS.TABLE_COL_ACCOUNT}
              </th>
              <th className={`${TH_BASE} text-left`} scope="col">
                {UI_COPY.TRANSACTIONS.TABLE_COL_INSTRUMENT}
              </th>
              {sortableHeader('transaction_type', UI_COPY.TRANSACTIONS.TABLE_COL_TYPE)}
              <th className={`${TH_BASE} text-right`} scope="col">
                {UI_COPY.TRANSACTIONS.TABLE_COL_QTY}
              </th>
              <th className={`${TH_BASE} text-right`} scope="col">
                {UI_COPY.TRANSACTIONS.TABLE_COL_PRICE}
              </th>
              {sortableHeader('amount', UI_COPY.TRANSACTIONS.TABLE_COL_AMOUNT, 'right')}
              {sortableHeader('status', UI_COPY.TRANSACTIONS.TABLE_COL_STATUS)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {transactions.map((t) => {
              const isReversed = t.status === TransactionStatus.REVERSED;
              const isPending = t.status === TransactionStatus.PENDING;
              const rowClass = isReversed
                ? 'bg-[#FFF7F7] opacity-60 hover:opacity-80 transition-opacity'
                : isPending
                  ? 'bg-[#FFFBEB] hover:bg-[#FFF8E1] transition-colors'
                  : 'hover:bg-[#F8FAFC] transition-colors';
              return (
                <tr
                  key={t.transaction_id}
                  className={rowClass}
                  aria-label={
                    isReversed
                      ? `Reversed transaction ${t.transaction_id}`
                      : isPending
                        ? `Pending transaction ${t.transaction_id}`
                        : undefined
                  }
                >
                <td className={TD}>
                  <span className="font-mono text-[12px] text-[#64748B]">
                    {t.transaction_id}
                  </span>
                </td>
                <td className={`${TD} tabular-nums text-[#475569]`}>
                  {formatDate(t.trade_date)}
                </td>
                <td className={TD}>
                  <span className="font-mono text-[12px] text-[#64748B]">
                    {t.account_id}
                  </span>
                </td>
                <td className={TD}>
                  <span className="font-mono text-[13px] font-medium text-[#0F172A]">
                    {t.symbol}
                  </span>
                  <span className="block text-xs text-[#64748B] truncate max-w-[140px]">
                    {t.instrument_name}
                  </span>
                </td>
                <td className={TD}>
                  <Badge
                    label={TRANSACTION_TYPE_LABELS[t.transaction_type]}
                    tone={TRANSACTION_TYPE_TONE[t.transaction_type]}
                  />
                </td>
                <td className={`${TD} text-right tabular-nums text-[#475569]`}>
                  {formatQuantity(t.quantity)}
                </td>
                <td className={`${TD} text-right tabular-nums text-[#475569]`}>
                  {formatINR(t.price)}
                </td>
                <td className={`${TD} text-right tabular-nums font-medium text-[#0F172A]`}>
                  {formatINR(t.amount)}
                </td>
                <td className={TD}>
                  <Badge
                    label={TRANSACTION_STATUS_LABELS[t.status]}
                    tone={TRANSACTION_STATUS_TONE[t.status]}
                  />
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        meta={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
