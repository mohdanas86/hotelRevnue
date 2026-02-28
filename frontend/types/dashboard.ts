// ─────────────────────────────────────────────────────────────────────────────
// Dashboard TypeScript interfaces — every API response + filter state typed.
// No `any` types. All monetary values are numbers (2 dp from backend).
// ─────────────────────────────────────────────────────────────────────────────

// ── Filter state ─────────────────────────────────────────────────────────────

export type Granularity = "day" | "week" | "month";

export interface DashboardFilters {
  startDate: string;   // ISO date string YYYY-MM-DD
  endDate: string;
  hotelId: string;     // comma-separated for multi-select
  channel: string;     // comma-separated
  segment: string;     // comma-separated (Market_Segment)
  granularity: Granularity;
}

export type FilterKey = keyof DashboardFilters;

// ── API response metadata ────────────────────────────────────────────────────

export interface FilterMetadata {
  total_records: number;
  original_records: number;
  date_range: { start: string; end: string } | null;
  hotels: string[];
  channels: string[];
  segments: string[];
}

// ── Dashboard Summary (KPIs) ─────────────────────────────────────────────────

export interface DashboardSummary {
  total_revenue: number;
  total_bookings: number;
  avg_adr: number;
  avg_revpar: number;
  avg_occupancy: number;       // 0-1 scale
  cancellation_rate: number;   // percentage
  total_cancellations: number;
  total_rooms_sold: number;
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Revenue over time ────────────────────────────────────────────────────────

export interface RevenueOverTimeItem {
  Date: string;
  Revenue_INR: number;
  ADR_INR: number;
}

export interface RevenueOverTimeResponse {
  data: RevenueOverTimeItem[];
  granularity: Granularity;
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Bookings by channel ──────────────────────────────────────────────────────

export interface BookingsByChannelItem {
  Booking_Channel: string;
  bookings: number;
  revenue: number;
  cancellations: number;
  share_pct: number;
}

export interface BookingsByChannelResponse {
  data: BookingsByChannelItem[];
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Bookings by segment ──────────────────────────────────────────────────────

export interface BookingsBySegmentItem {
  Market_Segment: string;
  bookings: number;
  revenue: number;
  cancellations: number;
  avg_adr: number;
  share_pct: number;
}

export interface BookingsBySegmentResponse {
  data: BookingsBySegmentItem[];
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Occupancy over time ──────────────────────────────────────────────────────

export interface OccupancyOverTimeItem {
  Date: string;
  Occupancy_Rate: number;  // 0-100 percentage from backend
}

export interface OccupancyOverTimeResponse {
  data: OccupancyOverTimeItem[];
  granularity: Granularity;
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── ADR over time ────────────────────────────────────────────────────────────

export interface ADROverTimeItem {
  Date: string;
  ADR_INR: number;
}

export interface ADROverTimeResponse {
  data: ADROverTimeItem[];
  granularity: Granularity;
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Cancellations over time ──────────────────────────────────────────────────

export interface CancellationsOverTimeItem {
  Date: string;
  cancellations: number;
  cancellation_rate: number;  // percentage
}

export interface CancellationsOverTimeResponse {
  data: CancellationsOverTimeItem[];
  granularity: Granularity;
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Revenue by hotel ─────────────────────────────────────────────────────────

export interface RevenueByHotelItem {
  Hotel_ID: string;
  revenue: number;
  bookings: number;
  avg_adr: number;
  avg_occupancy: number;  // percentage
}

export interface RevenueByHotelResponse {
  data: RevenueByHotelItem[];
  filters_applied: Record<string, string>;
  metadata: FilterMetadata;
}

// ── Filter options ───────────────────────────────────────────────────────────

export interface FilterOptions {
  hotels: string[];
  channels: string[];
  segments: string[];
  date_range: {
    min_date: string;
    max_date: string;
  };
  total_records: number;
}
