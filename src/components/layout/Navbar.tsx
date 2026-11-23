/**
 * Navbar.tsx
 * Persistent top navigation bar.
 * Renders finpilot-logo.svg, role-aware links, signed-in user badge, and Logout.
 */

import { NavLink } from 'react-router-dom';
import { LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { APP_ROUTES } from '../../constants/routes.constants';
import { UI_COPY } from '../../constants/ui.constants';
import { Badge } from '../reusables/Badge';
import { USER_ROLE_TONE } from '../../constants/theme.constants';

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
        {/* Logo */}
        <NavLink
          to={APP_ROUTES.CUSTOMERS}
          aria-label={UI_COPY.ARIA.NAV_LOGO}
          className="shrink-0 flex items-center focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
            focus-visible:ring-offset-[#0F172A] rounded"
        >
          <img
            src="/assets/finpilot-logo.svg"
            alt={UI_COPY.NAV.LOGO_ALT}
            className="h-7 w-auto"
          />
        </NavLink>

        {/* Primary nav links */}
        <nav className="flex items-center gap-1 flex-1" aria-label="Main navigation">
          <NavLink
            to={APP_ROUTES.CUSTOMERS}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]
              ${isActive
                ? 'bg-[#1E293B] text-white'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'}`
            }
          >
            {UI_COPY.NAV.CUSTOMERS}
          </NavLink>

          {isAdmin && (
            <NavLink
              to={APP_ROUTES.ADMIN_IMPORTS}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
                focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]
                ${isActive
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'}`
              }
            >
              {UI_COPY.NAV.ADMIN_IMPORTS}
            </NavLink>
          )}
        </nav>

        {/* User info + Logout */}
        {user && (
          <div
            className="flex items-center gap-3 shrink-0"
            aria-label={UI_COPY.ARIA.USER_MENU}
          >
            <div className="hidden sm:flex flex-col items-end leading-none gap-1">
              <span className="text-sm font-medium text-white leading-none">
                {user.full_name}
              </span>
              <Badge
                label={user.role}
                tone={USER_ROLE_TONE[user.role]}
                className="text-[10px]"
              />
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label={UI_COPY.ARIA.LOGOUT}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
                focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              <LogOutIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{UI_COPY.NAV.LOGOUT}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
