/**
 * transaction.api.ts
 * Transaction ledger and instruments lookup API services.
 */

import { apiClient, buildQueryString } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { TransactionFilters, TransactionItem, InstrumentOption } from '../types/transaction.types';
import type { PaginatedResponse } from '../types/common.types';

export async function fetchCustomerTransactions(
  customerId: string,
  filters: TransactionFilters,
): Promise<PaginatedResponse<TransactionItem>> {
  const qs = buildQueryString(
    filters as Record<string, string | number | boolean | undefined | null>,
  );
  return apiClient.get<PaginatedResponse<TransactionItem>>(
    `${API_ENDPOINTS.CUSTOMER_TRANSACTIONS(customerId)}${qs}`,
  );
}

export async function fetchInstruments(): Promise<InstrumentOption[]> {
  return apiClient.get<InstrumentOption[]>(API_ENDPOINTS.INSTRUMENTS);
}
