/**
 * Badge.tsx
 * Semantic status/role/KYC/segment pill with configurable tone and aria-label.
 */

import type { BadgeTone } from '../../types/common.types';
import { BADGE_TONE_CLASSES } from '../../constants/theme.constants';

interface BadgeProps {
  label: string;
  tone: BadgeTone;
  ariaLabel?: string;
  className?: string;
}

export function Badge({ label, tone, ariaLabel, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium leading-4 whitespace-nowrap ${BADGE_TONE_CLASSES[tone]} ${className}`}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </span>
  );
}
