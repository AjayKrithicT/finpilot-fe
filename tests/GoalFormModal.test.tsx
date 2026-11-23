/**
 * GoalFormModal.test.tsx
 * Tests:
 *  1. Create mode renders correct title and empty fields
 *  2. Edit mode pre-fills fields with goal values
 *  3. Validation blocks submission when goal_name is empty
 *  4. Validation blocks submission when target_amount <= 0
 *  5. Validation blocks submission when current_funded_amount < 0
 *  6. Valid form calls onSubmit with correct payload
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoalFormModal } from '../src/components/goals/GoalFormModal';
import { UI_COPY } from '../src/constants/ui.constants';
import { GoalType, PriorityLevel } from '../src/constants/domain.constants';
import type { GoalItem } from '../src/types/goal.types';

const EXISTING_GOAL: GoalItem = {
  goal_id: 'G001',
  customer_id: 'C0002',
  goal_name: 'Emergency Fund',
  goal_type: GoalType.EMERGENCY_FUND,
  priority: PriorityLevel.HIGH,
  target_amount: 500000,
  current_funded_amount: 100000,
  funded_percentage: 20,
  target_date: '2025-12-31',
  is_overdue: false,
  is_overfunded: false,
};

function renderModal(overrides: Partial<Parameters<typeof GoalFormModal>[0]> = {}) {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    isSubmitting: false,
    ...overrides,
  };
  return render(<GoalFormModal {...defaults} />);
}

describe('GoalFormModal — Create mode', () => {
  it('renders Create New Goal title', () => {
    renderModal();
    expect(screen.getByText(UI_COPY.GOALS.MODAL_CREATE_TITLE)).toBeTruthy();
  });

  it('renders empty goal name field', () => {
    renderModal();
    const input = screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_NAME) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('shows validation error when goal_name is empty on submit', async () => {
    renderModal();
    fireEvent.click(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_CREATE));
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.VALIDATION.GOAL_NAME_REQUIRED)).toBeTruthy();
    });
  });

  it('shows validation error when goal_name is too short', async () => {
    renderModal();
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_NAME), {
      target: { value: 'A' },
    });
    fireEvent.click(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_CREATE));
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.VALIDATION.GOAL_NAME_MIN)).toBeTruthy();
    });
  });

  it('shows validation error for target_amount <= 0', async () => {
    renderModal();
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_NAME), {
      target: { value: 'My Goal' },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_TARGET_AMOUNT), {
      target: { value: '-100' },
    });
    fireEvent.click(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_CREATE));
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.VALIDATION.TARGET_AMOUNT_POSITIVE)).toBeTruthy();
    });
  });

  it('shows validation error for negative current_funded_amount', async () => {
    renderModal();
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_CURRENT_FUNDED), {
      target: { value: '-50' },
    });
    fireEvent.click(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_CREATE));
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.VALIDATION.CURRENT_FUNDED_NEGATIVE)).toBeTruthy();
    });
  });

  it('calls onSubmit with correct payload for a valid form', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderModal({ onSubmit });

    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_NAME), {
      target: { value: 'Retirement Fund' },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_TYPE), {
      target: { value: GoalType.RETIREMENT },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_PRIORITY), {
      target: { value: PriorityLevel.HIGH },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_TARGET_AMOUNT), {
      target: { value: '1000000' },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_CURRENT_FUNDED), {
      target: { value: '0' },
    });
    fireEvent.change(screen.getByLabelText(UI_COPY.GOALS.FIELD_TARGET_DATE), {
      target: { value: '2030-01-01' },
    });

    fireEvent.click(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_CREATE));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        goal_name: 'Retirement Fund',
        goal_type: GoalType.RETIREMENT,
        priority: PriorityLevel.HIGH,
        target_amount: 1000000,
        current_funded_amount: 0,
        target_date: '2030-01-01',
      });
    });
  });
});

describe('GoalFormModal — Edit mode', () => {
  it('renders Edit Goal title', () => {
    renderModal({ initialGoal: EXISTING_GOAL });
    expect(screen.getByText(UI_COPY.GOALS.MODAL_EDIT_TITLE)).toBeTruthy();
  });

  it('pre-fills goal_name from existing goal', () => {
    renderModal({ initialGoal: EXISTING_GOAL });
    const input = screen.getByLabelText(UI_COPY.GOALS.FIELD_GOAL_NAME) as HTMLInputElement;
    expect(input.value).toBe('Emergency Fund');
  });

  it('pre-fills target_amount from existing goal', () => {
    renderModal({ initialGoal: EXISTING_GOAL });
    const input = screen.getByLabelText(
      UI_COPY.GOALS.FIELD_TARGET_AMOUNT,
    ) as HTMLInputElement;
    expect(input.value).toBe('500000');
  });

  it('renders Save Changes submit button', () => {
    renderModal({ initialGoal: EXISTING_GOAL });
    expect(screen.getByText(UI_COPY.GOALS.MODAL_SUBMIT_EDIT)).toBeTruthy();
  });
});
