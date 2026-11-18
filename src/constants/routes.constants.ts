/**
 * routes.constants.ts
 * All client-side route paths and API endpoint builders.
 * Never hardcode paths or URL segments in component logic.
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

const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_BASE}/auth/login`,

  // Customers
  CUSTOMERS: `${API_BASE}/customers`,
  CUSTOMER_DETAIL: (customerId: string) =>
    `${API_BASE}/customers/${customerId}`,

  // Portfolio
  CUSTOMER_PORTFOLIO: (customerId: string) =>
    `${API_BASE}/customers/${customerId}/portfolio`,

  // Transactions
  CUSTOMER_TRANSACTIONS: (customerId: string) =>
    `${API_BASE}/customers/${customerId}/transactions`,
  INSTRUMENTS: `${API_BASE}/instruments`,

  // Goals
  CUSTOMER_GOALS: (customerId: string) =>
    `${API_BASE}/customers/${customerId}/goals`,
  GOAL: (goalId: string) => `${API_BASE}/goals/${goalId}`,

  // Admin
  ADMIN_IMPORT_TRANSACTIONS: `${API_BASE}/admin/imports/transactions`,
} as const;
