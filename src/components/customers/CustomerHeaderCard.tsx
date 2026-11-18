/**
 * CustomerHeaderCard.tsx
 * Persistent workspace banner: customer identity, risk profile summary,
 * and accessible tab navigation (Portfolio / Transactions / Goals).
 */

import { MapPinIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { KYC_STATUS_LABELS } from '../../constants/domain.constants';
import { KYC_STATUS_TONE, SEGMENT_TONE } from '../../constants/theme.constants';
import { Badge } from '../reusables/Badge';
import type { CustomerDetail } from '../../types/customer.types';

export type WorkspaceTab = 'portfolio' | 'transactions' | 'goals';

const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'portfolio', label: UI_COPY.WORKSPACE.TAB_PORTFOLIO },
  { id: 'transactions', label: UI_COPY.WORKSPACE.TAB_TRANSACTIONS },
  { id: 'goals', label: UI_COPY.WORKSPACE.TAB_GOALS },
];

interface CustomerHeaderCardProps {
  customer: CustomerDetail;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

export function CustomerHeaderCard({
  customer,
  activeTab,
  onTabChange,
}: CustomerHeaderCardProps) {
  const { risk_profile: rp } = customer;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      {/* Identity row */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left: name + badges */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
                {customer.full_name}
              </h1>
              <Badge
                label={KYC_STATUS_LABELS[customer.kyc_status]}
                tone={KYC_STATUS_TONE[customer.kyc_status]}
                ariaLabel={`KYC: ${KYC_STATUS_LABELS[customer.kyc_status]}`}
              />
              <Badge
                label={customer.segment}
                tone={SEGMENT_TONE[customer.segment]}
                ariaLabel={`Segment: ${customer.segment}`}
              />
            </div>
            <span className="font-mono text-[13px] font-medium text-[#64748B]">
              {customer.customer_id}
            </span>
          </div>

          {/* Right: contact */}
          <div className="flex flex-col gap-1 text-sm text-[#475569] shrink-0">
            <span className="flex items-center gap-1.5">
              <MailIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
              {customer.email}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
              {customer.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
              {customer.city}, {customer.state}
            </span>
          </div>
        </div>

        {/* Risk profile strip */}
        <div className="mt-4 flex flex-wrap gap-5 text-sm border-t border-[#E2E8F0] pt-3">
          <div>
            <span className="text-xs text-[#64748B] uppercase tracking-wide font-semibold">
              {UI_COPY.WORKSPACE.RISK_PROFILE_TITLE}
            </span>
          </div>
          <span className="text-[#0F172A]">
            <span className="text-[#64748B] text-xs">Level: </span>
            <strong className="font-medium">{rp.risk_level}</strong>
          </span>
          <span className="text-[#0F172A] tabular-nums">
            <span className="text-[#64748B] text-xs">Score: </span>
            <strong className="font-medium">{rp.risk_score}</strong>
          </span>
          <span className="text-[#0F172A] tabular-nums">
            <span className="text-[#64748B] text-xs">Horizon: </span>
            <strong className="font-medium">{rp.horizon_years} yrs</strong>
          </span>
          <span className="text-[#0F172A]">
            <span className="text-[#64748B] text-xs">Liquidity: </span>
            <strong className="font-medium">{rp.liquidity_need}</strong>
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <nav
        role="tablist"
        aria-label="Customer workspace sections"
        className="flex border-t border-[#E2E8F0] px-6"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
                focus-visible:ring-inset
                ${isActive
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
