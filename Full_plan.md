# Hotel Revenue Dashboard — Implementation Prompt

---

## 🧠 Context & Mission

You are a **Senior Full-Stack Engineer**. Your task is to build a **real-time Hotel Revenue Dashboard** by reading and fully understanding the existing codebase — backend API routes, data models, and the frontend dashboard structure — then implementing a complete, production-grade solution.

**Before writing a single line of code**, read every file in:
- backend — all routes, controllers, models, middleware, DB config
- `/frontend/src/pages/dashboard` and related components
- The data file(s) (CSV/JSON/DB seed) to understand the shape, fields, and relationships of the data

Take detailed mental notes on:
- What entities exist (bookings, rooms, revenue, guests, channels, etc.)
- What filters make sense (date range, room type, booking channel, country, hotel, etc.)
- What KPIs and metrics can be derived
- What existing API endpoints do and what's missing or broken

---

## 🎯 Project Goal

Build a **fast, accurate, real-time Hotel Revenue Dashboard** with:
- Smart data caching (no redundant fetches)
- Rich interactive charts and graphs
- Powerful filter controls
- Clean, professional UI using **shadcn/ui** components exclusively for UI elements
- **Recharts** (via shadcn/ui chart primitives) for all visualizations

---

## 🔧 Tech Stack (Non-Negotiable)

| Layer | Technology |
|---|---|
| Frontend Framework | React (existing) |
| Data Fetching & Caching | **TanStack React Query v5** |
| UI Components | **shadcn/ui** (Card, Select, DatePicker, Tabs, Badge, Skeleton, Table, Tooltip, etc.) |
| Charts | **shadcn/ui Chart** (Recharts-based) |
| State Management | React Query cache + URL search params for filter state |
| Backend | Existing (Node/Express or equivalent — read and fix) |
| Styling | Tailwind CSS |

---

## 📋 Phase 1 — Codebase Audit (Do This First)

1. Read all backend files and document:
   - Every existing API endpoint (method, path, what it returns)
   - Database schema / data shape
   - Missing endpoints needed for dashboard metrics
   - Any bugs, missing error handling, or performance issues

2. Read the data file and document:
   - All available columns/fields
   - Data types and ranges
   - What aggregations are possible (sum, avg, count, group by)

3. Read the frontend dashboard files and document:
   - Current component structure
   - What's already built vs. what's missing
   - Any broken imports, unused code, or anti-patterns

---

## 🔌 Phase 2 — Backend Fixes & New Endpoints

Fix all existing backend issues found in the audit, then implement the following endpoints (add any additional ones you identify as necessary from the data):

### Required API Endpoints

```
GET /api/dashboard/summary
```
Returns top-level KPIs:
- Total Revenue
- Total Bookings
- Average Daily Rate (ADR)
- Revenue Per Available Room (RevPAR)
- Occupancy Rate (%)
- Average Length of Stay
- Cancellation Rate (%)
- Total Guests

All filterable by: `startDate`, `endDate`, `hotelId`, `roomType`, `channel`, `country`

---

```
GET /api/dashboard/revenue-over-time
```
Returns revenue grouped by day/week/month (auto or param-controlled).
Used for: Line chart / Area chart

---

```
GET /api/dashboard/bookings-by-channel
```
Returns booking count and revenue grouped by distribution channel.
Used for: Pie chart / Donut chart

---

```
GET /api/dashboard/bookings-by-room-type
```
Returns count and revenue grouped by room type.
Used for: Bar chart

---

```
GET /api/dashboard/occupancy-rate
```
Returns occupancy % over time.
Used for: Area chart

---

```
GET /api/dashboard/revenue-by-country
```
Returns top N countries by revenue and bookings.
Used for: Horizontal bar chart

---

```
GET /api/dashboard/cancellations-over-time
```
Returns cancellation count/rate over time.
Used for: Line chart

---

```
GET /api/dashboard/adr-over-time
```
Returns Average Daily Rate trend over time.
Used for: Line chart

---

```
GET /api/dashboard/lead-time-distribution
```
Returns booking lead time distribution (how far in advance bookings are made).
Used for: Histogram / Bar chart

---

```
GET /api/dashboard/guest-type-breakdown
```
Returns breakdown by guest type (couples, families, solo, groups).
Used for: Donut chart

---

```
GET /api/filters/options
```
Returns all available filter options dynamically from real data:
- Hotels list
- Room types list
- Channels list
- Countries list
- Min/max date range

### Backend Engineering Requirements:
- Add proper input validation on all query params
- Add error handling middleware (consistent error shape)
- Add response compression (gzip)
- Add caching headers where appropriate (`Cache-Control`)
- Use query optimization — avoid loading entire dataset for every request, use proper DB queries or efficient in-memory filtering
- All monetary values returned in consistent format (2 decimal places)
- All dates in ISO 8601 format
- Paginate any endpoint that returns raw records

---

## 🖥️ Phase 3 — Frontend Implementation

### 3.1 — React Query Setup

- Install and configure `@tanstack/react-query` with `QueryClient`
- Set `staleTime: 5 * 60 * 1000` (5 minutes) — data is considered fresh for 5 min
- Set `gcTime: 10 * 60 * 1000` (10 minutes) — cache kept for 10 min
- Enable `refetchOnWindowFocus: false`
- Use `keepPreviousData: true` on all dashboard queries so UI doesn't flash on filter change
- Add React Query Devtools in development mode
- Create a dedicated `/src/hooks/useDashboard.ts` file with individual custom hooks per endpoint:
  - `useDashboardSummary(filters)`
  - `useRevenueOverTime(filters)`
  - `useBookingsByChannel(filters)`
  - `useBookingsByRoomType(filters)`
  - `useOccupancyRate(filters)`
  - `useRevenueByCountry(filters)`
  - `useCancellationsOverTime(filters)`
  - `useADROverTime(filters)`
  - `useLeadTimeDistribution(filters)`
  - `useGuestTypeBreakdown(filters)`
  - `useFilterOptions()`
- Query keys must include all active filters so cache is correctly invalidated per filter combination

### 3.2 — Filter State Management

- Persist all active filters in **URL search params** using `useSearchParams`
- This enables shareable URLs and browser back/forward navigation
- Filters include:
  - `startDate` / `endDate` — Date range picker (shadcn/ui DateRangePicker)
  - `hotel` — Multi-select or single select (shadcn/ui Select)
  - `roomType` — Multi-select (shadcn/ui Select or ComboBox)
  - `channel` — Multi-select
  - `country` — Multi-select with search
  - `granularity` — day / week / month toggle (shadcn/ui Tabs or ToggleGroup)
- Debounce filter changes by 300ms before triggering queries
- Show active filter count badge on filter panel toggle button
- Provide a **"Reset Filters"** button (only visible when filters are active)
- Populate all filter dropdowns using data from `useFilterOptions()` — never hardcode values

### 3.3 — Dashboard Layout

Build a responsive dashboard layout:

```
┌─────────────────────────────────────────────────────────┐
│  Header: Title + Date Range + Hotel Selector            │
├─────────────────────────────────────────────────────────┤
│  Filter Bar: Room Type | Channel | Country | Granularity│
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ Revenue  │ Bookings │   ADR    │  RevPAR  │ Occupancy  │  ← KPI Cards Row
├──────────┴──────────┴──────────┴──────────┴────────────┤
│         Revenue Over Time (Area/Line Chart)             │  ← Full width
├─────────────────────────┬───────────────────────────────┤
│  Bookings by Channel    │  Bookings by Room Type        │  ← Half width each
│  (Donut Chart)          │  (Grouped Bar Chart)          │
├─────────────────────────┼───────────────────────────────┤
│  Occupancy Rate Trend   │  ADR Trend                    │  ← Half width each
│  (Area Chart)           │  (Line Chart)                 │
├─────────────────────────┼───────────────────────────────┤
│  Revenue by Country     │  Cancellation Rate            │  ← Half width each
│  (Horizontal Bar)       │  (Line Chart)                 │
├─────────────────────────┴───────────────────────────────┤
│  Lead Time Distribution (Bar/Histogram) - Full width    │
├─────────────────────────────────────────────────────────┤
│  Guest Type Breakdown (Donut) + Summary Stats Table     │
└─────────────────────────────────────────────────────────┘
```

### 3.4 — KPI Summary Cards

Use `shadcn/ui Card` for each KPI. Each card must show:
- Current period value (large, prominent)
- Label
- Trend indicator: % change vs. previous period (green up arrow / red down arrow)
- shadcn/ui `Skeleton` while loading
- Tooltip with explanation of the metric

KPIs:
1. **Total Revenue** — formatted as currency
2. **Total Bookings** — formatted as integer with comma separator
3. **Average Daily Rate (ADR)** — currency
4. **RevPAR** — currency
5. **Occupancy Rate** — percentage with 1 decimal
6. **Cancellation Rate** — percentage with 1 decimal
7. **Avg Length of Stay** — "X nights"
8. **Total Guests** — integer

### 3.5 — Charts Implementation

Use **shadcn/ui Chart** wrapper (which uses Recharts internally). All charts must:
- Have a descriptive title and subtitle
- Show loading skeleton while data fetches
- Show empty state with icon and message if no data
- Show error state with retry button if query fails
- Have properly formatted tooltips (currency, percentages, dates)
- Be fully responsive (use `ResponsiveContainer`)
- Have a legend where applicable
- Support theme (light/dark) via CSS variables

**Chart Specifications:**

| Chart | Type | X-Axis | Y-Axis | Colors |
|---|---|---|---|---|
| Revenue Over Time | Area (gradient fill) | Date | Revenue (€/$) | Primary brand color |
| Bookings by Channel | Donut | — | Count | Multi-color |
| Bookings by Room Type | Grouped Bar | Room Type | Count + Revenue | Two series |
| Occupancy Rate | Area | Date | % | Teal |
| ADR Trend | Line | Date | ADR (€/$) | Orange |
| Revenue by Country | Horizontal Bar | Revenue | Country | Single color gradient |
| Cancellation Rate | Line | Date | % | Red |
| Lead Time | Bar | Days in advance | Bookings Count | Indigo |
| Guest Type | Donut | — | Count | Multi-color |

### 3.6 — Data Table

Include a paginated data table using `shadcn/ui Table` + `DataTable` pattern:
- Show raw filtered booking records
- Columns: Date, Hotel, Room Type, Channel, Country, ADR, Revenue, Nights, Guests, Status
- Client-side sorting on all columns
- Column visibility toggle
- Export to CSV button
- Pagination (10/25/50 rows per page)
- Search/filter within visible results

### 3.7 — UX & Performance Requirements

- All charts and cards show `shadcn/ui Skeleton` during initial load
- Use `React.Suspense` boundaries where appropriate
- Implement `React.memo` on chart components to prevent unnecessary re-renders
- Use `useMemo` for any derived/computed data (e.g., totals, formatted chart data)
- Use `useCallback` for filter change handlers
- Dashboard should load initial view in under **2 seconds** on average hardware
- Zero layout shift during loading transitions (`keepPreviousData` ensures this)
- Smooth transitions when filters change (charts animate via Recharts built-in animation)
- Mobile responsive (stack cards/charts vertically on small screens)
- Add a **"Last updated"** timestamp showing when data was last fetched
- Add a **manual refresh** button that calls `queryClient.invalidateQueries()`

---

## 📁 Phase 4 — File Structure

Organize the frontend as follows:

```
src/
├── api/
│   └── dashboard.ts          # All API call functions (axios/fetch wrappers)
├── hooks/
│   └── useDashboard.ts       # All React Query hooks
├── components/
│   └── dashboard/
│       ├── DashboardLayout.tsx
│       ├── FilterBar.tsx
│       ├── KPICard.tsx
│       ├── KPIGrid.tsx
│       ├── charts/
│       │   ├── RevenueOverTimeChart.tsx
│       │   ├── BookingsByChannelChart.tsx
│       │   ├── BookingsByRoomTypeChart.tsx
│       │   ├── OccupancyRateChart.tsx
│       │   ├── ADRTrendChart.tsx
│       │   ├── RevenueByCountryChart.tsx
│       │   ├── CancellationRateChart.tsx
│       │   ├── LeadTimeChart.tsx
│       │   └── GuestTypeChart.tsx
│       ├── DataTable.tsx
│       └── ChartCard.tsx     # Reusable wrapper with title, loading, error, empty states
├── pages/
│   └── Dashboard.tsx
├── types/
│   └── dashboard.ts          # All TypeScript interfaces
├── lib/
│   ├── queryClient.ts        # React Query client config
│   ├── formatters.ts         # Currency, date, number formatters
│   └── filterUtils.ts        # URL param serialization/deserialization
```

---

## 🏗️ Phase 5 — TypeScript Interfaces

Define strict TypeScript interfaces for all API responses and filter state. No `any` types. All API response shapes must be typed. All filter state must be typed and validated.

---

## ✅ Phase 6 — Quality Checklist

Before considering the implementation complete, verify:

- [ ] All API endpoints return correct data for all filter combinations
- [ ] React Query cache works — switching filters and switching back uses cached data (no new network request)
- [ ] All charts render correctly on both desktop and mobile
- [ ] All loading states use Skeleton (no spinners in the middle of charts)
- [ ] All error states have retry capability
- [ ] URL reflects current filter state — refreshing the page restores filters
- [ ] KPI trend indicators compare current period to equivalent previous period
- [ ] Currency values are consistently formatted
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] Export CSV works correctly
- [ ] Manual refresh triggers fresh data fetch for all queries

---

## ⚠️ Critical Rules

1. **Read the codebase first** — do not assume any data shape, field name, or API structure. Derive everything from actual files.
2. **Do not hardcode filter options** — always populate from the `/api/filters/options` endpoint.
3. **Do not over-fetch** — React Query caching is the primary performance mechanism. Respect `staleTime`.
4. **shadcn/ui only for UI** — no other component libraries.
5. **Fix the backend properly** — don't work around broken endpoints with frontend hacks.
6. **Consistent data formatting** — use the `/lib/formatters.ts` utilities everywhere.
7. **Every chart needs 3 states** — loading (skeleton), error (with retry), empty (with message).
8. **Filters in URL** — users must be able to share a URL and see the same dashboard state.

---