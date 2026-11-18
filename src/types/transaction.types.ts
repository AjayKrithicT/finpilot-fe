/**
 * transaction.types.ts
 * Transaction ledger row, server-side filter parameters, and instrument
 * option DTOs.
 */

import type {
  AccountType,
  AssetClass,
  TransactionType,
  TransactionStatus,
  SortDirection,
} from '../constants/domain.constants';

// ── Instrument lookup (filter dropdown) ──────────────────────────────────────

export interface InstrumentOption {
  instrument_id: string;
  symbol: string;
  instrument_name: string;
  asset_class: AssetClass;
}

// ── Transaction Ledger Row ────────────────────────────────────────────────────

export interface TransactionItem {
  transaction_id: string;
  account_id: string;
  account_type: AccountType;
  instrument_id: string;
  symbol: string;
  instrument_name: string;
  transaction_type: TransactionType;
  trade_date: string;
  quantity: number;
  price: number;
  amount: number;
  status: TransactionStatus;
}

// ── Server-Side Filter & Sort Parameters ─────────────────────────────────────

export interface TransactionFilters {
  account_id?: string;
  instrument_id?: string;
  transaction_type?: TransactionType | '';
  status?: TransactionStatus | '';
  from_date?: string;
  to_date?: string;
  sort_by?: 'trade_date' | 'amount' | 'transaction_type' | 'status';
  sort_dir?: SortDirection;
  page?: number;
  limit?: number;
}
