/**
 * ImportResultPanel.tsx
 * Displays batch reconciliation KPIs and a server-paginated quarantine table.
 */

import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { PAGINATION_DEFAULTS } from '../../constants/domain.constants';
import { fetchImportRejections } from '../../services/import.api';
import { ApiClientError } from '../../services/apiClient';
import { Badge } from '../reusables/Badge';
import { Pagination } from '../reusables/Pagination';
import { TableSkeleton } from '../reusables/Skeleton';
import { ErrorBanner } from '../reusables/ErrorBanner';
import type { ImportBatchResponse, ImportRejectionItem, PaginatedRejections } from '../../types/import.types';
import type { PaginationMeta } from '../../types/common.types';

interface ImportResultPanelProps {
  result: ImportBatchResponse;
}

interface KpiTileProps {
  label: string;
  value: string | number;
  tone?: 'success' | 'danger' | 'neutral';
}

function KpiTile({ label, value, tone = 'neutral' }: KpiTileProps) {
  const valueColor =
    tone === 'success'
      ? 'text-[#047857]'
      : tone === 'danger'
        ? 'text-[#B91C1C]'
        : 'text-[#0F172A]';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
        {label}
      </span>
      <span className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</span>
    </div>
  );
}

const TH = 'px-4 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#64748B] whitespace-nowrap';
const TD = 'px-4 py-3 text-sm align-middle';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: PAGINATION_DEFAULTS.LIMIT,
  total_items: 0,
  total_pages: 1,
};

function QuarantineTable({
  batchId,
  inlineRejections,
  totalRejections,
}: {
  batchId: string;
  inlineRejections: ImportRejectionItem[];
  totalRejections: number;
}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION_DEFAULTS.LIMIT);
  const [result, setResult] = useState<PaginatedRejections | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use inline rejections on page 1; fetch from API when paginating further
  const needsFetch = page > 1 || limit !== PAGINATION_DEFAULTS.LIMIT;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchImportRejections(batchId, page, limit);
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC);
    } finally {
      setIsLoading(false);
    }
  }, [batchId, page, limit]);

  useEffect(() => {
    if (needsFetch) { void load(); }
  }, [needsFetch, load]);

  const handleLimitChange = (value: number) => { setLimit(value); setPage(1); };

  const rows: ImportRejectionItem[] = needsFetch
    ? (result?.data ?? [])
    : inlineRejections;

  const pagination: PaginationMeta = needsFetch
    ? (result?.pagination ?? {
        ...EMPTY_PAGINATION,
        total_items: totalRejections,
        total_pages: Math.ceil(totalRejections / limit) || 1,
      })
    : {
        page: 1,
        limit,
        total_items: totalRejections,
        total_pages: Math.ceil(totalRejections / limit) || 1,
      };

  return (
    <div>
      <h3 className="text-[15px] font-semibold text-[#0F172A] mb-3">
        {UI_COPY.ADMIN_IMPORT.QUARANTINE_TITLE}
      </h3>
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        {error && <ErrorBanner message={error} onRetry={() => void load()} />}

        {isLoading && needsFetch ? (
          <div className="p-4">
            <TableSkeleton rows={limit} cols={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" role="table">
              <thead className="bg-[#F1F5F9]">
                <tr>
                  <th className={TH} scope="col">{UI_COPY.ADMIN_IMPORT.QUARANTINE_COL_ROW}</th>
                  <th className={TH} scope="col">{UI_COPY.ADMIN_IMPORT.QUARANTINE_COL_RECORD}</th>
                  <th className={TH} scope="col">{UI_COPY.ADMIN_IMPORT.QUARANTINE_COL_CODE}</th>
                  <th className={TH} scope="col">{UI_COPY.ADMIN_IMPORT.QUARANTINE_COL_REASON}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {rows.map((r) => (
                  <tr
                    key={`${r.row_number}-${r.record_identifier}`}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className={`${TD} tabular-nums text-[#64748B]`}>{r.row_number}</td>
                    <td className={TD}>
                      <span className="font-mono text-[13px] text-[#0F172A]">
                        {r.record_identifier}
                      </span>
                    </td>
                    <td className={TD}>
                      <Badge label={r.error_code} tone="danger" />
                    </td>
                    <td className={`${TD} text-[#475569]`}>{r.error_reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          meta={pagination}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}

export function ImportResultPanel({ result }: ImportResultPanelProps) {
  return (
    <div className="space-y-6">
      {/* Batch header */}
      <div className="flex items-center gap-2">
        {result.rejected_rows === 0
          ? <CheckCircleIcon className="w-5 h-5 text-[#047857]" aria-hidden="true" />
          : <XCircleIcon className="w-5 h-5 text-[#B91C1C]" aria-hidden="true" />}
        <h2 className="text-[18px] font-semibold text-[#0F172A]">
          {UI_COPY.ADMIN_IMPORT.RESULT_TITLE}
        </h2>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiTile label={UI_COPY.ADMIN_IMPORT.RESULT_BATCH_ID} value={result.batch_id} />
        <KpiTile label={UI_COPY.ADMIN_IMPORT.RESULT_FILE_NAME} value={result.file_name} />
        <KpiTile label={UI_COPY.ADMIN_IMPORT.RESULT_TOTAL_ROWS} value={result.total_rows} />
        <KpiTile
          label={UI_COPY.ADMIN_IMPORT.RESULT_IMPORTED}
          value={result.imported_rows}
          tone="success"
        />
        <KpiTile
          label={UI_COPY.ADMIN_IMPORT.RESULT_REJECTED}
          value={result.rejected_rows}
          tone={result.rejected_rows > 0 ? 'danger' : 'neutral'}
        />
      </div>

      {/* Quarantine table — only shown when there are rejections */}
      {result.rejected_rows === 0 ? (
        <p className="text-sm text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0]
          rounded-xl px-4 py-3">
          {UI_COPY.ADMIN_IMPORT.EMPTY_REJECTIONS}
        </p>
      ) : (
        <QuarantineTable
          batchId={result.batch_id}
          inlineRejections={result.rejections}
          totalRejections={result.rejected_rows}
        />
      )}
    </div>
  );
}
