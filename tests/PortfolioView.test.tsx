/**
 * PortfolioView.test.tsx
 * Tests:
 *  1. Populated portfolio renders all 4 KPI card labels
 *  2. KPI values are present in the document (may appear in multiple nodes)
 *  3. Zero-position portfolio renders ₹0.00 KPI and EmptyState
 *  4. Account summary cards render provider name
 *  5. PortfolioModule shows error banner on API failure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import { PortfolioModule } from '../src/components/portfolio/PortfolioModule';
import { UI_COPY } from '../src/constants/ui.constants';
import { AssetClass, AccountType, AccountStatus } from '../src/constants/domain.constants';
import type { PortfolioResponse } from '../src/types/portfolio.types';

// ── Mock apiClient ────────────────────────────────────────────────────────────

vi.mock('../src/services/apiClient', () => ({
  registerUnauthorizedHandler: vi.fn(),
  buildQueryString: vi.fn(() => ''),
  ApiClientError: class ApiClientError extends Error {
    code = 'ERR'; httpStatus = 500;
    details: { field: string; issue: string }[] = []; requestId = '';
  },
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), postForm: vi.fn() },
}));

// ── Mock portfolio.api ────────────────────────────────────────────────────────

const mockFetchPortfolio = vi.fn();
const mockFetchPositions = vi.fn();
vi.mock('../src/services/portfolio.api', () => ({
  fetchCustomerPortfolio: (...args: unknown[]) => mockFetchPortfolio(...args),
  fetchPortfolioPositions: (...args: unknown[]) => mockFetchPositions(...args),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const POPULATED_PORTFOLIO: PortfolioResponse = {
  customer_id: 'C0002',
  snapshot_date: '2024-03-31',
  price_as_of: '2024-03-31',
  totals: {
    total_market_value: 263088.49,
    total_cost_basis: 241500.00,
    total_unrealised_gain_loss: 21588.49,
    total_unrealised_gain_loss_pct: 8.94,
    active_accounts_count: 2,
  },
  accounts: [
    {
      account_id: 'A00002',
      account_type: AccountType.BROKERAGE,
      provider: 'Zerodha',
      status: AccountStatus.ACTIVE,
      cost_basis: 241500,
      market_value: 263088.49,
      unrealised_gain_loss: 21588.49,
      unrealised_gain_loss_pct: 8.94,
    },
  ],
  allocation_by_asset_class: [
    { asset_class: AssetClass.EQUITY, market_value: 263088.49, allocation_pct: 100 },
  ],
  positions: [
    {
      instrument_id: 'EQ001',
      symbol: 'RELIANCE',
      instrument_name: 'Reliance Industries',
      account_id: 'A00002',
      account_type: AccountType.BROKERAGE,
      asset_class: AssetClass.EQUITY,
      quantity: 50,
      avg_cost: 2415,
      last_price: 2630.88,
      cost_basis: 120750,
      market_value: 131544,
      unrealised_gain_loss: 10794,
      unrealised_gain_loss_pct: 8.94,
    },
  ],
};

const EMPTY_PORTFOLIO: PortfolioResponse = {
  customer_id: 'C0001',
  snapshot_date: '2024-03-31',
  price_as_of: '2024-03-31',
  totals: {
    total_market_value: 0,
    total_cost_basis: 0,
    total_unrealised_gain_loss: 0,
    total_unrealised_gain_loss_pct: 0,
    active_accounts_count: 0,
  },
  accounts: [],
  allocation_by_asset_class: [],
  positions: [],
};

// ── Helper: find KPI card by its label text ───────────────────────────────────
// KPI cards are divs containing a label span and a value span.
// We locate the card by finding the label then walking to its parent.
function getKpiCard(labelText: string): HTMLElement {
  const label = screen.getByText(labelText);
  // The card is the closest ancestor with the KPI structure (flex-col, gap-2)
  return label.closest('div[class*="flex flex-col gap-2"]') as HTMLElement;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PortfolioModule — populated portfolio', () => {
  beforeEach(() => {
    mockFetchPortfolio.mockResolvedValue(POPULATED_PORTFOLIO);
    mockFetchPositions.mockResolvedValue({
      data: POPULATED_PORTFOLIO.positions,
      pagination: { page: 1, limit: 20, total_items: 1, total_pages: 1 },
    });
  });

  it('renders Total Market Value KPI label', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_MARKET_VALUE)).toBeTruthy();
    });
  });

  it('renders Total Market Value KPI with correct INR value', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_MARKET_VALUE)).toBeTruthy();
    });
    const card = getKpiCard(UI_COPY.PORTFOLIO.KPI_MARKET_VALUE);
    expect(within(card).getByText(/2,63,088/)).toBeTruthy();
  });

  it('renders Total Cost Basis KPI with correct INR value', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_COST_BASIS)).toBeTruthy();
    });
    const card = getKpiCard(UI_COPY.PORTFOLIO.KPI_COST_BASIS);
    expect(within(card).getByText(/2,41,500/)).toBeTruthy();
  });

  it('renders Unrealised G/L KPI card with positive signed value', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_UNREALISED_PL)).toBeTruthy();
    });
    const card = getKpiCard(UI_COPY.PORTFOLIO.KPI_UNREALISED_PL);
    expect(within(card).getByText(/\+₹21,588/)).toBeTruthy();
  });

  it('renders Active Accounts KPI card with count 2', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_ACTIVE_ACCOUNTS)).toBeTruthy();
    });
    const card = getKpiCard(UI_COPY.PORTFOLIO.KPI_ACTIVE_ACCOUNTS);
    expect(within(card).getByText('2')).toBeTruthy();
  });

  it('renders holdings position symbol RELIANCE', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText('RELIANCE')).toBeTruthy();
    });
  });

  it('renders account summary card for Zerodha', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByText(/Zerodha/)).toBeTruthy();
    });
  });
});

describe('PortfolioModule — zero-position portfolio', () => {
  beforeEach(() => {
    mockFetchPortfolio.mockResolvedValue(EMPTY_PORTFOLIO);
    mockFetchPositions.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 20, total_items: 0, total_pages: 1 },
    });
  });

  it('renders ₹0.00 for Total Market Value KPI', async () => {
    render(<PortfolioModule customerId="C0001" />);
    await waitFor(() => {
      expect(screen.getByText(UI_COPY.PORTFOLIO.KPI_MARKET_VALUE)).toBeTruthy();
    });
    const card = getKpiCard(UI_COPY.PORTFOLIO.KPI_MARKET_VALUE);
    expect(within(card).getByText(/₹0\.00/)).toBeTruthy();
  });

  it('renders EmptyState for positions when no positions exist', async () => {
    render(<PortfolioModule customerId="C0001" />);
    await waitFor(() => {
      // EMPTY_TITLE appears in multiple EmptyState instances (accounts + positions)
      const empties = screen.getAllByText(UI_COPY.PORTFOLIO.EMPTY_TITLE);
      expect(empties.length).toBeGreaterThan(0);
    });
  });
});

describe('PortfolioModule — API error', () => {
  beforeEach(() => {
    mockFetchPortfolio.mockRejectedValue(new Error('Network error'));
    mockFetchPositions.mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 20, total_items: 0, total_pages: 1 },
    });
  });

  it('renders ErrorBanner on API failure', async () => {
    render(<PortfolioModule customerId="C0002" />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });
  });
});
