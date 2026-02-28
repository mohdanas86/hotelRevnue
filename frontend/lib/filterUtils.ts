// ─────────────────────────────────────────────────────────────────────────────
// Filter URL param serialization / deserialization utilities
// ─────────────────────────────────────────────────────────────────────────────

import type { DashboardFilters, Granularity } from "@/types/dashboard";

export const DEFAULT_FILTERS: DashboardFilters = {
  startDate: "",
  endDate: "",
  hotelId: "",
  channel: "",
  segment: "",
  granularity: "month",
};

/** Parse URLSearchParams → DashboardFilters */
export function parseFiltersFromParams(params: URLSearchParams): DashboardFilters {
  return {
    startDate: params.get("startDate") ?? "",
    endDate: params.get("endDate") ?? "",
    hotelId: params.get("hotelId") ?? "",
    channel: params.get("channel") ?? "",
    segment: params.get("segment") ?? "",
    granularity: (params.get("granularity") as Granularity) ?? "month",
  };
}

/** Serialize DashboardFilters → URLSearchParams */
export function buildParams(filters: DashboardFilters): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key as keyof DashboardFilters]) {
      params.set(key, value);
    }
  });
  return params;
}

/** Convert DashboardFilters to backend API query params */
export function toAPIParams(filters: DashboardFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.startDate) out["start_date"] = filters.startDate;
  if (filters.endDate) out["end_date"] = filters.endDate;
  if (filters.hotelId) out["hotel_id"] = filters.hotelId;
  if (filters.channel) out["booking_channel"] = filters.channel;
  if (filters.segment) out["market_segment"] = filters.segment;
  return out;
}

/** Build URL query string from API params */
export function buildQueryString(apiParams: Record<string, string>): string {
  const params = new URLSearchParams(apiParams);
  return params.toString() ? `?${params.toString()}` : "";
}

/** Count active non-default filter fields (excludes granularity) */
export function countActiveFilters(filters: DashboardFilters): number {
  const { granularity: _g, ...rest } = filters;
  return Object.values(rest).filter(Boolean).length;
}

/** Returns true if no "real" filters are active (only granularity can be non-default) */
export function hasActiveFilters(filters: DashboardFilters): boolean {
  return countActiveFilters(filters) > 0;
}
