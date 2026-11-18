# Implementation Plan — FinPilot Frontend Web Application

- [ ] 1. Configure Design Tokens, Constants (Domain, Theme, Routes, UI Copy), Strict Interfaces & Formatters
  - [ ] 1.1 Update `index.html` favicon to `/assets/finpilot-mark.svg` and configure Tailwind CSS `@theme` color & typography tokens in `src/index.css` matching `docs/design_tokens.md`.
  - [ ] 1.2 Create `src/constants/routes.constants.ts`, `src/constants/domain.constants.ts` (TypeScript `enum`s & label maps), `src/constants/theme.constants.ts` (chart colors, badge tone maps, CSV upload limits), and `src/constants/ui.constants.ts` (all UI copy, headings, button labels, errors & `aria-label` strings).
  - [ ] 1.3 Create strict TypeScript interfaces in `src/types/common.types.ts`, `src/types/auth.types.ts`, `src/types/customer.types.ts`, `src/types/portfolio.types.ts`, `src/types/transaction.types.ts`, `src/types/goal.types.ts`, and `src/types/import.types.ts` (zero `any` types).
  - [ ] 1.4 Create `src/utils/formatters.ts` (`formatINR`, `formatSignedINR`, `formatPercent`, `formatDate`) and `src/utils/validators.ts`.

- [ ] 2. Implement API Client, Auth & Toast Contexts, Reusable UI Components & Layout Shell
  - [ ] 2.1 Create `src/services/apiClient.ts` with `VITE_API_BASE_URL`, Bearer JWT injection, query string builder, `ApiClientError`, and global `401` session teardown callback.
  - [ ] 2.2 Create `src/context/AuthContext.tsx` (`sessionStorage` persistence, `login()`, full `logout()` storage cleanup, `isAdmin`) and `src/context/ToastContext.tsx` (`aria-live` notifications).
  - [ ] 2.3 Create reusable UI components in `src/components/reusables/`: `Badge.tsx`, `Button.tsx`, `Card.tsx`, `EmptyState.tsx`, `ErrorBanner.tsx`, `Modal.tsx`, `Pagination.tsx`, and `Skeleton.tsx` (each < 150 lines, using `UI_COPY` and `aria-label`).
  - [ ] 2.4 Create `src/components/layout/Navbar.tsx` (rendering `/assets/finpilot-logo.svg`, role-aware links, user badge, and `Logout` button), `src/components/layout/AppShell.tsx`, and `src/components/layout/ProtectedRoute.tsx`.

- [ ] 3. Implement Login Page & Customer Directory Module
  - [ ] 3.1 Create `src/services/auth.api.ts`, `src/components/auth/DemoCredentialCard.tsx`, `src/components/auth/LoginForm.tsx`, and `src/pages/LoginPage.tsx` (using `/assets/login-bg.svg` and `/assets/finpilot-logo.svg`).
  - [ ] 3.2 Create `src/services/customer.api.ts`, `src/components/customers/CustomerFilters.tsx`, `src/components/customers/CustomerTable.tsx`, and `src/pages/CustomersPage.tsx`.

- [ ] 4. Implement Customer Workspace & Portfolio Module
  - [ ] 4.1 Create `src/services/portfolio.api.ts`, `src/components/customers/CustomerHeaderCard.tsx`, and `src/pages/CustomerWorkspacePage.tsx` (`Portfolio`, `Transactions`, `Goals` accessible tabs).
  - [ ] 4.2 Create `src/components/portfolio/PortfolioKpiGrid.tsx` (4 KPI cards + `snapshot_date` / `price_as_of` freshness bar) and `src/components/portfolio/AccountSummaryCards.tsx`.
  - [ ] 4.3 Create `src/components/portfolio/AssetAllocationChart.tsx` (Recharts Donut chart using `ASSET_CLASS_COLORS`), `src/components/portfolio/PositionsTable.tsx`, and `src/components/portfolio/PortfolioModule.tsx` (handling populated and zero-position empty states).

- [ ] 5. Implement Transactions Ledger Module & Financial Goals Module
  - [ ] 5.1 Create `src/services/transaction.api.ts`, `src/components/transactions/TransactionFiltersBar.tsx`, `src/components/transactions/TransactionsTable.tsx`, and `src/components/transactions/TransactionsModule.tsx`.
  - [ ] 5.2 Create `src/services/goal.api.ts`, `src/components/goals/GoalCard.tsx` (clamped `role="progressbar"`, `funded_percentage`, `Overdue` & `Overfunded` badges), `src/components/goals/GoalFormModal.tsx` (Create & Edit modes), and `src/components/goals/GoalsModule.tsx`.

- [ ] 6. Implement Admin CSV Import Page, App Routing & Automated Tests
  - [ ] 6.1 Create `src/services/import.api.ts`, `src/components/admin/CsvDropzone.tsx`, `src/components/admin/ImportResultPanel.tsx`, `src/pages/AdminImportPage.tsx`, `src/pages/ForbiddenPage.tsx`, and `src/pages/NotFoundPage.tsx`.
  - [ ] 6.2 Wire `src/App.tsx` with `BrowserRouter`, `AuthProvider`, `ToastProvider`, and protected routes (`/login`, `/customers`, `/customers/:customerId`, `/admin/imports`, `/forbidden`, `*`).
  - [ ] 6.3 Configure Vitest `jsdom` in `vite.config.ts` and write tests in `tests/formatters.unit.test.ts`, `tests/ProtectedRoute.test.tsx`, `tests/PortfolioView.test.tsx`, `tests/GoalFormModal.test.tsx`, and `tests/AdminImportPage.test.tsx`.