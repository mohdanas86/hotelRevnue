"use client";

import React, { memo, Suspense } from "react";
import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ErrorBoundary, { ChartErrorFallback } from "@/components/ErrorBoundary";

import KpiGrid from "@/components/KpiGrid";

/* Optimized lazy loading with better error boundaries */
const RevenueTrendChart = dynamic(
  () => import("@/components/RevenueTrendChart").then((m) => m.RevenueTrendChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="Revenue Trend" />
  }
);

const RevenueByHotelChart = dynamic(
  () => import("./_components/RevenueByHotel").then((m) => m.RevenueByHotelChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="Revenue by Hotel" />
  }
);

const RevenueByChannelChart = dynamic(
  () => import("./_components/RevenueByChannel").then((m) => m.RevenueByChannelChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="Revenue by Channel" />
  }
);

const ADRvsOccupancyScatter = dynamic(
  () => import("./ADRvsOccupancyChart").then((m) => m.ADRvsOccupancyScatter),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="ADR vs Occupancy" />
  }
);

const CancellationChart = dynamic(
  () => import("./CancellationChart").then((m) => m.CancellationChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="Cancellations" />
  }
);

/* Enhanced Skeleton Loader with titles */
function ChartSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
      )}
      <div className="h-[350px] w-full rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* KPI Grid with Error Boundary */}
            <ErrorBoundary>
              <section aria-label="Key Performance Indicators">
                <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>}>
                  <KpiGrid />
                </Suspense>
              </section>
            </ErrorBoundary>

            {/* Revenue Trend with Error Boundary */}
            <ErrorBoundary fallback={ChartErrorFallback}>
              <section className="w-full" aria-label="Revenue Trend Analysis">
                <Suspense fallback={<ChartSkeleton title="Revenue Trend" />}>
                  <RevenueTrendChart />
                </Suspense>
              </section>
            </ErrorBoundary>

            {/* Revenue Charts Grid */}
            <section
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
              aria-label="Revenue Analysis by Hotel and Channel"
            >
              <ErrorBoundary fallback={ChartErrorFallback}>
                <Suspense fallback={<ChartSkeleton title="Revenue by Hotel" />}>
                  <RevenueByHotelChart />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={ChartErrorFallback}>
                <Suspense fallback={<ChartSkeleton title="Revenue by Channel" />}>
                  <RevenueByChannelChart />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* Analysis Charts Grid */}
            <section
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
              aria-label="Performance and Cancellation Analysis"
            >
              <ErrorBoundary fallback={ChartErrorFallback}>
                <Suspense fallback={<ChartSkeleton title="ADR vs Occupancy" />}>
                  <ADRvsOccupancyScatter />
                </Suspense>
              </ErrorBoundary>

              <ErrorBoundary fallback={ChartErrorFallback}>
                <Suspense fallback={<ChartSkeleton title="Cancellations" />}>
                  <CancellationChart />
                </Suspense>
              </ErrorBoundary>
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default memo(Page);
