/**
 * GoalFormModal.tsx
 * Shared Create / Edit goal modal with inline validation.
 * Mode is inferred from whether an initialGoal is provided.
 */

import { useState, useEffect } from 'react';
import { UI_COPY } from '../../constants/ui.constants';
import {
  GoalType,
  PriorityLevel,
  GOAL_TYPE_LABELS,
  PRIORITY_LABELS,
} from '../../constants/domain.constants';
import { validateGoalForm, isGoalFormValid } from '../../utils/validators';
import { Modal } from '../reusables/Modal';
import { Button } from '../reusables/Button';
import type { GoalItem, GoalFormState, CreateGoalPayload, UpdateGoalPayload } from '../../types/goal.types';
import type { GoalFormErrors } from '../../types/goal.types';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateGoalPayload | UpdateGoalPayload) => Promise<void>;
  initialGoal?: GoalItem;
  isSubmitting: boolean;
}

const EMPTY_STATE: GoalFormState = {
  goal_name: '',
  goal_type: '',
  priority: '',
  target_amount: '',
  current_funded_amount: '0',
  target_date: '',
};

const INPUT_CLS = `w-full h-10 rounded-lg border px-3 text-sm text-[#0F172A]
  placeholder:text-[#94A3B8] bg-white transition-colors
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[#2563EB] focus-visible:ring-offset-2`;

const SELECT_CLS = `w-full h-10 rounded-lg border px-3 text-sm text-[#0F172A]
  bg-white transition-colors
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[#2563EB] focus-visible:ring-offset-2`;

const LABEL_CLS = 'block text-sm font-medium text-[#0F172A] mb-1.5';
const ERROR_CLS = 'text-xs text-[#B91C1C] mt-1';
const FIELD = 'space-y-0';

function fieldBorder(err?: string) {
  return err ? 'border-[#FECACA] bg-[#FEF2F2]' : 'border-[#CBD5E1]';
}

export function GoalFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialGoal,
  isSubmitting,
}: GoalFormModalProps) {
  const isEdit = !!initialGoal;
  const [form, setForm] = useState<GoalFormState>(EMPTY_STATE);
  const [errors, setErrors] = useState<GoalFormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
      if (initialGoal) {
        setForm({
          goal_name: initialGoal.goal_name,
          goal_type: initialGoal.goal_type,
          priority: initialGoal.priority,
          target_amount: String(initialGoal.target_amount),
          current_funded_amount: String(initialGoal.current_funded_amount),
          target_date: initialGoal.target_date,
        });
      } else {
        setForm(EMPTY_STATE);
      }
    }
  }, [isOpen, initialGoal]);

  const set = (key: keyof GoalFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateGoalForm(form);
    setErrors(fieldErrors);
    if (!isGoalFormValid(fieldErrors)) return;

    const payload = {
      goal_name: form.goal_name.trim(),
      goal_type: form.goal_type as GoalType,
      priority: form.priority as PriorityLevel,
      target_amount: parseFloat(form.target_amount),
      current_funded_amount: parseFloat(form.current_funded_amount) || 0,
      target_date: form.target_date,
    };
    await onSubmit(payload);
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
        {UI_COPY.GOALS.MODAL_CANCEL}
      </Button>
      <Button
        variant="primary"
        type="submit"
        form="goal-form"
        isLoading={isSubmitting}
      >
        {isSubmitting
          ? UI_COPY.GOALS.MODAL_SUBMITTING
          : isEdit
            ? UI_COPY.GOALS.MODAL_SUBMIT_EDIT
            : UI_COPY.GOALS.MODAL_SUBMIT_CREATE}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? UI_COPY.GOALS.MODAL_EDIT_TITLE : UI_COPY.GOALS.MODAL_CREATE_TITLE}
      footer={footer}
    >
      <form id="goal-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Goal Name */}
        <div className={FIELD}>
          <label htmlFor="goal-name" className={LABEL_CLS}>
            {UI_COPY.GOALS.FIELD_GOAL_NAME}
          </label>
          <input
            id="goal-name"
            type="text"
            value={form.goal_name}
            onChange={set('goal_name')}
            aria-invalid={!!errors.goal_name}
            aria-describedby={errors.goal_name ? 'goal-name-err' : undefined}
            className={`${INPUT_CLS} ${fieldBorder(errors.goal_name)}`}
          />
          {errors.goal_name && <p id="goal-name-err" className={ERROR_CLS}>{errors.goal_name}</p>}
        </div>

        {/* Goal Type + Priority (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          <div className={FIELD}>
            <label htmlFor="goal-type" className={LABEL_CLS}>
              {UI_COPY.GOALS.FIELD_GOAL_TYPE}
            </label>
            <select
              id="goal-type"
              value={form.goal_type}
              onChange={set('goal_type')}
              aria-invalid={!!errors.goal_type}
              className={`${SELECT_CLS} ${fieldBorder(errors.goal_type)}`}
            >
              <option value="">{UI_COPY.GOALS.GOAL_TYPE_PLACEHOLDER}</option>
              {Object.values(GoalType).map((t) => (
                <option key={t} value={t}>{GOAL_TYPE_LABELS[t]}</option>
              ))}
            </select>
            {errors.goal_type && <p className={ERROR_CLS}>{errors.goal_type}</p>}
          </div>

          <div className={FIELD}>
            <label htmlFor="goal-priority" className={LABEL_CLS}>
              {UI_COPY.GOALS.FIELD_PRIORITY}
            </label>
            <select
              id="goal-priority"
              value={form.priority}
              onChange={set('priority')}
              aria-invalid={!!errors.priority}
              className={`${SELECT_CLS} ${fieldBorder(errors.priority)}`}
            >
              <option value="">{UI_COPY.GOALS.PRIORITY_PLACEHOLDER}</option>
              {Object.values(PriorityLevel).map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
            {errors.priority && <p className={ERROR_CLS}>{errors.priority}</p>}
          </div>
        </div>

        {/* Target Amount + Current Funded (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          <div className={FIELD}>
            <label htmlFor="goal-target" className={LABEL_CLS}>
              {UI_COPY.GOALS.FIELD_TARGET_AMOUNT}
            </label>
            <input
              id="goal-target"
              type="number"
              min="0"
              step="0.01"
              value={form.target_amount}
              onChange={set('target_amount')}
              aria-invalid={!!errors.target_amount}
              className={`${INPUT_CLS} ${fieldBorder(errors.target_amount)}`}
            />
            {errors.target_amount && <p className={ERROR_CLS}>{errors.target_amount}</p>}
          </div>

          <div className={FIELD}>
            <label htmlFor="goal-funded" className={LABEL_CLS}>
              {UI_COPY.GOALS.FIELD_CURRENT_FUNDED}
            </label>
            <input
              id="goal-funded"
              type="number"
              min="0"
              step="0.01"
              value={form.current_funded_amount}
              onChange={set('current_funded_amount')}
              aria-invalid={!!errors.current_funded_amount}
              className={`${INPUT_CLS} ${fieldBorder(errors.current_funded_amount)}`}
            />
            {errors.current_funded_amount && (
              <p className={ERROR_CLS}>{errors.current_funded_amount}</p>
            )}
          </div>
        </div>

        {/* Target Date */}
        <div className={FIELD}>
          <label htmlFor="goal-date" className={LABEL_CLS}>
            {UI_COPY.GOALS.FIELD_TARGET_DATE}
          </label>
          <input
            id="goal-date"
            type="date"
            value={form.target_date}
            onChange={set('target_date')}
            aria-invalid={!!errors.target_date}
            aria-describedby={errors.target_date ? 'goal-date-err' : undefined}
            className={`${INPUT_CLS} ${fieldBorder(errors.target_date)}`}
          />
          {errors.target_date && <p id="goal-date-err" className={ERROR_CLS}>{errors.target_date}</p>}
        </div>
      </form>
    </Modal>
  );
}
