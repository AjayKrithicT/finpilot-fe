/**
 * apiClient.ts
 * Centralized typed fetch wrapper.
 * - Injects Bearer JWT from sessionStorage on every request.
 * - Normalizes backend { error: { code, message, details, request_id } }
 *   and network failures into a single ApiClientError.
 * - Calls a registered onUnauthorized callback on HTTP 401 so AuthContext
 *   can tear down the session without a circular import.
 */

import { STORAGE_KEYS } from '../constants/theme.constants';
import type { ApiErrorEnvelope } from '../types/common.types';

// ── 401 handler registration ──────────────────────────────────────────────────

type UnauthorizedHandler = () => void;
let _onUnauthorized: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(fn: UnauthorizedHandler): void {
  _onUnauthorized = fn;
}

// ── Typed error class ─────────────────────────────────────────────────────────

export class ApiClientError extends Error {
  readonly code: string;
  readonly details: { field: string; issue: string }[];
  readonly requestId: string;
  readonly httpStatus: number;

  constructor(
    message: string,
    code: string,
    httpStatus: number,
    details: { field: string; issue: string }[] = [],
    requestId = '',
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
    this.requestId = requestId;
  }
}

// ── Query string builder ──────────────────────────────────────────────────────

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

// ── Core request function ─────────────────────────────────────────────────────

const API_BASE_URL = (
  import.meta.env['VITE_API_BASE_URL'] as string | undefined
) ?? '/api/v1';

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

  const headers: Record<string, string> = {
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined ?? {}),
  };

  // Path may already be absolute (e.g. from API_ENDPOINTS) or relative
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (networkErr) {
    throw new ApiClientError(
      networkErr instanceof Error ? networkErr.message : 'Network error',
      'NETWORK_ERROR',
      0,
    );
  }

  // 401 → tear down session
  if (response.status === 401) {
    _onUnauthorized?.();
    throw new ApiClientError('Unauthorized', 'UNAUTHORIZED', 401);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let body: unknown;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const envelope = body as ApiErrorEnvelope;
    const err = envelope?.error;
    throw new ApiClientError(
      err?.message ?? `HTTP ${response.status}`,
      err?.code ?? 'API_ERROR',
      response.status,
      err?.details ?? [],
      err?.request_id ?? '',
    );
  }

  return body as T;
}

// ── Public API ────────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string): Promise<T> =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  postForm: <T>(path: string, form: FormData): Promise<T> =>
    request<T>(path, {
      method: 'POST',
      body: form,
    }),
};
