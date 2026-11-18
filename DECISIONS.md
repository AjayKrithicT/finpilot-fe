# DECISIONS.md — FinPilot Frontend

## Assumptions

- `sessionStorage` is the right token store for an internal ops tool — credentials are tab-scoped and clear automatically on tab close.
- Fresh API reads on every navigation and filter change; no client-side cache layer. Keeps data consistent with the server without cache invalidation complexity.
- Portfolio positions are filtered client-side (symbol / asset-class) because per-customer position counts are small. Transactions (4,550+ rows) are filtered and paginated server-side.
- The instruments list is fetched once per `TransactionsModule` mount to populate the filter dropdown; it is not cached across tabs.
- `VITE_API_BASE_URL` defaults to `/api/v1` (Vite dev-proxy); overridden at build time via `.env`.

## Deliberate Omissions

- **Dark-mode** — design tokens are light-mode only in v1.
- **WebSocket / live price updates** — prices are static values from the last seed run.
- **PDF / CSV export** — no report export in v1.
- **Infinite scroll** — transactions use page-based pagination via the `Pagination` component.
- **Full WCAG 2.1 AA audit** — semantic HTML, `aria-label`, `aria-invalid`, and `aria-describedby` are used throughout but a formal accessibility audit has not been performed.

## Known Limitations

- **Mobile layout partial** — `overflow-x-auto` scroll wrappers and responsive padding steps are in place; a fully mobile-optimised layout (collapsed navbar, touch-friendly interactions) is deferred.
- **No E2E tests** — only unit and component tests are present; Playwright / Cypress coverage is deferred.
