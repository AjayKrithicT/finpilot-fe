/**
 * LoginPage.tsx
 * Branded split-screen sign-in page at /login.
 * Left panel: decorative login-bg.svg backdrop.
 * Right panel: logo, LoginForm, and DemoCredentialCard quick-fill.
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth.api';
import { APP_ROUTES } from '../constants/routes.constants';
import { UserRole } from '../constants/domain.constants';
import { UI_COPY } from '../constants/ui.constants';
import { ApiClientError } from '../services/apiClient';
import { LoginForm } from '../components/auth/LoginForm';
import { DemoCredentialCard } from '../components/auth/DemoCredentialCard';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Already authenticated → redirect away
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.CUSTOMERS} replace />;
  }

  const handleSubmit = async (submittedEmail: string, submittedPassword: string) => {
    setServerError(null);
    setIsLoading(true);
    try {
      const response = await loginUser({ email: submittedEmail, password: submittedPassword });
      login(response);
    } catch (err) {
      if (err instanceof ApiClientError && err.httpStatus === 401) {
        setServerError(UI_COPY.ERRORS.UNAUTHORIZED);
      } else {
        setServerError(UI_COPY.ERRORS.GENERIC);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setServerError(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel (hidden on small screens) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-[#0F172A] items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/assets/login-bg.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 text-center px-12 max-w-md">
          <img
            src="/assets/finpilot-logo.svg"
            alt={UI_COPY.NAV.LOGO_ALT}
            className="h-10 w-auto mx-auto mb-6"
          />
          <p className="text-[#94A3B8] text-base leading-relaxed">
            {UI_COPY.APP.TAGLINE}
          </p>
        </div>
      </div>

      {/* ── Right sign-in panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img
              src="/assets/finpilot-logo.svg"
              alt={UI_COPY.NAV.LOGO_ALT}
              className="h-8 w-auto"
            />
          </div>

          {/* Sign-in card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
                {UI_COPY.LOGIN.PAGE_TITLE}
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                {UI_COPY.LOGIN.SUBTITLE}
              </p>
            </div>

            <LoginForm
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              serverError={serverError}
              isLoading={isLoading}
            />

            {/* Demo credential cards */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
                {UI_COPY.LOGIN.DEMO_SECTION_TITLE}
              </p>
              <div className="space-y-2">
                <DemoCredentialCard
                  role={UserRole.VIEWER}
                  onSelect={handleDemoSelect}
                />
                <DemoCredentialCard
                  role={UserRole.ADMIN}
                  onSelect={handleDemoSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
