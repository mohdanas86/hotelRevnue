"use client";

import React, {
    useState,
    useCallback,
    useMemo,
    useTransition,
    Suspense,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RevenueOverTimeChart } from "@/components/dashboard/charts/RevenueOverTimeChart";
import { BookingsByChannelChart } from "@/components/dashboard/charts/BookingsByChannelChart";
import { BookingsBySegmentChart } from "@/components/dashboard/charts/BookingsBySegmentChart";
import { OccupancyRateChart } from "@/components/dashboard/charts/OccupancyRateChart";
import { ADRTrendChart } from "@/components/dashboard/charts/ADRTrendChart";
import { CancellationRateChart } from "@/components/dashboard/charts/CancellationRateChart";
import { RevenueByHotelChart } from "@/components/dashboard/charts/RevenueByHotelChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardFilters } from "@/types/dashboard";
import {
    parseFiltersFromParams,
    buildParams,
    DEFAULT_FILTERS,
} from "@/lib/filterUtils";
import { useRefreshDashboard, useDashboardSummary } from "@/hooks/useDashboard";

export function DashboardLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    // ── Filter state from URL ────────────────────────────────────────────────
    const filters = useMemo<DashboardFilters>(
        () => parseFiltersFromParams(searchParams),
        [searchParams]
    );

    const setFilters = useCallback(
        (partial: Partial<DashboardFilters>) => {
            const next: DashboardFilters = { ...filters, ...partial };
            const params = buildParams(next);
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [filters, pathname, router]
    );

    // ── Refresh ──────────────────────────────────────────────────────────────
    const refresh = useRefreshDashboard();
    const { dataUpdatedAt } = useDashboardSummary(filters);

    return (
        <div className="flex flex-col gap-5 p-4 md:p-6">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div>
                <h1 className="text-xl font-bold tracking-tight">Hotel Revenue Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Real-time analytics across all properties
                </p>
            </div>

            {/* ── Filter Bar ──────────────────────────────────────────────────── */}
            <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                onRefresh={refresh}
                lastUpdated={dataUpdatedAt}
            />

            {/* ── KPI Cards ───────────────────────────────────────────────────── */}
            <KPIGrid filters={filters} />

            {/* ── Revenue Over Time (full width) ──────────────────────────────── */}
            <RevenueOverTimeChart filters={filters} />

            {/* ── Row: Bookings breakdown ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <BookingsByChannelChart filters={filters} />
                <BookingsBySegmentChart filters={filters} />
            </div>

            {/* ── Row: Occupancy + ADR ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <OccupancyRateChart filters={filters} />
                <ADRTrendChart filters={filters} />
            </div>

            {/* ── Row: Revenue by Hotel + Cancellations ───────────────────────── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <RevenueByHotelChart filters={filters} />
                <CancellationRateChart filters={filters} />
            </div>

            <Separator />

            {/* ── Data Table ──────────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Daily Revenue Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable filters={filters} />
                </CardContent>
            </Card>
        </div>
    );
}
