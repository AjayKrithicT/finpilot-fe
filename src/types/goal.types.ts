/**
 * goal.types.ts
 * Financial goal DTOs for list, create, and update operations.
 */

import type { GoalType, PriorityLevel } from '../constants/domain.constants';

// ── Goal Item (list / detail) ─────────────────────────────────────────────────

export interface GoalItem {
  goal_id: string;
  customer_id: string;
  goal_name: string;
  goal_type: GoalType;
  priority: PriorityLevel;
  target_amount: number;
  current_funded_amount: number;
  funded_percentage: number;
  target_date: string;
  is_overdue: boolean;
  is_overfunded: boolean;
}

// ── Create Payload ────────────────────────────────────────────────────────────

export interface CreateGoalPayload {
  goal_name: string;
  goal_type: GoalType;
  priority: PriorityLevel;
  target_amount: number;
  current_funded_amount: number;
  target_date: string;
}

// ── Update Payload (all fields optional for PATCH) ───────────────────────────

export interface UpdateGoalPayload {
  goal_name?: string;
  goal_type?: GoalType;
  priority?: PriorityLevel;
  target_amount?: number;
  current_funded_amount?: number;
  target_date?: string;
}

// ── Goal Form State (used by GoalFormModal) ───────────────────────────────────

export interface GoalFormState {
  goal_name: string;
  goal_type: GoalType | '';
  priority: PriorityLevel | '';
  target_amount: string;
  current_funded_amount: string;
  target_date: string;
}

export interface GoalFormErrors {
  goal_name?: string;
  goal_type?: string;
  priority?: string;
  target_amount?: string;
  current_funded_amount?: string;
  target_date?: string;
}
