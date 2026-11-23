/**
 * customer.api.ts
 * Customer directory and detail API services.
 */

import { apiClient, buildQueryString } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { CustomerDetail, CustomerListFilters, CustomerSummary } from '../types/customer.types';
import type { PaginatedResponse } from '../types/common.types';

export async function fetchCustomers(
  filters: CustomerListFilters,
): Promise<PaginatedResponse<CustomerSummary>> {
  const qs = buildQueryString(filters as Record<string, string | number | boolean | undefined | null>);
  return apiClient.get<PaginatedResponse<CustomerSummary>>(
    `${API_ENDPOINTS.CUSTOMERS}${qs}`,
  );
}

export async function fetchCustomerDetail(customerId: string): Promise<CustomerDetail> {
  return apiClient.get<CustomerDetail>(API_ENDPOINTS.CUSTOMER_DETAIL(customerId));
}
