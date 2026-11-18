/**
 * CustomerTable.tsx
 * Paginated customer directory table.
 * Columns: customer_id, full_name, email, city+state, kyc_status,
 * segment, total_market_value, Open Workspace action.
 */

import { useNavigate } from 'react-router-dom';
import { ExternalLinkIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { APP_ROUTES } from '../../constants/routes.constants';
import { KYC_STATUS_LABELS } from '../../constants/domain.constants';
import {
  KYC_STATUS_TONE,
  SEGMENT_TONE,
} from '../../constants/theme.constants';
import { formatINR } from '../../utils/formatters';
import { Badge } from '../reusables/Badge';
import { Pagination } from '../reusables/Pagination';
import { EmptyState } from '../reusables/EmptyState';
import type { CustomerSummary } from '../../types/customer.types';
import type { PaginationMeta } from '../../types/common.types';

interface CustomerTableProps {
  customers: CustomerSummary[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TH = 'px-4 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#64748B] whitespace-nowrap';
const TD = 'px-4 py-3 text-sm text-[#0F172A] align-middle';

export function CustomerTable({
  customers,
  pagination,
  onPageChange,
  onLimitChange,
}: CustomerTableProps) {
  const navigate = useNavigate();

  if (customers.length === 0) {
    return (
      <EmptyState
        title={UI_COPY.CUSTOMERS.EMPTY_TITLE}
        message={UI_COPY.CUSTOMERS.EMPTY_MESSAGE}
      />
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead className="bg-[#F1F5F9]">
            <tr>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_ID}</th>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_NAME}</th>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_EMAIL}</th>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_LOCATION}</th>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_KYC}</th>
              <th className={TH} scope="col">{UI_COPY.CUSTOMERS.TABLE_COL_SEGMENT}</th>
              <th className={`${TH} text-right`} scope="col">
                {UI_COPY.CUSTOMERS.TABLE_COL_MARKET_VALUE}
              </th>
              <th className={TH} scope="col">
                <span className="sr-only">{UI_COPY.CUSTOMERS.TABLE_COL_ACTIONS}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {customers.map((c) => (
              <tr
                key={c.customer_id}
                onClick={() => navigate(APP_ROUTES.CUSTOMER_WORKSPACE(c.customer_id))}
                className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
              >
                <td className={TD}>
                  <span className="font-mono text-[13px] font-medium text-[#475569]">
                    {c.customer_id}
                  </span>
                </td>
                <td className={TD}>
                  <span className="font-medium text-[#0F172A]">{c.full_name}</span>
                </td>
                <td className={`${TD} text-[#475569]`}>{c.email}</td>
                <td className={`${TD} text-[#475569]`}>
                  {c.city}, {c.state}
                </td>
                <td className={TD}>
                  <Badge
                    label={KYC_STATUS_LABELS[c.kyc_status]}
                    tone={KYC_STATUS_TONE[c.kyc_status]}
                    ariaLabel={`KYC status: ${KYC_STATUS_LABELS[c.kyc_status]}`}
                  />
                </td>
                <td className={TD}>
                  <Badge
                    label={c.segment}
                    tone={SEGMENT_TONE[c.segment]}
                    ariaLabel={`Segment: ${c.segment}`}
                  />
                </td>
                <td className={`${TD} text-right tabular-nums font-medium`}>
                  {formatINR(c.total_market_value)}
                </td>
                <td className={TD}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(APP_ROUTES.CUSTOMER_WORKSPACE(c.customer_id));
                    }}
                    aria-label={UI_COPY.ARIA.OPEN_WORKSPACE(c.full_name)}
                    className="flex items-center gap-1 text-xs font-medium text-[#2563EB]
                      hover:text-[#1D4ED8] rounded
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    {UI_COPY.CUSTOMERS.OPEN_WORKSPACE}
                  </button>
                </td>
              </tr>
            ))}
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
