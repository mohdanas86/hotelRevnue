// ─────────────────────────────────────────────────────────────────────────────
// All API call functions for the dashboard.
// Each function maps directly to a backend endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  DashboardSummary,
  RevenueOverTimeResponse,
  BookingsByChannelResponse,
  BookingsBySegmentResponse,
  OccupancyOverTimeResponse,
  ADROverTimeResponse,
  CancellationsOverTimeResponse,
  RevenueByHotelResponse,
  FilterOptions,
  DashboardFilters,
  Granularity,
} from "@/types/dashboard";
import { toAPIParams, buildQueryString } from "@/lib/filterUtils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? buildQueryString(params) : "";
  const url = `${BASE_URL}${path}${qs}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function filterParams(filters: DashboardFilters): Record<string, string> {
  return toAPIParams(filters);
}

export function fetchSummary(filters: DashboardFilters): Promise<DashboardSummary> {
  return apiFetch("/api/dashboard/summary", filterParams(filters));
}

export function fetchRevenueOverTime(
  filters: DashboardFilters,
  granularity: Granularity
): Promise<RevenueOverTimeResponse> {
  return apiFetch("/api/dashboard/revenue-over-time", {
    ...filterParams(filters),
    granularity,
  });
}

export function fetchBookingsByChannel(
  filters: DashboardFilters
): Promise<BookingsByChannelResponse> {
  return apiFetch("/api/dashboard/bookings-by-channel", filterParams(filters));
}

export function fetchBookingsBySegment(
  filters: DashboardFilters
): Promise<BookingsBySegmentResponse> {
  return apiFetch("/api/dashboard/bookings-by-segment", filterParams(filters));
}

export function fetchOccupancyOverTime(
  filters: DashboardFilters,
  granularity: Granularity
): Promise<OccupancyOverTimeResponse> {
  return apiFetch("/api/dashboard/occupancy-over-time", {
    ...filterParams(filters),
    granularity,
  });
}

export function fetchADROverTime(
  filters: DashboardFilters,
  granularity: Granularity
): Promise<ADROverTimeResponse> {
  return apiFetch("/api/dashboard/adr-over-time", {
    ...filterParams(filters),
    granularity,
  });
}

export function fetchCancellationsOverTime(
  filters: DashboardFilters,
  granularity: Granularity
): Promise<CancellationsOverTimeResponse> {
  return apiFetch("/api/dashboard/cancellations-over-time", {
    ...filterParams(filters),
    granularity,
  });
}

export function fetchRevenueByHotel(
  filters: DashboardFilters,
  topN = 10
): Promise<RevenueByHotelResponse> {
  return apiFetch("/api/dashboard/revenue-by-hotel", {
    ...filterParams(filters),
    top_n: String(topN),
  });
}

export function fetchFilterOptions(): Promise<FilterOptions> {
  return apiFetch("/api/filters/options");
}
