/**
 * AdminImportPage.test.tsx
 * Tests:
 *  1. Page renders dropzone and required columns list
 *  2. Selecting a valid CSV file shows the Upload button
 *  3. Invalid file type shows validation error
 *  4. File exceeding size limit shows validation error
 *  5. Successful upload renders ImportResultPanel with batch KPIs
 *  6. Successful upload with rejections renders quarantine table rows
 *  7. 409 DUPLICATE_FILE_UPLOAD renders ErrorBanner
 *  8. 400 INVALID_CSV_FORMAT renders ErrorBanner
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminImportPage } from '../src/pages/AdminImportPage';
import { UI_COPY } from '../src/constants/ui.constants';
import { CSV_UPLOAD_RULES } from '../src/constants/theme.constants';
import type { ImportBatchResponse } from '../src/types/import.types';

// ── Mock import.api ───────────────────────────────────────────────────────────

const mockUpload = vi.fn();
vi.mock('../src/services/import.api', () => ({
  uploadTransactionsCsv: (...args: unknown[]) => mockUpload(...args),
}));

// ── Mock apiClient (required by transitive imports) ───────────────────────────

vi.mock('../src/services/apiClient', () => ({
  registerUnauthorizedHandler: vi.fn(),
  buildQueryString: vi.fn(() => ''),
  ApiClientError: class ApiClientError extends Error {
    code: string;
    httpStatus: number;
    details: { field: string; issue: string }[] = [];
    requestId = '';
    constructor(message: string, code: string, httpStatus: number) {
      super(message);
      this.code = code;
      this.httpStatus = httpStatus;
    }
  },
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), postForm: vi.fn() },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFile(name: string, size: number, type = 'text/csv'): File {
  const content = 'a'.repeat(size);
  return new File([content], name, { type });
}

function dropFile(file: File) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  fireEvent.change(input);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BATCH_SUCCESS: ImportBatchResponse = {
  batch_id: 'B001',
  file_name: 'transactions.csv',
  total_rows: 100,
  imported_rows: 98,
  rejected_rows: 2,
  rejections: [
    {
      row_number: 5,
      record_identifier: 'TXN005',
      error_code: 'DUPLICATE_TRANSACTION',
      error_reason: 'Transaction ID already exists.',
    },
    {
      row_number: 12,
      record_identifier: 'TXN012',
      error_code: 'INVALID_ACCOUNT',
      error_reason: 'Account ID not found.',
    },
  ],
};

const BATCH_CLEAN: ImportBatchResponse = {
  batch_id: 'B002',
  file_name: 'clean.csv',
  total_rows: 50,
  imported_rows: 50,
  rejected_rows: 0,
  rejections: [],
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AdminImportPage — initial render', () => {
  it('renders the page title', () => {
    render(<AdminImportPage />);
    expect(screen.getByText(UI_COPY.ADMIN_IMPORT.PAGE_TITLE)).toBeTruthy();
  });

  it('renders the dropzone', () => {
    render(<AdminImportPage />);
    expect(screen.getByRole('button', { name: UI_COPY.ARIA.DROPZONE })).toBeTruthy();
  });

  it('renders the required CSV columns', () => {
    render(<AdminImportPage />);
    expect(screen.getByText(UI_COPY.ADMIN_IMPORT.REQUIRED_COLUMNS_TITLE)).toBeTruthy();
    CSV_UPLOAD_RULES.REQUIRED_COLUMNS.forEach((col) => {
      expect(screen.getByText(col)).toBeTruthy();
    });
  });

  it('does not show Upload button before file selection', () => {
    render(<AdminImportPage />);
    expect(screen.queryByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN)).toBeNull();
  });
});

describe('AdminImportPage — file selection', () => {
  it('shows Upload button after valid CSV is selected', () => {
    render(<AdminImportPage />);
    dropFile(makeFile('data.csv', 1024));
    expect(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN)).toBeTruthy();
  });

  it('shows validation error for non-CSV file type', () => {
    render(<AdminImportPage />);
    dropFile(makeFile('data.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'));
    expect(screen.getByText(UI_COPY.VALIDATION.CSV_TYPE_INVALID)).toBeTruthy();
  });

  it('shows validation error when file exceeds 5 MB', () => {
    render(<AdminImportPage />);
    dropFile(makeFile('big.csv', CSV_UPLOAD_RULES.MAX_SIZE_BYTES + 1));
    expect(screen.getByText(UI_COPY.VALIDATION.CSV_SIZE_EXCEEDED)).toBeTruthy();
  });
});

describe('AdminImportPage — upload results', () => {
  beforeEach(() => {
    mockUpload.mockReset();
  });

  it('renders ImportResultPanel batch KPIs on success', async () => {
    mockUpload.mockResolvedValue(BATCH_SUCCESS);
    render(<AdminImportPage />);
    dropFile(makeFile('transactions.csv', 1024));
    fireEvent.click(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN));

    await waitFor(() => {
      expect(screen.getByText(UI_COPY.ADMIN_IMPORT.RESULT_TITLE)).toBeTruthy();
    });
    expect(screen.getByText('B001')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('98')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('renders quarantine table rows with error codes', async () => {
    mockUpload.mockResolvedValue(BATCH_SUCCESS);
    render(<AdminImportPage />);
    dropFile(makeFile('transactions.csv', 1024));
    fireEvent.click(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN));

    await waitFor(() => {
      expect(screen.getByText('DUPLICATE_TRANSACTION')).toBeTruthy();
      expect(screen.getByText('INVALID_ACCOUNT')).toBeTruthy();
    });
    expect(screen.getByText('TXN005')).toBeTruthy();
    expect(screen.getByText('Transaction ID already exists.')).toBeTruthy();
  });

  it('renders clean import message when no rejections', async () => {
    mockUpload.mockResolvedValue(BATCH_CLEAN);
    render(<AdminImportPage />);
    dropFile(makeFile('clean.csv', 1024));
    fireEvent.click(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN));

    await waitFor(() => {
      expect(screen.getByText(UI_COPY.ADMIN_IMPORT.EMPTY_REJECTIONS)).toBeTruthy();
    });
  });

  it('renders ErrorBanner for 409 DUPLICATE_FILE_UPLOAD', async () => {
    const { ApiClientError } = await import('../src/services/apiClient') as {
      ApiClientError: new (msg: string, code: string, status: number) => Error;
    };
    mockUpload.mockRejectedValue(
      new ApiClientError('Duplicate', 'DUPLICATE_FILE_UPLOAD', 409),
    );
    render(<AdminImportPage />);
    dropFile(makeFile('dup.csv', 1024));
    fireEvent.click(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(UI_COPY.ERRORS.DUPLICATE_FILE)).toBeTruthy();
    });
  });

  it('renders ErrorBanner for 400 INVALID_CSV_FORMAT', async () => {
    const { ApiClientError } = await import('../src/services/apiClient') as {
      ApiClientError: new (msg: string, code: string, status: number) => Error;
    };
    mockUpload.mockRejectedValue(
      new ApiClientError('Bad format', 'INVALID_CSV_FORMAT', 400),
    );
    render(<AdminImportPage />);
    dropFile(makeFile('bad.csv', 1024));
    fireEvent.click(screen.getByText(UI_COPY.ADMIN_IMPORT.UPLOAD_BTN));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(UI_COPY.ERRORS.INVALID_CSV)).toBeTruthy();
    });
  });
});
