/**
 * portfolio.api.ts
 * Portfolio API service.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { PortfolioResponse } from '../types/portfolio.types';

export async function fetchCustomerPortfolio(
  customerId: string,
): Promise<PortfolioResponse> {
  return apiClient.get<PortfolioResponse>(
    API_ENDPOINTS.CUSTOMER_PORTFOLIO(customerId),
  );
}
