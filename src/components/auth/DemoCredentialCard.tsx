/**
 * DemoCredentialCard.tsx
 * One-click VIEWER / ADMIN credential selector for the login page.
 */

import { UserRole } from '../../constants/domain.constants';
import { UI_COPY } from '../../constants/ui.constants';
import { USER_ROLE_TONE } from '../../constants/theme.constants';
import { Badge } from '../reusables/Badge';

const DEMO_CREDENTIALS: Record<
  UserRole,
  { email: string; password: string; title: string; desc: string }
> = {
  [UserRole.VIEWER]: {
    email: 'viewer@finpilot.local',
    password: 'Viewer@123',
    title: UI_COPY.LOGIN.DEMO_VIEWER_TITLE,
    desc: UI_COPY.LOGIN.DEMO_VIEWER_DESC,
  },
  [UserRole.ADMIN]: {
    email: 'admin@finpilot.local',
    password: 'Admin@123',
    title: UI_COPY.LOGIN.DEMO_ADMIN_TITLE,
    desc: UI_COPY.LOGIN.DEMO_ADMIN_DESC,
  },
};

interface DemoCredentialCardProps {
  role: UserRole;
  onSelect: (email: string, password: string) => void;
}

export function DemoCredentialCard({ role, onSelect }: DemoCredentialCardProps) {
  const cred = DEMO_CREDENTIALS[role];

  return (
    <button
      type="button"
      onClick={() => onSelect(cred.email, cred.password)}
      className="w-full text-left flex items-start justify-between gap-3 rounded-xl
        border border-[#E2E8F0] bg-white px-4 py-3 hover:border-[#BFDBFE]
        hover:bg-[#EFF6FF] transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
        focus-visible:ring-offset-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-[#0F172A]">{cred.title}</span>
          <Badge label={role} tone={USER_ROLE_TONE[role]} />
        </div>
        <p className="text-xs text-[#64748B] truncate">{cred.desc}</p>
        <p className="text-xs text-[#94A3B8] mt-1 font-mono truncate">{cred.email}</p>
      </div>
      <span className="shrink-0 mt-0.5 text-xs font-medium text-[#2563EB]">
        {UI_COPY.LOGIN.DEMO_USE_BTN}
      </span>
    </button>
  );
}
