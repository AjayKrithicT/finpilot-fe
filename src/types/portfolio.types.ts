/**
 * portfolio.types.ts
 * Consolidated portfolio valuation, account allocations, asset-class
 * chart slices, and individual holdings position DTOs.
 */

import type { AccountType, AccountStatus, AssetClass } from '../constants/domain.constants';

// ── Portfolio Totals (KPI cards) ──────────────────────────────────────────────

export interface PortfolioTotals {
  total_market_value: number;
  total_cost_basis: number;
  total_unrealised_gain_loss: number;
  total_unrealised_gain_loss_pct: number;
  active_accounts_count: number;
}

// ── Per-Account Allocation ────────────────────────────────────────────────────

export interface AccountAllocation {
  account_id: string;
  account_type: AccountType;
  provider: string;
  status: AccountStatus;
  cost_basis: number;
  market_value: number;
  unrealised_gain_loss: number;
  unrealised_gain_loss_pct: number;
}

// ── Asset-Class Donut Slice ───────────────────────────────────────────────────

export interface AssetClassAllocation {
  asset_class: AssetClass;
  market_value: number;
  allocation_pct: number;
}

// ── Holdings Position (table row) ─────────────────────────────────────────────

export interface PortfolioPosition {
  position_id: string;
  instrument_id: string;
  symbol: string;
  instrument_name: string;
  account_id: string;
  account_type: AccountType;
  asset_class: AssetClass;
  quantity: number;
  avg_cost: number;
  last_price: number;
  cost_basis: number;
  market_value: number;
  unrealised_gain_loss: number;
  unrealised_gain_loss_pct: number;
}

// ── Top-Level Portfolio API Response ──────────────────────────────────────────

export interface PortfolioResponse {
  customer_id: string;
  snapshot_date: string;
  price_as_of: string;
  totals: PortfolioTotals;
  allocation_by_account: AccountAllocation[];
  allocation_by_asset_class: AssetClassAllocation[];
  positions: PortfolioPosition[];
}

// ── Component-local filter state ──────────────────────────────────────────────

export interface PositionFilters {
  search: string;
  asset_class: AssetClass | '';
}
