/**
 * common.types.ts
 * Shared pagination, API response, error, and badge tone contracts.
 * Imported by multiple domain type files — no domain-specific fields here.
 */

import type { BadgeTone } from '../constants/theme.constants';

// Re-export so consumers only need to import from types/
export type { BadgeTone };

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ── API Error ─────────────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  field: string;
  issue: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details: ApiErrorDetail[];
  request_id: string;
}

export interface ApiErrorEnvelope {
  error: ApiErrorPayload;
}

// ── Generic async state wrapper ───────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}
