/**
 * validators.ts
 * Pure client-side validation functions for Login, GoalForm, and CSV upload.
 * Each function returns a string error message or undefined (no error).
 * All messages are sourced from UI_COPY.VALIDATION — do not add inline strings here.
 */

import { UI_COPY } from '../constants/ui.constants';
import { CSV_UPLOAD_RULES } from '../constants/theme.constants';
import type { GoalFormState, GoalFormErrors } from '../types/goal.types';

// ── Login Validators ──────────────────────────────────────────────────────────

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

/**
 * Validates login form fields.
 * Returns an errors object; empty object means the form is valid.
 */
export function validateLoginForm(
  email: string,
  password: string,
): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = UI_COPY.VALIDATION.EMAIL_REQUIRED;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = UI_COPY.VALIDATION.EMAIL_INVALID;
  }

  if (!password) {
    errors.password = UI_COPY.VALIDATION.PASSWORD_REQUIRED;
  }

  return errors;
}

// ── Goal Form Validators ──────────────────────────────────────────────────────

/**
 * Validates all GoalFormModal fields.
 * Returns a GoalFormErrors object; empty object means the form is valid.
 */
export function validateGoalForm(state: GoalFormState): GoalFormErrors {
  const errors: GoalFormErrors = {};

  // goal_name: required, min 2 chars
  if (!state.goal_name.trim()) {
    errors.goal_name = UI_COPY.VALIDATION.GOAL_NAME_REQUIRED;
  } else if (state.goal_name.trim().length < 2) {
    errors.goal_name = UI_COPY.VALIDATION.GOAL_NAME_MIN;
  }

  // goal_type: required
  if (!state.goal_type) {
    errors.goal_type = UI_COPY.VALIDATION.GOAL_TYPE_REQUIRED;
  }

  // priority: required
  if (!state.priority) {
    errors.priority = UI_COPY.VALIDATION.PRIORITY_REQUIRED;
  }

  // target_amount: required, > 0
  const targetAmount = parseFloat(state.target_amount);
  if (!state.target_amount.trim()) {
    errors.target_amount = UI_COPY.VALIDATION.TARGET_AMOUNT_REQUIRED;
  } else if (isNaN(targetAmount) || targetAmount <= 0) {
    errors.target_amount = UI_COPY.VALIDATION.TARGET_AMOUNT_POSITIVE;
  }

  // current_funded_amount: required, >= 0
  const fundedAmount = parseFloat(state.current_funded_amount);
  if (
    state.current_funded_amount.trim() !== '' &&
    (!isNaN(fundedAmount) && fundedAmount < 0)
  ) {
    errors.current_funded_amount = UI_COPY.VALIDATION.CURRENT_FUNDED_NEGATIVE;
  }

  // target_date: required, YYYY-MM-DD
  if (!state.target_date.trim()) {
    errors.target_date = UI_COPY.VALIDATION.TARGET_DATE_REQUIRED;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(state.target_date.trim())) {
    errors.target_date = UI_COPY.VALIDATION.TARGET_DATE_FORMAT;
  }

  return errors;
}

/**
 * Returns true when a GoalFormErrors object contains no entries.
 */
export function isGoalFormValid(errors: GoalFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

// ── CSV File Validators ───────────────────────────────────────────────────────

export interface CsvFileError {
  message: string;
}

/**
 * Validates a File object for CSV type and size constraints.
 * Returns a CsvFileError when invalid, or null when the file is acceptable.
 */
export function validateCsvFile(file: File): CsvFileError | null {
  const isValidType =
    file.type === CSV_UPLOAD_RULES.ACCEPTED_MIME ||
    file.name.toLowerCase().endsWith(CSV_UPLOAD_RULES.ACCEPTED_EXTENSION);

  if (!isValidType) {
    return { message: UI_COPY.VALIDATION.CSV_TYPE_INVALID };
  }

  if (file.size > CSV_UPLOAD_RULES.MAX_SIZE_BYTES) {
    return { message: UI_COPY.VALIDATION.CSV_SIZE_EXCEEDED };
  }

  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true when a plain object has no own enumerable keys.
 * Useful for checking whether any validator returned errors.
 */
export function hasNoErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).every((v) => v === undefined);
}
