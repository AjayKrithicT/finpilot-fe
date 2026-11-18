/**
 * formatters.unit.test.ts
 * Unit tests for formatINR, formatSignedINR, formatPercent, and formatDate.
 * Tests positive, negative, zero, and null/undefined inputs.
 */

import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatSignedINR,
  formatPercent,
  formatDate,
  formatNumber,
  formatQuantity,
} from '../src/utils/formatters';

describe('formatINR', () => {
  it('formats a positive amount with en-IN grouping and ₹ symbol', () => {
    const result = formatINR(263088.49);
    expect(result).toContain('₹');
    expect(result).toContain('2,63,088.49');
  });

  it('formats zero as ₹0.00', () => {
    expect(formatINR(0)).toContain('0.00');
  });

  it('formats a negative amount with minus sign', () => {
    const result = formatINR(-1240);
    expect(result).toContain('-');
    expect(result).toContain('1,240.00');
  });

  it('always renders two decimal places', () => {
    expect(formatINR(100)).toContain('100.00');
  });
});

describe('formatSignedINR', () => {
  it('prefixes "+" for positive amounts', () => {
    const result = formatSignedINR(21588.49);
    expect(result.startsWith('+')).toBe(true);
    expect(result).toContain('21,588.49');
  });

  it('prefixes "-" for negative amounts', () => {
    const result = formatSignedINR(-1240);
    expect(result.startsWith('-')).toBe(true);
    expect(result).toContain('1,240.00');
  });

  it('renders zero without sign prefix', () => {
    const result = formatSignedINR(0);
    expect(result.startsWith('+')).toBe(false);
    expect(result.startsWith('-')).toBe(false);
    expect(result).toContain('0.00');
  });
});

describe('formatPercent', () => {
  it('formats a positive value to 2 decimal places with % suffix', () => {
    expect(formatPercent(8.94)).toBe('8.94%');
  });

  it('formats a negative value with minus prefix', () => {
    expect(formatPercent(-3.21)).toBe('-3.21%');
  });

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('adds "+" prefix when signed=true and value is positive', () => {
    expect(formatPercent(8.94, true)).toBe('+8.94%');
  });

  it('keeps "-" prefix when signed=true and value is negative', () => {
    expect(formatPercent(-3.21, true)).toBe('-3.21%');
  });

  it('no sign for zero when signed=true', () => {
    expect(formatPercent(0, true)).toBe('0.00%');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to a human-readable label', () => {
    const result = formatDate('2024-03-15');
    expect(result).toContain('2024');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
  });

  it('returns "—" for null input', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns "—" for undefined input', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatNumber', () => {
  it('formats with en-IN grouping and 2 decimal places', () => {
    const result = formatNumber(263088.49);
    expect(result).toBe('2,63,088.49');
  });
});

describe('formatQuantity', () => {
  it('formats integer quantities with en-IN grouping', () => {
    const result = formatQuantity(1500);
    expect(result).toBe('1,500');
  });
});
