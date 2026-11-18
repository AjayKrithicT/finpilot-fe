# Design Document — FinPilot Frontend Web Application

## Overview
FinPilot Frontend is a React + TypeScript (`strict: true`) single-page application built with Vite, Tailwind CSS v4 (`docs/design_tokens.md`), React Router, Recharts, and Lucide Icons. It integrates with the FinPilot REST API (`/api/v1`) through a centralized typed `fetch` client (`src/services/apiClient.ts`) and manages authentication and toast notifications via React Context API (`AuthContext`, `ToastContext`) without Redux.

### Core Engineering Goals
- **Executive Visual Craft:** Implements `docs/design_tokens.md` and `public/assets/` SVGs for a crisp, aligned, high-contrast wealth-operations interface.
- **Zero Hardcoded UI Copy or Magic Values:** Separates all route/API constants (`routes.constants.ts`), domain `enum`s (`domain.constants.ts`), theme/chart maps (`theme.constants.ts`), and all UI copy, labels, and `aria-label` strings (`ui.constants.ts`) from component logic.
- **Modular Domain Segregation:** Places shared UI primitives in `src/components/reusables/` and isolates domain panels into `auth`, `customers`, `portfolio`, `transactions`, `goals`, and `admin` folders, keeping every component file well under 300 lines.
- **Security & Route Hygiene:** Enforces JWT authentication, role-based access (`VIEWER` vs. `ADMIN`), automatic `401` session teardown, and complete `sessionStorage` cleanup on logout.

---

## Architecture

### Unidirectional Layer Flow
```text
[Pages & Route Guards]     --> Route composition, URL params, Auth & Role protection
         │
         ▼
[Domain Modules]           --> Auth, Customers, Portfolio, Transactions, Goals, Admin
         │
         ▼
[Reusables & Context]      --> src/components/reusables/*, AuthContext, ToastContext
         │
         ▼
[Typed API Services]       --> auth.api, customer.api, portfolio.api, transaction.api, goal.api, import.api
         │
         ▼
[Centralized apiClient]    --> VITE_API_BASE_URL, Bearer JWT injection, 401 handler, ApiClientError
```

### Project Folder & File Structure
```text
finpilot-fe/
├── docs/
│   └── design_tokens.md                  # Color tokens, typography, spacing & accessibility specs
├── public/
│   └── assets/
│       ├── finpilot-logo.svg             # Horizontal brand logo for header & login
│       ├── finpilot-mark.svg             # Browser favicon & compact brand icon
│       └── login-bg.svg                  # Geometric aurora backdrop for /login
├── src/
│   ├── constants/
│   │   ├── routes.constants.ts           # APP_ROUTES & API_ENDPOINTS builders
│   │   ├── domain.constants.ts           # Domain TypeScript enums, label maps, sort & page defaults
│   │   ├── theme.constants.ts            # ASSET_CLASS_COLORS, badge variant maps, CSV upload limits
│   │   └── ui.constants.ts               # All UI copy, greetings, titles, button labels, errors & aria-labels
│   ├── types/
│   │   ├── common.types.ts               # PaginationMeta, PaginatedResponse<T>, ApiErrorPayload, BadgeTone
│   │   ├── auth.types.ts                 # AuthUser, LoginRequest, LoginResponse, AuthContextValue
│   │   ├── customer.types.ts             # CustomerSummary, RiskProfile, AccountSummary, CustomerDetail
│   │   ├── portfolio.types.ts            # PortfolioTotals, AccountAllocation, AssetClassAllocation, PortfolioPosition, PortfolioResponse
│   │   ├── transaction.types.ts          # TransactionItem, TransactionFilters, InstrumentOption
│   │   ├── goal.types.ts                 # GoalItem, CreateGoalPayload, UpdateGoalPayload
│   │   └── import.types.ts               # ImportRejectionItem, ImportBatchResponse
│   ├── utils/
│   │   ├── formatters.ts                 # formatINR, formatSignedINR, formatPercent, formatDate, formatNumber
│   │   └── validators.ts                 # Pure validation functions for Login, Goal form & CSV files
│   ├── services/
│   │   ├── apiClient.ts                  # Typed fetch wrapper, Bearer token injection, 401 teardown & ApiClientError
│   │   ├── auth.api.ts                   # loginUser()
│   │   ├── customer.api.ts               # fetchCustomers(), fetchCustomerDetail()
│   │   ├── portfolio.api.ts              # fetchCustomerPortfolio()
│   │   ├── transaction.api.ts            # fetchCustomerTransactions(), fetchInstruments()
│   │   ├── goal.api.ts                   # fetchCustomerGoals(), createCustomerGoal(), updateGoal()
│   │   └── import.api.ts                 # uploadTransactionsCsv()
│   ├── context/
│   │   ├── AuthContext.tsx               # Session persistence (sessionStorage), login(), logout(), isAdmin
│   │   └── ToastContext.tsx              # Accessible aria-live notification queue
│   ├── components/
│   │   ├── reusables/
│   │   │   ├── Badge.tsx                 # Semantic status/role/KYC/segment pill with aria-label
│   │   │   ├── Button.tsx                # Accessible primary, secondary, ghost & danger buttons
│   │   │   ├── Card.tsx                  # Standard surface container with header & action slots
│   │   │   ├── EmptyState.tsx            # Structured zero-data state with icon, title, message & CTA
│   │   │   ├── ErrorBanner.tsx           # Inline API error alert (role="alert") with Retry button
│   │   │   ├── Modal.tsx                 # Escape-closable dialog (role="dialog", aria-modal="true")
│   │   │   ├── Pagination.tsx            # Reusable server-synced pagination bar with aria-labels
│   │   │   └── Skeleton.tsx              # Dimension-matched loading skeletons for KPIs & tables
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Top navigation bar with logo, role links, user badge & Logout
│   │   │   ├── AppShell.tsx              # Persistent Navbar + max-w-[1440px] main landmark
│   │   │   └── ProtectedRoute.tsx        # Auth check + optional allowedRoles guard
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx             # Email/password form with validation & accessible labels
│   │   │   └── DemoCredentialCard.tsx    # One-click VIEWER & ADMIN credential selector
│   │   ├── customers/
│   │   │   ├── CustomerFilters.tsx       # Debounced search input + KYC & Segment selectors
│   │   │   ├── CustomerTable.tsx         # Paginated directory table with INR market value
│   │   │   └── CustomerHeaderCard.tsx    # Workspace customer summary & risk profile banner
│   │   ├── portfolio/
│   │   │   ├── PortfolioKpiGrid.tsx      # 4 summary KPI cards + snapshot/price freshness bar
│   │   │   ├── AccountSummaryCards.tsx   # Per-account valuation & unrealised P&L cards
│   │   │   ├── AssetAllocationChart.tsx  # Recharts responsive Donut chart + breakdown legend
│   │   │   ├── PositionsTable.tsx        # Filterable holdings positions table
│   │   │   └── PortfolioModule.tsx       # Orchestrates portfolio fetch, skeletons, empty & populated views
│   │   ├── transactions/
│   │   │   ├── TransactionFiltersBar.tsx # Account, Instrument, Type, Status, Date range & Reset
│   │   │   ├── TransactionsTable.tsx     # Server-sorted & paginated ledger table
│   │   │   └── TransactionsModule.tsx    # Orchestrates server-filtered ledger & instruments lookup
│   │   ├── goals/
│   │   │   ├── GoalCard.tsx              # Goal progress bar, funded %, Overdue & Overfunded badges
│   │   │   ├── GoalFormModal.tsx         # Shared Create / Edit goal modal with inline validation
│   │   │   └── GoalsModule.tsx           # Orchestrates goal list, empty state & Create/Edit modal
│   │   └── admin/
│   │       ├── CsvDropzone.tsx           # .csv drag-and-drop / file picker with size/type validation
│   │       └── ImportResultPanel.tsx     # Batch summary KPIs + quarantined rejections table
│   ├── pages/
│   │   ├── LoginPage.tsx                 # Branded split-screen sign-in page (`/login`)
│   │   ├── CustomersPage.tsx             # Customer directory view (`/customers`)
│   │   ├── CustomerWorkspacePage.tsx     # Customer workspace with Portfolio / Transactions / Goals tabs
│   │   ├── AdminImportPage.tsx           # Role-restricted CSV ingestion console (`/admin/imports`)
│   │   ├── ForbiddenPage.tsx             # 403 Access Denied view for unauthorized roles
│   │   └── NotFoundPage.tsx              # 404 Route Not Found view
│   ├── App.tsx                           # BrowserRouter + AuthProvider + ToastProvider + Route definitions
│   ├── main.tsx                          # React root mount
│   └── index.css                         # Tailwind v4 `@import "tailwindcss"` + `@theme` design tokens
├── tests/
│   ├── formatters.unit.test.ts           # INR currency, signed P&L, percentage & date formatting tests
│   ├── ProtectedRoute.test.tsx           # Auth redirect, logout cleanup & VIEWER vs ADMIN guard tests
│   ├── PortfolioView.test.tsx            # Populated vs empty portfolio rendering tests
│   ├── GoalFormModal.test.tsx            # Client-side goal validation & submit payload tests
│   └── AdminImportPage.test.tsx          # CSV upload & anomaly quarantine table rendering tests
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## Components and Interfaces

### Constants Architecture (`src/constants/`)
- **`domain.constants.ts` (TypeScript `enum`s & Label Maps):**
  - Defines `enum UserRole { VIEWER = 'VIEWER', ADMIN = 'ADMIN' }`, `enum KycStatus { VERIFIED = 'VERIFIED', PENDING = 'PENDING', REVIEW = 'REVIEW' }`, `enum CustomerSegment { MASS = 'Mass', AFFLUENT = 'Affluent', HNI = 'HNI' }`, `enum AccountType { BROKERAGE = 'BROKERAGE', MUTUAL_FUND = 'MUTUAL_FUND', RETIREMENT = 'RETIREMENT' }`, `enum AccountStatus { ACTIVE = 'ACTIVE', DORMANT = 'DORMANT', CLOSED = 'CLOSED' }`, `enum AssetClass { EQUITY = 'EQUITY', ETF = 'ETF', MUTUAL_FUND = 'MUTUAL_FUND', BOND = 'BOND', REIT = 'REIT', GSEC = 'GSEC' }`, `enum TransactionType { BUY = 'BUY', SELL = 'SELL', DIVIDEND = 'DIVIDEND', FEE = 'FEE' }`, `enum TransactionStatus { SETTLED = 'SETTLED', PENDING = 'PENDING', REVERSED = 'REVERSED' }`, `enum GoalType { WEALTH_CREATION = 'WEALTH_CREATION', EMERGENCY_FUND = 'EMERGENCY_FUND', EDUCATION = 'EDUCATION', HOME_PURCHASE = 'HOME_PURCHASE', RETIREMENT = 'RETIREMENT', TRAVEL = 'TRAVEL' }`, `enum PriorityLevel { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }`, `enum RiskLevel { CONSERVATIVE = 'Conservative', MODERATE = 'Moderate', GROWTH = 'Growth', AGGRESSIVE = 'Aggressive' }`, `enum LiquidityNeed { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }`, and `enum SortDirection { ASC = 'asc', DESC = 'desc' }`.
  - Exports `PAGINATION_DEFAULTS = { PAGE: 1, LIMIT: 20, LIMIT_OPTIONS: [10, 20, 50] } as const`.
- **`ui.constants.ts` (All User-Facing Copy & Accessibility Labels):**
  - Centralizes `UI_COPY` grouped by domain (`APP`, `NAV`, `LOGIN`, `CUSTOMERS`, `WORKSPACE`, `PORTFOLIO`, `TRANSACTIONS`, `GOALS`, `ADMIN_IMPORT`, `ERRORS`, `ARIA_LABELS`) so JSX components reference `UI_COPY.*` rather than inline string literals.
- **`routes.constants.ts` & `theme.constants.ts`:**
  - `APP_ROUTES` and `API_ENDPOINTS` builders; `ASSET_CLASS_COLORS`, `BADGE_TONE_CLASSES`, `CSV_UPLOAD_RULES`, and `STORAGE_KEYS` (`TOKEN: 'finpilot_access_token'`, `USER: 'finpilot_auth_user'`).

### Reusable UI Kit (`src/components/reusables/`)
Every component in `src/components/reusables/` is stateless, domain-agnostic, strictly typed with TypeScript `interface`s, and under 120 lines:
- `Badge.tsx`: Renders semantic status/KYC/segment/role pills (`success`, `danger`, `warning`, `info`, `neutral`) with `aria-label`.
- `Button.tsx`: Accessible button supporting `primary`, `secondary`, `ghost`, and `danger` variants, `isLoading` spinner state, and `focus-visible` ring.
- `Card.tsx`: Consistent surface container (`bg-white border border-slate-200 rounded-xl shadow-xs`) with optional title, subtitle, and header action slot.
- `Pagination.tsx`: Reusable server-synchronized pagination bar displaying item range (`Showing 1–20 of 120`), page-size selector, and accessible `Previous` / `Next` buttons.
- `Modal.tsx`: Accessible modal overlay (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `Escape` key handler, backdrop click close).
- `EmptyState.tsx`, `ErrorBanner.tsx`, and `Skeleton.tsx`: Standardized zero-data, error-retry, and loading states.

### Security & Session Lifecycle (`src/context/AuthContext.tsx` & `src/services/apiClient.ts`)
- **Token Storage:** Stores `access_token` and serialized `AuthUser` in `sessionStorage` under `STORAGE_KEYS` (automatically cleared when browser tab closes).
- **Explicit Logout (`logout()`):** Clears `STORAGE_KEYS.TOKEN` and `STORAGE_KEYS.USER` from `sessionStorage`, resets React state (`token = null`, `user = null`), dispatches a logout confirmation toast, and redirects to `APP_ROUTES.LOGIN` with `{ replace: true }`.
- **Automatic `401` Interceptor:** `apiClient` invokes a registered `onUnauthorized` handler whenever the backend responds with HTTP `401`, tearing down stale session credentials immediately.

---

## Data Models
All interfaces in `src/types/` mirror the backend OpenAPI contract with zero `any` types:
- **`AuthUser`, `LoginRequest`, `LoginResponse` (`auth.types.ts`):** `user_id`, `email`, `full_name`, `role: UserRole`, `access_token`, `token_type`, `expires_in`.
- **`CustomerSummary`, `CustomerDetail`, `RiskProfile`, `AccountSummary` (`customer.types.ts`):** Typed customer directory rows, risk assessment metrics, and account cards.
- **`PortfolioResponse`, `PortfolioTotals`, `AccountAllocation`, `AssetClassAllocation`, `PortfolioPosition` (`portfolio.types.ts`):** Consolidated valuation, account rollups, chart slices, and holding positions.
- **`TransactionItem`, `TransactionFilters`, `InstrumentOption` (`transaction.types.ts`):** Server-side query filter parameters and transaction ledger rows.
- **`GoalItem`, `CreateGoalPayload`, `UpdateGoalPayload` (`goal.types.ts`):** Goal progress metrics including `funded_percentage`, `is_overdue`, and `is_overfunded`.
- **`ImportBatchResponse`, `ImportRejectionItem` (`import.types.ts`):** Batch ingestion totals and row-level anomaly quarantine items.

---

## Correctness Properties
1. **Zero Hardcoded UI Copy & Zero `any` Types:** All visible labels, headings, button captions, empty/error states, and `aria-label` strings MUST resolve from `src/constants/ui.constants.ts`, and TypeScript compilation (`tsc --noEmit`) MUST pass with `strict: true` and zero `any` types.
2. **Session & RBAC Security Invariant:** Clicking `Logout` or receiving HTTP `401` MUST purge `sessionStorage` keys and reset `isAuthenticated` to `false`. Users with `UserRole.VIEWER` MUST NOT see `Admin Imports` in `Navbar` and MUST be blocked by `ProtectedRoute` (`allowedRoles={[UserRole.ADMIN]}`) onto `ForbiddenPage`.
3. **Component Size & Modularity Bound:** Every `.tsx` component file across `reusables/`, `layout/`, `auth/`, `customers/`, `portfolio/`, `transactions/`, `goals/`, and `admin/` MUST stay focused on a single responsibility and remain under **300 lines of code**.
4. **Server-Side Filter & Pagination Reset:** Changing any filter in `TransactionFiltersBar` or `CustomerFilters` MUST reset `page` to `1` before issuing the API request so displayed items and `Pagination` metadata remain synchronized.
5. **Goal Progress Clamping vs. Overfunded Display:** `GoalCard` progress bar fill width MUST clamp to `Math.min(100, Math.max(0, goal.funded_percentage))` while rendering the exact numeric `funded_percentage` and `Overfunded` badge when `goal.is_overfunded === true`.

---

## Error Handling
1. **`ApiClientError` (`src/services/apiClient.ts`):** Normalizes backend `{ error: { code, message, details, request_id } }` responses and network failures into a single typed error class.
2. **Global `401` Session Expiry:** Clears `sessionStorage`, shows `UI_COPY.ERRORS.SESSION_EXPIRED`, and redirects to `/login`.
3. **Field-Level Form Validation:** `GoalFormModal` and `LoginForm` validate inputs via `src/utils/validators.ts` prior to submission and map backend `details` (`[{ field, issue }]`) onto individual form inputs with `aria-invalid="true"`.
4. **CSV Import Exceptions (`409` / `400`):** `AdminImportPage` renders `ErrorBanner` for duplicate file uploads (`DUPLICATE_FILE_UPLOAD`) or malformed headers (`INVALID_CSV_FORMAT`), and `ImportResultPanel` renders all row-level anomalies in an accessible quarantine table.

---

## Testing Strategy
Automated tests run via **Vitest** and **React Testing Library** (`npm test` with `jsdom`):
1. **`tests/formatters.unit.test.ts`:** Verifies `formatINR`, `formatSignedINR`, `formatPercent`, and `formatDate` across positive, negative, zero, and null inputs.
2. **`tests/ProtectedRoute.test.tsx`:** Verifies unauthenticated users redirect to `/login`, `Logout` clears `sessionStorage`, `VIEWER` users are blocked from `ADMIN` routes, and `ADMIN` users render protected pages.
3. **`tests/PortfolioView.test.tsx`:** Verifies populated portfolio KPI cards/positions render accurately and zero-position portfolios render `₹0.00` KPIs and `EmptyState` cleanly.
4. **`tests/GoalFormModal.test.tsx`:** Verifies client-side validation blocks `target_amount <= 0` or negative `current_funded_amount` and submits valid payloads.
5. **`tests/AdminImportPage.test.tsx`:** Verifies `.csv` file validation and renders batch counts + quarantined anomaly rows (`error_code` and `error_reason`) upon upload completion.