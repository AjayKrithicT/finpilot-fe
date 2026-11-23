/**
 * goal.api.ts
 * Financial goals API services: list, create, update.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/routes.constants';
import type { GoalItem, CreateGoalPayload, UpdateGoalPayload } from '../types/goal.types';

export async function fetchCustomerGoals(customerId: string): Promise<GoalItem[]> {
  return apiClient.get<GoalItem[]>(API_ENDPOINTS.CUSTOMER_GOALS(customerId));
}

export async function createCustomerGoal(
  customerId: string,
  payload: CreateGoalPayload,
): Promise<GoalItem> {
  return apiClient.post<GoalItem>(API_ENDPOINTS.CUSTOMER_GOALS(customerId), payload);
}

export async function updateGoal(
  goalId: string,
  payload: UpdateGoalPayload,
): Promise<GoalItem> {
  return apiClient.patch<GoalItem>(API_ENDPOINTS.GOAL(goalId), payload);
}
