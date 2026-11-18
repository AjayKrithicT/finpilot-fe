/**
 * auth.api.ts
 * Authentication API service.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, payload);
}
