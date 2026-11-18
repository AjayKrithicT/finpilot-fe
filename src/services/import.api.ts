/**
 * import.api.ts
 * Admin CSV transaction import API service.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { ImportBatchResponse, PaginatedRejections } from '../types/import.types';

export async function uploadTransactionsCsv(
  file: File,
): Promise<ImportBatchResponse> {
  const form = new FormData();
  form.append('file', file);
  return apiClient.postForm<ImportBatchResponse>(
    API_ENDPOINTS.ADMIN_IMPORT_TRANSACTIONS,
    form,
  );
}

export async function fetchImportRejections(
  batchId: string,
  page: number,
  limit: number,
): Promise<PaginatedRejections> {
  const url =
    API_ENDPOINTS.ADMIN_IMPORT_REJECTIONS(batchId) +
    `?page=${page}&limit=${limit}`;
  return apiClient.get<PaginatedRejections>(url);
}
