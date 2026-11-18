/**
 * import.types.ts
 * Admin CSV import batch response and row-level rejection DTOs.
 */

import type { PaginatedResponse } from './common.types';

// ── Row-Level Rejection (quarantine table row) ────────────────────────────────

export interface ImportRejectionItem {
  row_number: number;
  record_identifier: string;
  error_code: string;
  error_reason: string;
  raw_payload?: Record<string, unknown>;
}

// ── Batch Import API Response ─────────────────────────────────────────────────

export type ImportBatchStatus = 'COMPLETED' | 'FAILED';

export interface ImportBatchResponse {
  batch_id: string;
  file_name: string;
  total_rows: number;
  imported_rows: number;
  rejected_rows: number;
  status: ImportBatchStatus;
  rejections: ImportRejectionItem[];
}

// ── Paginated rejections (GET /admin/imports/transactions/:batchId/rejections) ─

export type PaginatedRejections = PaginatedResponse<ImportRejectionItem>;
