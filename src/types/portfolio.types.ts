/**
 * portfolio.types.ts
 * Consolidated portfolio valuation, account allocations, asset-class
 * chart slices, and individual holdings position DTOs.
 */

import type { AccountType, AccountStatus, AssetClass } from '../constants/domain.constants';
import type { PaginatedResponse } from './common.types';

// ── Portfolio Totals (KPI cards) ──────────────────────────────────────────────

export interface PortfolioTotals {
  total_cost_basis: number;
  total_market_value: number;
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
  instrument_id: string;
  symbol: string;
  instrument_name: string;
  asset_class: AssetClass;
  account_id: string;
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
  snapshot_date: string | null;
  price_as_of: string | null;
  totals: PortfolioTotals;
  accounts: AccountAllocation[];
  allocation_by_asset_class: AssetClassAllocation[];
  positions: PortfolioPosition[];
}

// ── Component-local filter state ──────────────────────────────────────────────

export interface PositionFilters {
  search: string;
  asset_class: AssetClass | '';
}

// ── Paginated positions API response ──────────────────────────────────────────

export type PaginatedPositions = PaginatedResponse<PortfolioPosition>;
