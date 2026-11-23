# FinPilot — Frontend

React 19 · TypeScript · Vite · Tailwind CSS v4

UI for the FinPilot Investment Portfolio & Goal Monitoring Platform.  
Runs at `http://localhost:5173` in development.

---

## Prerequisites

| Requirement | Minimum version |
|-------------|-----------------|
| Node.js | 20 LTS |
| npm | 10 |

The backend API must be running at `http://localhost:8000` before starting the frontend. See `finpilot-be/README.md` for backend setup.

---

## 1. Environment configuration

Copy the example file:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Full base URL for the API including `/api/v1` | Unset in development — Vite proxies `/api` to `http://localhost:8000` automatically |

In development you can leave `.env` empty or omit `VITE_API_BASE_URL` entirely. The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`. For a production build, set `VITE_API_BASE_URL=https://your-api-host/api/v1`.

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:3000`.

---

## 4. Build for production

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static file host or preview locally:

```bash
npm run preview
```

---

## 5. Run tests

```bash
npx vitest run
```

Tests live in `tests/` and cover: `ProtectedRoute` access control, `GoalFormModal` create/edit validation, `AdminImportPage` upload flow, `PortfolioView` rendering, and `formatters` utility functions.

---

## 6. Lint

```bash
npm run lint
```

---

## 7. Demo credentials

Use the credentials set in the backend `.env` during seeding:

| Role | Default email | Default password |
|------|---------------|------------------|
| ADMIN | `admin@finpilot.local` | *(set in backend .env)* |
| VIEWER | `viewer@finpilot.local` | *(set in backend .env)* |

The login page includes one-click autofill cards for both accounts.

---

## 8. Application routes

| Path | Access | Description |
|------|--------|-------------|
| `/login` | Public | Sign-in page |
| `/customers` | VIEWER + | Customer search and list |
| `/customers/:id` | VIEWER + | Customer workspace — Portfolio / Transactions / Goals tabs |
| `/admin/imports` | ADMIN only | CSV transaction import console |
| `/forbidden` | Authenticated | Shown when a VIEWER accesses an ADMIN-only route |

---

## 9. Docker

Requires the backend already running (via its own `docker compose` or `npm run dev`).

```bash
docker compose up --build
```

Serves the production Vite build via Nginx at `http://localhost:3000`.  
Nginx proxies `/api/*` to the backend on the host at port `8000`.

```bash
docker compose down
```

---

## 10. Project structure

```
finpilot-fe/
├── public/             Static assets (logo SVGs)
├── src/
│   ├── components/
│   │   ├── reusables/  Badge, Button, Card, EmptyState, ErrorBanner,
│   │   │               Modal, Pagination, Skeleton
│   │   ├── layout/     AppShell, Navbar, ProtectedRoute
│   │   ├── auth/       LoginForm
│   │   ├── customers/  CustomerFilters, CustomerTable, CustomerHeaderCard
│   │   ├── portfolio/  PortfolioKpiGrid, AccountSummaryCards,
│   │   │               AssetAllocationChart, PositionsTable, PortfolioModule
│   │   ├── transactions/ TransactionFiltersBar, TransactionsTable,
│   │   │                 TransactionsModule
│   │   ├── goals/      GoalCard, GoalFormModal, GoalsModule
│   │   └── admin/      CsvDropzone, ImportResultPanel
│   ├── constants/      routes, domain enums, theme tokens, UI copy
│   ├── context/        AuthContext, ToastContext
│   ├── pages/          LoginPage, CustomersPage, CustomerWorkspacePage,
│   │                   AdminImportPage, ForbiddenPage, NotFoundPage
│   ├── services/       apiClient, auth/customer/portfolio/
│   │                   transaction/goal/import API modules
│   ├── types/          Per-domain TypeScript interfaces
│   └── utils/          formatters (INR, percent, date), form validators
└── tests/
    ├── ProtectedRoute.test.tsx
    ├── GoalFormModal.test.tsx
    ├── AdminImportPage.test.tsx
    ├── PortfolioView.test.tsx
    ├── formatters.unit.test.ts
    └── setup.ts
```
