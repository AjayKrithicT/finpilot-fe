/**
 * routes.constants.ts
 * All client-side route paths and API endpoint builders.
 * Never hardcode paths or URL segments in component logic.
 *
 * API_ENDPOINTS contains only the path segments AFTER the base URL.
 * The base URL (including /api/v1) lives in apiClient.ts via VITE_API_BASE_URL.
 */

// ── App Routes ───────────────────────────────────────────────────────────────

export const APP_ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  CUSTOMERS: '/customers',
  CUSTOMER_WORKSPACE: (customerId: string) => `/customers/${customerId}`,
  ADMIN_IMPORTS: '/admin/imports',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '*',
} as const;

// ── API Endpoint Builders ────────────────────────────────────────────────────
// These are path segments appended to VITE_API_BASE_URL (e.g. http://localhost:8000/api/v1).
// Do NOT include /api/v1 here — it is already part of the base URL.

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (customerId: string) => `/customers/${customerId}`,

  // Portfolio
  CUSTOMER_PORTFOLIO: (customerId: string) =>
    `/customers/${customerId}/portfolio`,
  CUSTOMER_PORTFOLIO_POSITIONS: (customerId: string) =>
    `/customers/${customerId}/portfolio/positions`,

  // Transactions
  CUSTOMER_TRANSACTIONS: (customerId: string) =>
    `/customers/${customerId}/transactions`,
  INSTRUMENTS: '/instruments',

  // Goals
  CUSTOMER_GOALS: (customerId: string) => `/customers/${customerId}/goals`,
  GOAL: (goalId: string) => `/goals/${goalId}`,

  // Admin
  ADMIN_IMPORT_TRANSACTIONS: '/admin/imports/transactions',
  ADMIN_IMPORT_REJECTIONS: (batchId: string) =>
    `/admin/imports/transactions/${batchId}/rejections`,
} as const;
