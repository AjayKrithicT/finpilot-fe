/**
 * CustomerWorkspacePage.tsx
 * Customer workspace at /customers/:customerId.
 * Fetches customer detail, renders CustomerHeaderCard + tab panels.
 * Passes customer.accounts to TransactionsModule for the account filter dropdown.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { fetchCustomerDetail } from '../services/customer.api';
import { APP_ROUTES } from '../constants/routes.constants';
import { UI_COPY } from '../constants/ui.constants';
import { ApiClientError } from '../services/apiClient';
import { CustomerHeaderCard } from '../components/customers/CustomerHeaderCard';
import type { WorkspaceTab } from '../components/customers/CustomerHeaderCard';
import { PortfolioModule } from '../components/portfolio/PortfolioModule';
import { TransactionsModule } from '../components/transactions/TransactionsModule';
import { GoalsModule } from '../components/goals/GoalsModule';
import { ErrorBanner } from '../components/reusables/ErrorBanner';
import { Skeleton } from '../components/reusables/Skeleton';
import type { CustomerDetail } from '../types/customer.types';

export function CustomerWorkspacePage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('portfolio');

  useEffect(() => {
    if (!customerId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchCustomerDetail(customerId)
      .then((data) => { if (!cancelled) setCustomer(data); })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiClientError ? err.message : UI_COPY.ERRORS.GENERIC);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [customerId]);

  return (
    <div className="space-y-5">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(APP_ROUTES.CUSTOMERS)}
        className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#0F172A]
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 rounded"
      >
        <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
        {UI_COPY.WORKSPACE.BACK_TO_CUSTOMERS}
      </button>

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={() => window.location.reload()} />}

      {/* Loading skeleton for header */}
      {isLoading && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-6 pt-2 border-t border-[#E2E8F0]">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      )}

      {/* Customer header + tabs */}
      {!isLoading && customer && customerId && (
        <>
          <CustomerHeaderCard
            customer={customer}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab panels — keep all mounted to preserve scroll position, hide via CSS */}
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'portfolio' && (
              <PortfolioModule customerId={customerId} />
            )}

            {activeTab === 'transactions' && (
              <TransactionsModule
                customerId={customerId}
                accounts={customer.accounts}
              />
            )}

            {activeTab === 'goals' && (
              <GoalsModule customerId={customerId} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
