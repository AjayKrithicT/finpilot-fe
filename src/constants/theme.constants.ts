/**
 * theme.constants.ts
 * Chart color palette, badge tone CSS class maps, CSV upload rules,
 * and sessionStorage key names.
 * Mirrors semantic color decisions from docs/design_tokens.md.
 */

import {
  AssetClass,
  KycStatus,
  CustomerSegment,
  AccountStatus,
  TransactionType,
  TransactionStatus,
  GoalType,
  PriorityLevel,
  UserRole,
} from './domain.constants';

// ── Badge Tone Type ───────────────────────────────────────────────────────────

export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

// ── Badge Tone → Tailwind class strings ──────────────────────────────────────

export const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  success:
    'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
  danger:
    'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
  warning:
    'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
  info:
    'bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]',
  neutral:
    'bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]',
};

// ── KYC Status → Badge Tone ───────────────────────────────────────────────────

export const KYC_STATUS_TONE: Record<KycStatus, BadgeTone> = {
  [KycStatus.VERIFIED]: 'success',
  [KycStatus.PENDING]: 'warning',
  [KycStatus.REVIEW]: 'warning',
};

// ── Customer Segment → Badge Tone ─────────────────────────────────────────────

export const SEGMENT_TONE: Record<CustomerSegment, BadgeTone> = {
  [CustomerSegment.HNI]: 'info',
  [CustomerSegment.AFFLUENT]: 'info',
  [CustomerSegment.MASS]: 'neutral',
};

// ── Account Status → Badge Tone ───────────────────────────────────────────────

export const ACCOUNT_STATUS_TONE: Record<AccountStatus, BadgeTone> = {
  [AccountStatus.ACTIVE]: 'success',
  [AccountStatus.DORMANT]: 'warning',
  [AccountStatus.CLOSED]: 'neutral',
};

// ── Transaction Type → Badge Tone ─────────────────────────────────────────────

export const TRANSACTION_TYPE_TONE: Record<TransactionType, BadgeTone> = {
  [TransactionType.BUY]: 'success',
  [TransactionType.SELL]: 'danger',
  [TransactionType.DIVIDEND]: 'info',
  [TransactionType.FEE]: 'neutral',
};

// ── Transaction Status → Badge Tone ───────────────────────────────────────────

export const TRANSACTION_STATUS_TONE: Record<TransactionStatus, BadgeTone> = {
  [TransactionStatus.SETTLED]: 'success',
  [TransactionStatus.PENDING]: 'warning',
  [TransactionStatus.REVERSED]: 'danger',
};

// ── Goal Type → Badge Tone ────────────────────────────────────────────────────

export const GOAL_TYPE_TONE: Record<GoalType, BadgeTone> = {
  [GoalType.WEALTH_CREATION]: 'info',
  [GoalType.EMERGENCY_FUND]: 'warning',
  [GoalType.EDUCATION]: 'info',
  [GoalType.HOME_PURCHASE]: 'neutral',
  [GoalType.RETIREMENT]: 'neutral',
  [GoalType.TRAVEL]: 'info',
};

// ── Priority Level → Badge Tone ───────────────────────────────────────────────

export const PRIORITY_TONE: Record<PriorityLevel, BadgeTone> = {
  [PriorityLevel.HIGH]: 'danger',
  [PriorityLevel.MEDIUM]: 'warning',
  [PriorityLevel.LOW]: 'neutral',
};

// ── User Role → Badge Tone ────────────────────────────────────────────────────

export const USER_ROLE_TONE: Record<UserRole, BadgeTone> = {
  [UserRole.ADMIN]: 'info',
  [UserRole.VIEWER]: 'neutral',
};

// ── Data Visualization: Asset Class Colors (Recharts) ────────────────────────

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  [AssetClass.EQUITY]: '#2563EB',
  [AssetClass.ETF]: '#0D9488',
  [AssetClass.MUTUAL_FUND]: '#7C3AED',
  [AssetClass.BOND]: '#D97706',
  [AssetClass.REIT]: '#DB2777',
  [AssetClass.GSEC]: '#475569',
};

// ── CSV Upload Rules ──────────────────────────────────────────────────────────

export const CSV_UPLOAD_RULES = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_SIZE_LABEL: '5 MB',
  ACCEPTED_MIME: 'text/csv',
  ACCEPTED_EXTENSION: '.csv',
  REQUIRED_COLUMNS: [
    'transaction_id',
    'account_id',
    'instrument_id',
    'transaction_type',
    'trade_date',
    'quantity',
    'price',
    'amount',
    'status',
  ] as const,
} as const;

// ── sessionStorage Keys ───────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  TOKEN: 'finpilot_access_token',
  USER: 'finpilot_auth_user',
} as const;
