/**
 * GoalCard.tsx
 * Displays goal progress bar (clamped 0–100, role="progressbar"),
 * exact funded_percentage, Overdue and Overfunded badges, and Edit button.
 */

import { CalendarIcon, PencilIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import {
  GOAL_TYPE_LABELS,
  PRIORITY_LABELS,
} from '../../constants/domain.constants';
import {
  GOAL_TYPE_TONE,
  PRIORITY_TONE,
} from '../../constants/theme.constants';
import { formatINR, formatDate, formatPercent } from '../../utils/formatters';
import { Badge } from '../reusables/Badge';
import type { GoalItem } from '../../types/goal.types';

interface GoalCardProps {
  goal: GoalItem;
  onEdit: (goal: GoalItem) => void;
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  // Progress bar fill: clamped to 0–100 regardless of overfunding
  const clampedPct = Math.min(100, Math.max(0, goal.funded_percentage));

  const progressColor = goal.is_overdue
    ? 'bg-[#FECACA]'
    : goal.is_overfunded
      ? 'bg-[#FDE68A]'
      : 'bg-[#2563EB]';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-5
      hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-150 flex flex-col gap-4">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-[#0F172A] truncate">
              {goal.goal_name}
            </h3>
            {goal.is_overdue && (
              <Badge label={UI_COPY.GOALS.BADGE_OVERDUE} tone="danger" />
            )}
            {goal.is_overfunded && (
              <Badge label={UI_COPY.GOALS.BADGE_OVERFUNDED} tone="warning" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              label={GOAL_TYPE_LABELS[goal.goal_type]}
              tone={GOAL_TYPE_TONE[goal.goal_type]}
              ariaLabel={`Goal type: ${GOAL_TYPE_LABELS[goal.goal_type]}`}
            />
            <Badge
              label={PRIORITY_LABELS[goal.priority]}
              tone={PRIORITY_TONE[goal.priority]}
              ariaLabel={`Priority: ${PRIORITY_LABELS[goal.priority]}`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onEdit(goal)}
          aria-label={UI_COPY.ARIA.EDIT_GOAL(goal.goal_name)}
          className="shrink-0 flex items-center gap-1 text-xs font-medium text-[#475569]
            hover:text-[#0F172A] rounded px-2 py-1 hover:bg-[#F1F5F9] transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
            focus-visible:ring-offset-2"
        >
          <PencilIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {UI_COPY.GOALS.EDIT_GOAL}
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>{UI_COPY.GOALS.FUNDED_LABEL}</span>
          {/* Show exact percentage, even above 100% */}
          <span className="font-medium text-[#0F172A] tabular-nums">
            {formatPercent(goal.funded_percentage)}
          </span>
        </div>
        <div
          className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={clampedPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={UI_COPY.ARIA.GOAL_PROGRESS(goal.goal_name)}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${clampedPct}%` }}
          />
        </div>
      </div>

      {/* Amounts + target date */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-0.5">
            {UI_COPY.GOALS.FUNDED_LABEL}
          </p>
          <p className="font-medium text-[#0F172A] tabular-nums">
            {formatINR(goal.current_funded_amount)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-0.5">
            {UI_COPY.GOALS.TARGET_LABEL}
          </p>
          <p className="font-medium text-[#0F172A] tabular-nums">
            {formatINR(goal.target_amount)}
          </p>
        </div>
        <div className="col-span-2">
          <p className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="font-medium">{UI_COPY.GOALS.TARGET_DATE_LABEL}:</span>
            <span className="tabular-nums">{formatDate(goal.target_date)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
