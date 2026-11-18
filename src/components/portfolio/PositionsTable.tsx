/**
 * PositionsTable.tsx
 * Filterable holdings positions table with client-side symbol search
 * and asset-class filter. All numeric columns are tabular-nums + right-aligned.
 */

import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { AssetClass, ASSET_CLASS_LABELS } from '../../constants/domain.constants';
import { formatINR, formatSignedINR, formatPercent, formatQuantity } from '../../utils/formatters';
import { EmptyState } from '../reusables/EmptyState';
import type { PortfolioPosition } from '../../types/portfolio.types';

interface PositionsTableProps {
  positions: PortfolioPosition[];
}

const TH = 'px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#64748B] whitespace-nowrap';
const TD = 'px-3 py-3 text-sm align-middle';

export function PositionsTable({ positions }: PositionsTableProps) {
  const [search, setSearch] = useState('');
  const [assetClass, setAssetClass] = useState<AssetClass | ''>('');

  const filtered = positions.filter((p) => {
    const matchSearch =
      !search ||
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.instrument_name.toLowerCase().includes(search.toLowerCase());
    const matchClass = !assetClass || p.asset_class === assetClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={UI_COPY.PORTFOLIO.POSITIONS_SEARCH_PLACEHOLDER}
            aria-label={UI_COPY.ARIA.SEARCH_POSITIONS}
            className="w-full h-10 rounded-lg border border-[#E2E8F0] bg-white
              pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          />
        </div>
        <select
          value={assetClass}
          onChange={(e) => setAssetClass(e.target.value as AssetClass | '')}
          aria-label={UI_COPY.ARIA.FILTER_ASSET_CLASS}
          className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3
            text-sm text-[#0F172A] min-w-[160px]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <option value="">{UI_COPY.PORTFOLIO.POSITIONS_FILTER_ASSET_CLASS}</option>
          {Object.values(AssetClass).map((ac) => (
            <option key={ac} value={ac}>{ASSET_CLASS_LABELS[ac]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title={UI_COPY.PORTFOLIO.EMPTY_TITLE}
          message={UI_COPY.PORTFOLIO.EMPTY_MESSAGE}
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" role="table">
              <thead className="bg-[#F1F5F9]">
                <tr>
                  <th className={`${TH} text-left`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_SYMBOL}</th>
                  <th className={`${TH} text-left`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_INSTRUMENT}</th>
                  <th className={`${TH} text-left`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_ASSET_CLASS}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_QUANTITY}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_AVG_COST}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_LAST_PRICE}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_COST_BASIS}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_MARKET_VALUE}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_UNREALISED_GL}</th>
                  <th className={`${TH} text-right`} scope="col">{UI_COPY.PORTFOLIO.TABLE_COL_UNREALISED_PCT}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map((p) => {
                  const glPositive = p.unrealised_gain_loss > 0;
                  const glNegative = p.unrealised_gain_loss < 0;
                  const glColor = glPositive
                    ? 'text-[#047857]'
                    : glNegative
                      ? 'text-[#B91C1C]'
                      : 'text-[#475569]';
                  return (
                    <tr key={p.position_id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className={TD}>
                        <span className="font-mono text-[13px] font-medium text-[#0F172A]">
                          {p.symbol}
                        </span>
                      </td>
                      <td className={`${TD} text-[#475569] max-w-[180px]`}>
                        <span className="truncate block">{p.instrument_name}</span>
                      </td>
                      <td className={`${TD} text-[#475569]`}>
                        {ASSET_CLASS_LABELS[p.asset_class]}
                      </td>
                      <td className={`${TD} text-right tabular-nums text-[#0F172A]`}>
                        {formatQuantity(p.quantity)}
                      </td>
                      <td className={`${TD} text-right tabular-nums text-[#475569]`}>
                        {formatINR(p.avg_cost)}
                      </td>
                      <td className={`${TD} text-right tabular-nums text-[#475569]`}>
                        {formatINR(p.last_price)}
                      </td>
                      <td className={`${TD} text-right tabular-nums text-[#0F172A]`}>
                        {formatINR(p.cost_basis)}
                      </td>
                      <td className={`${TD} text-right tabular-nums font-medium text-[#0F172A]`}>
                        {formatINR(p.market_value)}
                      </td>
                      <td className={`${TD} text-right tabular-nums font-medium ${glColor}`}>
                        {formatSignedINR(p.unrealised_gain_loss)}
                      </td>
                      <td className={`${TD} text-right tabular-nums font-medium ${glColor}`}>
                        {formatPercent(p.unrealised_gain_loss_pct, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
