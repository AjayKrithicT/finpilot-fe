/**
 * customer.types.ts
 * Customer directory, detail, risk profile, and account summary DTOs.
 */

import type {
  KycStatus,
  CustomerSegment,
  AccountType,
  AccountStatus,
  RiskLevel,
  LiquidityNeed,
} from '../constants/domain.constants';

// ── Customer Directory ────────────────────────────────────────────────────────

export interface CustomerSummary {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  kyc_status: KycStatus;
  segment: CustomerSegment;
  total_market_value: number;
}

export interface CustomerListFilters {
  search?: string;
  city?: string;
  kyc_status?: KycStatus | '';
  segment?: CustomerSegment | '';
  page?: number;
  limit?: number;
}

// ── Risk Profile ──────────────────────────────────────────────────────────────

export interface RiskProfile {
  risk_score: number;
  risk_level: RiskLevel;
  assessed_at: string;
  horizon_years: number;
  liquidity_need: LiquidityNeed;
}

// ── Account (from CustomerDetail) ─────────────────────────────────────────────

export interface AccountSummary {
  account_id: string;
  account_type: AccountType;
  provider: string;
  opened_at: string;
  status: AccountStatus;
  base_currency: string;
}

// ── Customer Detail (workspace) ───────────────────────────────────────────────

export interface CustomerDetail {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  date_of_birth: string;
  onboarded_at: string;
  kyc_status: KycStatus;
  segment: CustomerSegment;
  risk_profile: RiskProfile | null;
  accounts: AccountSummary[];
}
