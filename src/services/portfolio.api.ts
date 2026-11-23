/**
 * portfolio.api.ts
 * Portfolio API service.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { PortfolioResponse, PaginatedPositions } from '../types/portfolio.types';
import type { AssetClass } from '../constants/domain.constants';

export async function fetchCustomerPortfolio(
  customerId: string,
): Promise<PortfolioResponse> {
  return apiClient.get<PortfolioResponse>(
    API_ENDPOINTS.CUSTOMER_PORTFOLIO(customerId),
  );
}

export interface FetchPositionsParams {
  page?: number;
  limit?: number;
  search?: string;
  asset_class?: AssetClass | '';
}

export async function fetchPortfolioPositions(
  customerId: string,
  params: FetchPositionsParams = {},
): Promise<PaginatedPositions> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.asset_class) query.set('asset_class', params.asset_class);

  const qs = query.toString();
  const url = API_ENDPOINTS.CUSTOMER_PORTFOLIO_POSITIONS(customerId) + (qs ? `?${qs}` : '');
  return apiClient.get<PaginatedPositions>(url);
}
