/**
 * AssetAllocationChart.tsx
 * Recharts responsive Donut chart for asset-class allocation.
 * Uses ASSET_CLASS_COLORS palette + interactive tooltip + legend breakdown.
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { UI_COPY } from '../../constants/ui.constants';
import { ASSET_CLASS_COLORS } from '../../constants/theme.constants';
import { ASSET_CLASS_LABELS } from '../../constants/domain.constants';
import { formatINR, formatPercent } from '../../utils/formatters';
import { EmptyState } from '../reusables/EmptyState';
import type { AssetClassAllocation } from '../../types/portfolio.types';
import type { AssetClass } from '../../constants/domain.constants';

interface TooltipPayloadEntry {
  name: string;
  value: number;
  payload: AssetClassAllocation;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-[#0F172A]">{entry.name}</p>
      <p className="text-[#475569] tabular-nums">{formatINR(entry.value)}</p>
      <p className="text-[#64748B] tabular-nums">
        {formatPercent(entry.payload.allocation_pct)}
      </p>
    </div>
  );
}

interface AssetAllocationChartProps {
  allocations: AssetClassAllocation[];
}

export function AssetAllocationChart({ allocations }: AssetAllocationChartProps) {
  if (allocations.length === 0) {
    return (
      <EmptyState
        title={UI_COPY.PORTFOLIO.EMPTY_TITLE}
        message={UI_COPY.PORTFOLIO.EMPTY_MESSAGE}
      />
    );
  }

  const data = allocations.map((a) => ({
    ...a,
    name: ASSET_CLASS_LABELS[a.asset_class],
    value: a.market_value,
    color: ASSET_CLASS_COLORS[a.asset_class as AssetClass] ?? '#94A3B8',
  }));

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      {/* Donut */}
      <div className="w-full lg:w-56 h-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="value"
              aria-label={UI_COPY.PORTFOLIO.ALLOCATION_CHART_TITLE}
            >
              {data.map((entry) => (
                <Cell key={entry.asset_class} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — two equal columns, each item is a tight flex row centered in its cell */}
      <div className="flex-1 w-full grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((entry) => (
          <div key={entry.asset_class} className="flex items-center justify-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-[#475569] whitespace-nowrap">{entry.name}</span>
            <span className="text-sm font-medium text-[#0F172A] tabular-nums whitespace-nowrap">
              {formatPercent(entry.allocation_pct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
