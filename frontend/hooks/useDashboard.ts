// ─────────────────────────────────────────────────────────────────────────────
// All React Query hooks for the dashboard.
// Query keys include all active filters so cache is correctly scoped.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DashboardFilters, Granularity } from "@/types/dashboard";
import {
  fetchSummary,
  fetchRevenueOverTime,
  fetchBookingsByChannel,
  fetchBookingsBySegment,
  fetchOccupancyOverTime,
  fetchADROverTime,
  fetchCancellationsOverTime,
  fetchRevenueByHotel,
  fetchFilterOptions,
} from "@/api/dashboard";

// ── Query key factory ─────────────────────────────────────────────────────────

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (filters: DashboardFilters) => ["dashboard", "summary", filters] as const,
  revenueOverTime: (filters: DashboardFilters, g: Granularity) =>
    ["dashboard", "revenueOverTime", filters, g] as const,
  bookingsByChannel: (filters: DashboardFilters) =>
    ["dashboard", "bookingsByChannel", filters] as const,
  bookingsBySegment: (filters: DashboardFilters) =>
    ["dashboard", "bookingsBySegment", filters] as const,
  occupancyOverTime: (filters: DashboardFilters, g: Granularity) =>
    ["dashboard", "occupancyOverTime", filters, g] as const,
  adrOverTime: (filters: DashboardFilters, g: Granularity) =>
    ["dashboard", "adrOverTime", filters, g] as const,
  cancellationsOverTime: (filters: DashboardFilters, g: Granularity) =>
    ["dashboard", "cancellationsOverTime", filters, g] as const,
  revenueByHotel: (filters: DashboardFilters, topN: number) =>
    ["dashboard", "revenueByHotel", filters, topN] as const,
  filterOptions: () => ["dashboard", "filterOptions"] as const,
};

// ── Individual hooks ──────────────────────────────────────────────────────────

export function useDashboardSummary(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.summary(filters),
    queryFn: () => fetchSummary(filters),
    placeholderData: (prev) => prev,  // keepPreviousData equivalent in v5
  });
}

export function useRevenueOverTime(filters: DashboardFilters) {
  const granularity = filters.granularity;
  return useQuery({
    queryKey: dashboardKeys.revenueOverTime(filters, granularity),
    queryFn: () => fetchRevenueOverTime(filters, granularity),
    placeholderData: (prev) => prev,
  });
}

export function useBookingsByChannel(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.bookingsByChannel(filters),
    queryFn: () => fetchBookingsByChannel(filters),
    placeholderData: (prev) => prev,
  });
}

export function useBookingsBySegment(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.bookingsBySegment(filters),
    queryFn: () => fetchBookingsBySegment(filters),
    placeholderData: (prev) => prev,
  });
}

export function useOccupancyOverTime(filters: DashboardFilters) {
  const granularity = filters.granularity;
  return useQuery({
    queryKey: dashboardKeys.occupancyOverTime(filters, granularity),
    queryFn: () => fetchOccupancyOverTime(filters, granularity),
    placeholderData: (prev) => prev,
  });
}

export function useADROverTime(filters: DashboardFilters) {
  const granularity = filters.granularity;
  return useQuery({
    queryKey: dashboardKeys.adrOverTime(filters, granularity),
    queryFn: () => fetchADROverTime(filters, granularity),
    placeholderData: (prev) => prev,
  });
}

export function useCancellationsOverTime(filters: DashboardFilters) {
  const granularity = filters.granularity;
  return useQuery({
    queryKey: dashboardKeys.cancellationsOverTime(filters, granularity),
    queryFn: () => fetchCancellationsOverTime(filters, granularity),
    placeholderData: (prev) => prev,
  });
}

export function useRevenueByHotel(filters: DashboardFilters, topN = 10) {
  return useQuery({
    queryKey: dashboardKeys.revenueByHotel(filters, topN),
    queryFn: () => fetchRevenueByHotel(filters, topN),
    placeholderData: (prev) => prev,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: dashboardKeys.filterOptions(),
    queryFn: fetchFilterOptions,
    staleTime: 30 * 60 * 1000,  // filter options change rarely
  });
}

/** Manual refresh — invalidate all dashboard queries */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
}
