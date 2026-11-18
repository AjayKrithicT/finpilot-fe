/**
 * NotFoundPage.tsx
 * 404 Route Not Found.
 */
import { useNavigate } from 'react-router-dom';
import { SearchXIcon } from 'lucide-react';
import { UI_COPY } from '../constants/ui.constants';
import { APP_ROUTES } from '../constants/routes.constants';
import { Button } from '../components/reusables/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <SearchXIcon className="w-12 h-12 text-[#CBD5E1]" aria-hidden="true" />
      <h1 className="text-2xl font-semibold text-[#0F172A]">
        {UI_COPY.ERRORS.NOT_FOUND_TITLE}
      </h1>
      <p className="text-sm text-[#64748B] max-w-sm">
        {UI_COPY.ERRORS.NOT_FOUND_MESSAGE}
      </p>
      <Button variant="secondary" onClick={() => navigate(APP_ROUTES.CUSTOMERS)}>
        {UI_COPY.ERRORS.NOT_FOUND_BACK}
      </Button>
    </div>
  );
}
