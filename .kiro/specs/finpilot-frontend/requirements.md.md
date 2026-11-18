# Requirements Document — FinPilot Frontend Web Application

## 1. Purpose & Scope
FinPilot Frontend is a single-page React + TypeScript (`strict: true`) web application styled with Tailwind CSS (`docs/design_tokens.md`) that consumes the FinPilot REST API (`/api/v1`). It provides wealth-service users with customer search, consolidated portfolio analytics, server-side filtered transactions, and financial goal tracking, while providing operations administrators a role-restricted CSV transaction ingestion and anomaly reconciliation console.

- **State Management:** React Context API (`AuthContext`, `ToastContext`) and local component state (no Redux).
- **API Integration:** Connects to `VITE_API_BASE_URL` (default `http://localhost:8000/api/v1`).

---

## 2. Functional Requirements

### Requirement 1: Design System Tokens, Visual Assets & Navigation Shell
**User Story:** As a user, I want an aesthetically cohesive, accessible interface and persistent navigation bar so I can move smoothly between customer workspaces and administrative tools.

#### Acceptance Criteria
1. THE application SHALL implement Tailwind CSS `@theme` design tokens in `src/index.css` and semantic style mappings in `src/constants/theme.constants.ts` matching `docs/design_tokens.md`.
2. THE application SHALL render `public/assets/finpilot-logo.svg` in the top navigation bar and login screen, `public/assets/finpilot-mark.svg` as the page favicon, and `public/assets/login-bg.svg` on `/login`.
3. WHEN authenticated, THE navigation bar SHALL display navigation links (`Customers`, plus `Admin Imports` ONLY when `user.role === UserRole.ADMIN`), the signed-in user's `full_name` and `role` badge, and a prominent `Logout` button.
4. ALL monetary values SHALL render in `INR` using `en-IN` grouping and `tabular-nums` alignment.

---

### Requirement 2: Authentication, Security & Role-Based Route Protection
**User Story:** As an internal user (`VIEWER` or `ADMIN`), I want secure session handling, route protection, and clean logout behavior so unauthorized users cannot access restricted views or stale credentials.

#### Acceptance Criteria
1. WHEN an unauthenticated user visits any protected route (`/customers`, `/customers/:customerId`, `/admin/imports`), THE `ProtectedRoute` guard SHALL redirect to `/login`.
2. WHEN a user submits valid credentials on `/login` (`POST /api/v1/auth/login`), THE application SHALL persist the JWT and user profile in `sessionStorage` via `AuthContext`, display a welcome toast, and navigate to `/customers`.
3. THE `/login` page SHALL provide one-click demo credential autofill cards for `VIEWER` (`viewer@finpilot.local`) and `ADMIN` (`admin@finpilot.local`) alongside field validation and clear `401` error feedback.
4. WHEN the user clicks `Logout` OR any API request receives HTTP `401`, THE `AuthContext` SHALL immediately remove the token and user session from `sessionStorage`, reset in-memory auth state to `null`, and redirect to `/login`.
5. IF an authenticated `VIEWER` navigates directly to `/admin/imports`, THEN `ProtectedRoute` SHALL block access and render `ForbiddenPage` (`403 Access Denied`) with a button to return to `/customers`.

---

### Requirement 3: Customer Directory & Search (`/customers`)
**User Story:** As a wealth-service user, I want to search and filter customers so I can quickly locate a client and open their portfolio workspace.

#### Acceptance Criteria
1. WHEN `/customers` loads, THE page SHALL fetch `GET /api/v1/customers` with debounced `search` input (`300ms`) and filter dropdowns for `kyc_status` (`VERIFIED`, `PENDING`, `REVIEW`) and `segment` (`Mass`, `Affluent`, `HNI`).
2. THE directory table SHALL display `customer_id`, `full_name`, `email`, `city` & `state`, `kyc_status` badge, `segment` badge, and formatted `total_market_value`, paired with the reusable `Pagination` component (`page`, `limit`, `total_items`, `total_pages`).
3. WHEN a user clicks a customer row or `Open Workspace` action, THE application SHALL navigate to `/customers/:customerId`.

---

### Requirement 4: Customer Workspace & Consolidated Portfolio (`/customers/:customerId`)
**User Story:** As a wealth-service user, I want to inspect a customer's profile, risk summary, account valuations, asset-class allocation chart, and holdings positions.

#### Acceptance Criteria
1. THE `CustomerWorkspacePage` SHALL render a persistent `CustomerHeaderCard` displaying customer identity (`full_name`, `customer_id`, `email`, `phone`, `city`, `kyc_status`, `segment`), risk profile summary (`risk_level`, `risk_score`, `horizon_years`, `liquidity_need`), and accessible tab navigation (`Portfolio`, `Transactions`, `Goals`).
2. ON the `Portfolio` tab (`GET /api/v1/customers/:id/portfolio`), THE `PortfolioModule` SHALL render:
   - Data freshness metadata (`snapshot_date` and `price_as_of`).
   - 4 KPI cards: `Total Market Value`, `Total Cost Basis`, `Unrealised Gain/Loss` (INR and `%` color-coded), and `Active Accounts` count.
   - Account summary cards (`BROKERAGE`, `MUTUAL_FUND`, `RETIREMENT`) with provider, status badge, cost basis, market value, and P&L.
   - A responsive Recharts Donut chart visualizing `allocation_by_asset_class` with interactive tooltips and percentage legend.
   - A Holdings Positions table displaying `symbol`, `instrument_name`, `account_type`, `asset_class`, `quantity`, `avg_cost`, `last_price`, `cost_basis`, `market_value`, `unrealised_gain_loss`, and `unrealised_gain_loss_pct`, plus client-side symbol search and asset-class filter.
3. WHEN a customer holds zero positions (e.g., `C0001`), THE `PortfolioModule` SHALL display `₹0.00` KPI cards, zero-value account cards, and a clean `EmptyState` card.

---

### Requirement 5: Server-Side Filtered Transaction Ledger (`/customers/:customerId` — Transactions Tab)
**User Story:** As a wealth-service user, I want to filter, sort, and paginate a customer's transactions via backend query parameters.

#### Acceptance Criteria
1. ON the `Transactions` tab, THE `TransactionFiltersBar` SHALL provide controls for `account_id` (from customer accounts), `instrument_id` (from `GET /api/v1/instruments`), `transaction_type` (`BUY`, `SELL`, `DIVIDEND`, `FEE`), `status` (`SETTLED`, `PENDING`, `REVERSED`), `from_date`, `to_date`, and a `Reset Filters` button.
2. CHANGING any filter, sort column (`trade_date`, `amount`, `transaction_type`, `status`), sort direction (`asc`, `desc`), or page number SHALL query `GET /api/v1/customers/:id/transactions` on the server and reset `page` to `1` when filters change.
3. THE `TransactionsTable` SHALL display `transaction_id`, `trade_date`, `account_type` (`account_id`), `symbol` & `instrument_name`, `transaction_type` badge, `quantity`, `price`, `amount`, and `status` badge, accompanied by the reusable `Pagination` bar.

---

### Requirement 6: Financial Goal Monitoring & CRUD (`/customers/:customerId` — Goals Tab)
**User Story:** As a wealth-service user, I want to view goal progress, spot overdue or overfunded goals, create new goals, and update existing goals.

#### Acceptance Criteria
1. ON the `Goals` tab (`GET /api/v1/customers/:id/goals`), EACH `GoalCard` SHALL display `goal_name`, `goal_type` badge, `priority` badge, `target_date`, `current_funded_amount` vs `target_amount`, an accessible progress bar (`role="progressbar"`, `aria-valuenow` clamped `0..100` while showing exact `funded_percentage`), an `Overdue` danger badge when `is_overdue === true`, and an `Overfunded` warning badge when `is_overfunded === true`.
2. CLICKING `Add Goal` SHALL open `GoalFormModal` (`POST /api/v1/customers/:id/goals`) validating `goal_name` (min 2 chars), `goal_type`, `priority`, `target_amount > 0`, `current_funded_amount >= 0`, and `target_date` (`YYYY-MM-DD`).
3. CLICKING `Edit` on a goal card SHALL open `GoalFormModal` pre-filled with that goal's values and submit `PATCH /api/v1/goals/:goalId`, refreshing the goals list and showing a confirmation toast.

---

### Requirement 7: Admin CSV Transaction Ingestion (`/admin/imports`)
**User Story:** As an operations administrator, I want to upload a transactions CSV file and inspect imported vs. quarantined anomaly rows.

#### Acceptance Criteria
1. THE `AdminImportPage` SHALL render `CsvDropzone` accepting `.csv` files up to `5 MB`, along with the expected CSV column list (`transaction_id`, `account_id`, `instrument_id`, `transaction_type`, `trade_date`, `quantity`, `price`, `amount`, `status`).
2. SUBMITTING a file SHALL send `multipart/form-data` to `POST /api/v1/admin/imports/transactions` with an accessible loading state.
3. ON HTTP `200`, `ImportResultPanel` SHALL display batch reconciliation KPIs (`batch_id`, `file_name`, `total_rows`, `imported_rows`, `rejected_rows`) and, when `rejections.length > 0`, a Quarantine Exceptions table showing `row_number`, `record_identifier`, `error_code` badge, and `error_reason`.
4. ON HTTP `409` (`DUPLICATE_FILE_UPLOAD`) or `400` (`INVALID_CSV_FORMAT`), THE page SHALL display an `ErrorBanner` explaining the rejection reason.

---

## 3. Non-Functional & Coding Standards
1. **Zero Verbal Strings in Components:** All user-facing copy, page titles, subtitles, button labels, empty-state text, validation messages, toast messages, and `aria-label` strings SHALL live in `src/constants/ui.constants.ts`.
2. **Enums & Strict Interfaces:** All domain enumerations SHALL be defined as TypeScript `enum`s in `src/constants/domain.constants.ts`, and all DTOs, props, and context contracts SHALL be defined as `interface`s in `src/types/` with `strict: true` and zero `any` types.
3. **Module Segregation & Component Size Cap:** Reusable UI primitives (`Badge`, `Button`, `Card`, `EmptyState`, `ErrorBanner`, `Modal`, `Pagination`, `Skeleton`) SHALL live in `src/components/reusables/`. Feature components SHALL be segregated by business domain (`auth`, `customers`, `portfolio`, `transactions`, `goals`, `admin`), and EVERY component file MUST stay concise and readable (**strictly under 300 lines**, never exceeding 500 lines).
4. **Accessibility:** Every interactive element, form field, progress bar, and dialog MUST include semantic HTML elements and `aria-label` attributes sourced from `UI_CONSTANTS`.
5. **Automated Testing:** Include Vitest + React Testing Library tests covering formatters, route protection/logout, portfolio rendering, goal form validation, and CSV import quarantine display.