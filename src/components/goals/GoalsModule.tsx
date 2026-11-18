/**
 * GoalsModule.tsx
 * Orchestrates goal list fetch, empty state, Add/Edit modal, and toast feedback.
 */

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from 'lucide-react';
import { fetchCustomerGoals, createCustomerGoal, updateGoal } from '../../services/goal.api';
import { ApiClientError } from '../../services/apiClient';
import { UI_COPY } from '../../constants/ui.constants';
import { useToast } from '../../context/ToastContext';
import { GoalCard } from './GoalCard';
import { GoalFormModal } from './GoalFormModal';
import { Button } from '../reusables/Button';
import { EmptyState } from '../reusables/EmptyState';
import { ErrorBanner } from '../reusables/ErrorBanner';
import { CardGridSkeleton } from '../reusables/Skeleton';
import type { GoalItem, CreateGoalPayload, UpdateGoalPayload } from '../../types/goal.types';

interface GoalsModuleProps {
  customerId: string;
}

export function GoalsModule({ customerId }: GoalsModuleProps) {
  const { addToast } = useToast();

  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerGoals(customerId);
      setGoals(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => { void load(); }, [load]);

  const handleOpenCreate = () => {
    setEditingGoal(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (goal: GoalItem) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setModalOpen(false);
    setEditingGoal(undefined);
  };

  const handleSubmit = async (payload: CreateGoalPayload | UpdateGoalPayload) => {
    setIsSubmitting(true);
    try {
      if (editingGoal) {
        const updated = await updateGoal(editingGoal.goal_id, payload as UpdateGoalPayload);
        setGoals((prev) =>
          prev.map((g) => (g.goal_id === updated.goal_id ? updated : g)),
        );
        addToast(UI_COPY.GOALS.UPDATE_SUCCESS_TOAST, 'success');
      } else {
        const created = await createCustomerGoal(customerId, payload as CreateGoalPayload);
        setGoals((prev) => [...prev, created]);
        addToast(UI_COPY.GOALS.CREATE_SUCCESS_TOAST, 'success');
      }
      setModalOpen(false);
      setEditingGoal(undefined);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC;
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addButton = (
    <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-1.5">
      <PlusIcon className="w-4 h-4" aria-hidden="true" />
      {UI_COPY.GOALS.ADD_GOAL}
    </Button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold leading-[26px] text-[#0F172A]">
          {UI_COPY.GOALS.SECTION_TITLE}
        </h2>
        {addButton}
      </div>

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={() => void load()} />}

      {/* Loading */}
      {isLoading && <CardGridSkeleton count={3} />}

      {/* Empty */}
      {!isLoading && !error && goals.length === 0 && (
        <EmptyState
          title={UI_COPY.GOALS.EMPTY_TITLE}
          message={UI_COPY.GOALS.EMPTY_MESSAGE}
          action={addButton}
        />
      )}

      {/* Goal cards grid */}
      {!isLoading && !error && goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {goals.map((goal) => (
            <GoalCard key={goal.goal_id} goal={goal} onEdit={handleOpenEdit} />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <GoalFormModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialGoal={editingGoal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
