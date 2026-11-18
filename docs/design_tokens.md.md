# FinPilot UI/UX Design Tokens & Visual Standards

## 1. Visual Identity & Aesthetic Principles
FinPilot is designed around **Institutional Wealth Precision**—combining executive dark-slate navigation anchors with high-contrast, airy card surfaces so wealth advisors and operations analysts can scan complex portfolios effortlessly:
- **Balanced Visual Hierarchy:** A deep midnight-navy top bar (`#0F172A`) grounds the workspace while crisp `#FFFFFF` cards over a cool `#F8FAFC` canvas separate summary KPIs from dense data tables.
- **Perfect Optical Alignment:** All cards, grids, form controls, and table headers follow a strict `4px / 8px` spatial scale with consistent `20px` (`gap-5`) gutter rhythm and `1440px` max container width.
- **Tabular Financial Clarity:** Every monetary value (`INR`), quantity, and percentage renders with `font-variant-numeric: tabular-nums` and right-aligned numeric columns so digits stack vertically without jitter.
- **WCAG 2.1 AA Accessibility:** All foreground/background pairs exceed a `4.5:1` contrast ratio, every semantic state pairs color with explicit text labels and directional signs (`+` / `-`), and all interactive controls expose clear `aria-label` attributes and visible focus rings.

---

## 2. Color Palette & Tailwind v4 `@theme` Tokens

Configure these tokens in `src/index.css` under `@theme` and mirror semantic mappings in `src/constants/theme.constants.ts`:

### 2.1 Core Surfaces, Borders & Text
| Token | Hex | Tailwind Token | Role |
| :--- | :--- | :--- | :--- |
| `--color-canvas` | `#F8FAFC` | `bg-canvas` / `slate-50` | Page background canvas |
| `--color-surface` | `#FFFFFF` | `bg-surface` / `white` | KPI cards, tables, modals, form panels |
| `--color-surface-muted` | `#F1F5F9` | `bg-surface-muted` / `slate-100` | Table headers, row hover states, secondary wells |
| `--color-nav-bg` | `#0F172A` | `bg-nav-bg` / `slate-900` | Persistent top header bar & login backdrop |
| `--color-nav-hover` | `#1E293B` | `bg-nav-hover` / `slate-800` | Active/hover navigation item background |
| `--color-border` | `#E2E8F0` | `border-border` / `slate-200` | Hairline card borders and table row dividers |
| `--color-border-strong` | `#CBD5E1` | `border-border-strong` / `slate-300` | Input field borders and active dividers |
| `--color-text-primary` | `#0F172A` | `text-text-primary` / `slate-900` | Headings, hero KPI figures, primary cell values |
| `--color-text-secondary` | `#475569` | `text-text-secondary` / `slate-600` | Field labels, subheadings, secondary descriptions |
| `--color-text-muted` | `#64748B` | `text-text-muted` / `slate-500` | Placeholders, timestamps, table footnotes |

### 2.2 Brand & Interactive Accents
| Token | Hex | Tailwind Token | Role |
| :--- | :--- | :--- | :--- |
| `--color-brand` | `#2563EB` | `bg-brand` / `blue-600` | Primary buttons, active workspace tabs, focus rings |
| `--color-brand-hover` | `#1D4ED8` | `hover:bg-brand-hover` / `blue-700` | Primary button hover & active state |
| `--color-brand-soft` | `#EFF6FF` | `bg-brand-soft` / `blue-50` | Active filter pills, selected row highlight |
| `--color-brand-border` | `#BFDBFE` | `border-brand-border` / `blue-200` | Highlighted info callouts and active tab accents |

### 2.3 Semantic Financial & Status Palette
| Tone | Text Hex | Surface Hex | Border Hex | Domain Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#047857` | `#ECFDF5` | `#A7F3D0` | Positive P&L (`+₹`), `VERIFIED` KYC, `SETTLED`, `ACTIVE`, imported rows |
| **Danger** | `#B91C1C` | `#FEF2F2` | `#FECACA` | Negative P&L (`-₹`), `is_overdue` goals, `REVERSED`, quarantined errors |
| **Warning** | `#B45309` | `#FFFBEB` | `#FDE68A` | `PENDING` / `REVIEW` KYC, `is_overfunded` goals, `DORMANT` accounts |
| **Info** | `#0369A1` | `#F0F9FF` | `#BAE6FD` | `HNI` / `Affluent` segments, `DIVIDEND` transactions, `ADMIN` badge |
| **Neutral** | `#334155` | `#F1F5F9` | `#CBD5E1` | `Mass` segment, `VIEWER` role, `FEE` rows, `CLOSED` accounts |

### 2.4 Data Visualization Palette (`ASSET_CLASS_COLORS`)
Curated colorblind-safe categorical palette for Recharts Donut/Bar visualizations:
- `EQUITY`: `#2563EB` (Cobalt Blue)
- `ETF`: `#0D9488` (Deep Teal)
- `MUTUAL_FUND`: `#7C3AED` (Royal Violet)
- `BOND`: `#D97706` (Warm Amber)
- `REIT`: `#DB2777` (Crimson Rose)
- `GSEC`: `#475569` (Cool Slate)

---

## 3. Typography & Numeric Precision

| Element | Font Stack | Size / Line Height | Weight | Tracking & OpenType |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title (`h1`)** | `Inter, system-ui, sans-serif` | `24px / 32px` | `600` | `-0.02em` |
| **Section Heading (`h2`)** | `Inter, system-ui, sans-serif` | `18px / 26px` | `600` | `-0.01em` |
| **Card / Panel Title (`h3`)** | `Inter, system-ui, sans-serif` | `15px / 22px` | `600` | `normal` |
| **KPI Hero Metric** | `Inter, system-ui, sans-serif` | `28px / 34px` | `700` | `-0.02em`, `tabular-nums` |
| **Body & Table Cell** | `Inter, system-ui, sans-serif` | `14px / 20px` | `400` | `tabular-nums` on numbers |
| **Table Column Header** | `Inter, system-ui, sans-serif` | `11.5px / 16px` | `600` | `uppercase`, `+0.05em` |
| **Status Pill / Badge** | `Inter, system-ui, sans-serif` | `12px / 16px` | `500` | `normal` |
| **Entity ID / Ticker** | `JetBrains Mono, ui-monospace, monospace` | `13px / 18px` | `500` | `C0002`, `A00002`, `EQ001` |

### Currency & Percentage Formatting Standards
- **`formatINR(amount)`:** Uses `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 })` → `₹2,63,088.49`.
- **`formatSignedINR(amount)`:** Prefixes `+` when `amount > 0` (`+₹21,588.49`), `-` when `amount < 0` (`-₹1,240.00`), and `₹0.00` at zero.
- **`formatPercent(value, signed?)`:** Formats to 2 decimal places (`8.94%` or `+8.94%`).

---

## 4. Layout Grid, Spacing & Elevation

- **Container & Gutters:** `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6`, vertical section rhythm `space-y-6` (`24px`), card grid spacing `gap-5` (`20px`).
- **Control Alignment:** All form inputs, select dropdowns, and action buttons share a standardized `h-10` (`40px`) height and `rounded-lg` (`8px`) corner radius so filter toolbars align cleanly on a single baseline.
- **Border Radius Scale:**
  - Cards & Data Tables: `rounded-xl` (`12px`)
  - Modals & Login Card: `rounded-2xl` (`16px`)
  - Buttons, Inputs & Selects: `rounded-lg` (`8px`)
  - Status & Role Badges: `rounded-full` (`9999px`)
- **Shadows & Elevation:**
  - Card Surface: `border border-slate-200 shadow-xs` (`0 1px 2px 0 rgb(15 23 42 / 0.05)`)
  - Interactive Card Hover: `hover:border-slate-300 hover:shadow-sm transition-all duration-150`
  - Modal Surface: `shadow-2xl` over `bg-slate-900/50 backdrop-blur-xs`

---

## 5. Interaction, Accessibility & Asset Standards

1. **Brand Assets (`public/assets/`):**
   - `finpilot-logo.svg`: Used in the top navigation bar and login header.
   - `finpilot-mark.svg`: Used as browser favicon in `index.html`.
   - `login-bg.svg`: Full-bleed decorative background on `/login`.
2. **ARIA & Keyboard Accessibility:**
   - Every icon-only button, search box, select filter, pagination control, modal (`role="dialog"`, `aria-modal="true"`), and progress bar (`role="progressbar"`, `aria-valuenow`) MUST receive explicit `aria-label` strings from `src/constants/ui.constants.ts`.
   - Every interactive element MUST include `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
3. **Skeleton, Empty & Error States:**
   - Never leave blank screens during fetches; render dimension-matched `Skeleton` placeholders.
   - Render `EmptyState` cards with clear guidance when a customer holds zero positions or filters return zero records.
   - Render `ErrorBanner` alerts with a `Retry` trigger on failed API requests.