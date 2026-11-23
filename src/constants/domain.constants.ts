/**
 * domain.constants.ts
 * All domain TypeScript enums, label maps, sort keys, and pagination defaults.
 * Never duplicate these in component logic or API services.
 */

// ── Auth & Roles ─────────────────────────────────────────────────────────────

export enum UserRole {
  VIEWER = 'VIEWER',
  ADMIN = 'ADMIN',
}

// ── Customer ──────────────────────────────────────────────────────────────────

export enum KycStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
}

export enum CustomerSegment {
  MASS = 'Mass',
  AFFLUENT = 'Affluent',
  HNI = 'HNI',
}

// ── Account ───────────────────────────────────────────────────────────────────

export enum AccountType {
  BROKERAGE = 'BROKERAGE',
  MUTUAL_FUND = 'MUTUAL_FUND',
  RETIREMENT = 'RETIREMENT',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  DORMANT = 'DORMANT',
  CLOSED = 'CLOSED',
}

// ── Asset & Instrument ───────────────────────────────────────────────────────

export enum AssetClass {
  EQUITY = 'EQUITY',
  ETF = 'ETF',
  MUTUAL_FUND = 'MUTUAL_FUND',
  BOND = 'BOND',
  REIT = 'REIT',
  GSEC = 'GSEC',
}

// ── Transactions ─────────────────────────────────────────────────────────────

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  FEE = 'FEE',
}

export enum TransactionStatus {
  SETTLED = 'SETTLED',
  PENDING = 'PENDING',
  REVERSED = 'REVERSED',
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export enum GoalType {
  WEALTH_CREATION = 'WEALTH_CREATION',
  EMERGENCY_FUND = 'EMERGENCY_FUND',
  EDUCATION = 'EDUCATION',
  HOME_PURCHASE = 'HOME_PURCHASE',
  RETIREMENT = 'RETIREMENT',
  TRAVEL = 'TRAVEL',
}

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// ── Risk Profile ─────────────────────────────────────────────────────────────

export enum RiskLevel {
  CONSERVATIVE = 'Conservative',
  MODERATE = 'Moderate',
  GROWTH = 'Growth',
  AGGRESSIVE = 'Aggressive',
}

export enum LiquidityNeed {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// ── Sorting ───────────────────────────────────────────────────────────────────

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// ── Pagination Defaults ───────────────────────────────────────────────────────

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50],
} as const;

// ── Human-Readable Label Maps ─────────────────────────────────────────────────

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  [KycStatus.VERIFIED]: 'Verified',
  [KycStatus.PENDING]: 'Pending',
  [KycStatus.REVIEW]: 'Review',
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.BROKERAGE]: 'Brokerage',
  [AccountType.MUTUAL_FUND]: 'Mutual Fund',
  [AccountType.RETIREMENT]: 'Retirement',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.BUY]: 'Buy',
  [TransactionType.SELL]: 'Sell',
  [TransactionType.DIVIDEND]: 'Dividend',
  [TransactionType.FEE]: 'Fee',
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.SETTLED]: 'Settled',
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.REVERSED]: 'Reversed',
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  [GoalType.WEALTH_CREATION]: 'Wealth Creation',
  [GoalType.EMERGENCY_FUND]: 'Emergency Fund',
  [GoalType.EDUCATION]: 'Education',
  [GoalType.HOME_PURCHASE]: 'Home Purchase',
  [GoalType.RETIREMENT]: 'Retirement',
  [GoalType.TRAVEL]: 'Travel',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  [PriorityLevel.LOW]: 'Low',
  [PriorityLevel.MEDIUM]: 'Medium',
  [PriorityLevel.HIGH]: 'High',
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  [AssetClass.EQUITY]: 'Equity',
  [AssetClass.ETF]: 'ETF',
  [AssetClass.MUTUAL_FUND]: 'Mutual Fund',
  [AssetClass.BOND]: 'Bond',
  [AssetClass.REIT]: 'REIT',
  [AssetClass.GSEC]: 'G-Sec',
};
