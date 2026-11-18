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
  kyc_status?: KycStatus | '';
  segment?: CustomerSegment | '';
  page?: number;
  limit?: number;
}

// ── Risk Profile ──────────────────────────────────────────────────────────────

export interface RiskProfile {
  risk_level: RiskLevel;
  risk_score: number;
  horizon_years: number;
  liquidity_need: LiquidityNeed;
}

// ── Account Summary ───────────────────────────────────────────────────────────

export interface AccountSummary {
  account_id: string;
  account_type: AccountType;
  provider: string;
  status: AccountStatus;
  cost_basis: number;
  market_value: number;
  unrealised_gain_loss: number;
  unrealised_gain_loss_pct: number;
}

// ── Customer Detail (workspace) ───────────────────────────────────────────────

export interface CustomerDetail {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  kyc_status: KycStatus;
  segment: CustomerSegment;
  risk_profile: RiskProfile;
  accounts: AccountSummary[];
}
