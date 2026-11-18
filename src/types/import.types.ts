/**
 * import.types.ts
 * Admin CSV import batch response and row-level rejection DTOs.
 */

// ── Row-Level Rejection (quarantine table row) ────────────────────────────────

export interface ImportRejectionItem {
  row_number: number;
  record_identifier: string;
  error_code: string;
  error_reason: string;
}

// ── Batch Import API Response ─────────────────────────────────────────────────

export interface ImportBatchResponse {
  batch_id: string;
  file_name: string;
  total_rows: number;
  imported_rows: number;
  rejected_rows: number;
  rejections: ImportRejectionItem[];
}
