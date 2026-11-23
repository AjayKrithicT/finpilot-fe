/**
 * ForbiddenPage.tsx
 * 403 Access Denied — rendered by ProtectedRoute when role check fails.
 */
import { useNavigate } from 'react-router-dom';
import { ShieldOffIcon } from 'lucide-react';
import { UI_COPY } from '../constants/ui.constants';
import { APP_ROUTES } from '../constants/routes.constants';
import { Button } from '../components/reusables/Button';

export function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <ShieldOffIcon className="w-12 h-12 text-[#CBD5E1]" aria-hidden="true" />
      <h1 className="text-2xl font-semibold text-[#0F172A]">
        {UI_COPY.ERRORS.FORBIDDEN_TITLE}
      </h1>
      <p className="text-sm text-[#64748B] max-w-sm">
        {UI_COPY.ERRORS.FORBIDDEN_MESSAGE}
      </p>
      <Button variant="secondary" onClick={() => navigate(APP_ROUTES.CUSTOMERS)}>
        {UI_COPY.ERRORS.FORBIDDEN_BACK}
      </Button>
    </div>
  );
}
