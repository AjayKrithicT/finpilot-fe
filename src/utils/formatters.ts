/**
 * formatters.ts
 * Pure formatting utilities for INR currency, signed P&L, percentages,
 * dates, and plain numbers. No side effects, no imports from React.
 * All monetary output uses tabular-nums-compatible en-IN grouping.
 */

// ── INR Currency Formatter ────────────────────────────────────────────────────

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as INR currency using en-IN grouping.
 * Example: 263088.49 → "₹2,63,088.49"
 */
export function formatINR(amount: number): string {
  return INR_FORMATTER.format(amount);
}

/**
 * Formats a number as signed INR currency.
 * Positive: "+₹21,588.49"  Negative: "-₹1,240.00"  Zero: "₹0.00"
 */
export function formatSignedINR(amount: number): string {
  if (amount === 0) return INR_FORMATTER.format(0);
  const formatted = INR_FORMATTER.format(Math.abs(amount));
  return amount > 0 ? `+${formatted}` : `-${formatted}`;
}

// ── Percentage Formatter ──────────────────────────────────────────────────────

/**
 * Formats a number as a percentage to 2 decimal places.
 * @param value  - The numeric value (e.g. 8.94 for 8.94%)
 * @param signed - When true, prepends "+" for positive values
 * Example: formatPercent(8.94) → "8.94%"
 *          formatPercent(8.94, true) → "+8.94%"
 *          formatPercent(-3.21, true) → "-3.21%"
 */
export function formatPercent(value: number, signed = false): string {
  const fixed = Math.abs(value).toFixed(2) + '%';
  if (!signed) return value < 0 ? `-${fixed}` : fixed;
  if (value > 0) return `+${fixed}`;
  if (value < 0) return `-${fixed}`;
  return fixed;
}

// ── Date Formatter ────────────────────────────────────────────────────────────

const DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/**
 * Formats an ISO date string (YYYY-MM-DD or ISO-8601) to a readable label.
 * Example: "2024-03-15" → "15 Mar 2024"
 * Returns "—" for null, undefined, or unparseable input.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return DATE_FORMATTER.format(date);
}

// ── Plain Number Formatter ────────────────────────────────────────────────────

const NUMBER_FORMATTER = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a number with en-IN grouping and 2 decimal places (no currency symbol).
 * Example: 263088.49 → "2,63,088.49"
 */
export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

/**
 * Formats a quantity (integer-like) with en-IN grouping, no decimals.
 * Example: 1500 → "1,500"
 */
export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}
