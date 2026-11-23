/**
 * LoginForm.tsx
 * Fully controlled email/password form.
 * State lives in LoginPage so DemoCredentialCard can inject values.
 * Validates on submit and maps field errors to aria-invalid inputs.
 */

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { validateLoginForm } from '../../utils/validators';
import { Button } from '../reusables/Button';
import type { LoginFormErrors } from '../../utils/validators';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  serverError: string | null;
  isLoading: boolean;
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  serverError,
  isLoading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateLoginForm(email, password);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-[#0F172A]">
          {UI_COPY.LOGIN.EMAIL_LABEL}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder={UI_COPY.LOGIN.EMAIL_PLACEHOLDER}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={`w-full h-10 rounded-lg border px-3 text-sm text-[#0F172A]
            placeholder:text-[#94A3B8] bg-white transition-colors
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
            ${errors.email ? 'border-[#FECACA] bg-[#FEF2F2]' : 'border-[#CBD5E1]'}`}
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-[#B91C1C]">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="block text-sm font-medium text-[#0F172A]">
          {UI_COPY.LOGIN.PASSWORD_LABEL}
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              onPasswordChange(e.target.value);
              setErrors((p) => ({ ...p, password: undefined }));
            }}
            placeholder={UI_COPY.LOGIN.PASSWORD_PLACEHOLDER}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className={`w-full h-10 rounded-lg border px-3 pr-10 text-sm text-[#0F172A]
              placeholder:text-[#94A3B8] bg-white transition-colors
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
              ${errors.password ? 'border-[#FECACA] bg-[#FEF2F2]' : 'border-[#CBD5E1]'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]
              hover:text-[#475569] rounded
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            {showPassword
              ? <EyeOffIcon className="w-4 h-4" aria-hidden="true" />
              : <EyeIcon className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-xs text-[#B91C1C]">
            {errors.password}
          </p>
        )}
      </div>

      {/* Server / 401 error */}
      {serverError && (
        <p role="alert" className="text-xs text-[#B91C1C] bg-[#FEF2F2]
          border border-[#FECACA] rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? UI_COPY.LOGIN.SUBMITTING : UI_COPY.LOGIN.SUBMIT}
      </Button>
    </form>
  );
}
