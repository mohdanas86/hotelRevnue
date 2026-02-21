"use client";

import React, { memo, Suspense, lazy, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ErrorBoundary, { ChartErrorFallback } from "@/components/ErrorBoundary";

// Immediately load critical components
import KpiGrid from "@/components/KpiGrid";

// Priority 1: Essential charts (visible immediately)
const RevenueTrendChart = dynamic(
  () => import("@/components/RevenueTrendChart").then((m) => m.RevenueTrendChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton title="Revenue Trend" />
  }
);

// Priority 2: Secondary charts (load after trend)
const RevenueChartsGroup = dynamic(
  () => Promise.all([
    import("./_components/RevenueByHotel").then(m => ({ RevenueByHotelChart: m.RevenueByHotelChart })),
    import("./_components/RevenueByChannel").then(m => ({ RevenueByChannelChart: m.RevenueByChannelChart }))
  ]).then(([hotel, channel]) => ({
    default: () => (
      <>
        <hotel.RevenueByHotelChart />
        <channel.RevenueByChannelChart />
      </>
    )
  })),
  {
    ssr: false,
    loading: () => (
      <>
        <ChartSkeleton title="Revenue by Hotel" />
        <ChartSkeleton title="Revenue by Channel" />
      </>
    )
  }
);

// Priority 3: Analysis charts (lazy load on scroll)
const AnalysisChartsGroup = lazy(
  () => Promise.all([
    import("./ADRvsOccupancyChart").then(m => ({ ADRvsOccupancyScatter: m.ADRvsOccupancyScatter })),
    import("./CancellationChart").then(m => ({ CancellationChart: m.CancellationChart }))
  ]).then(([adr, cancellation]) => ({
    default: () => (
      <>
        <adr.ADRvsOccupancyScatter />
        <cancellation.CancellationChart />
      </>
    )
  }))
);

/* Enhanced Skeleton Loader with reduced animation */
function ChartSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
        </div>
      )}
      <div className="h-[350px] w-full rounded-xl bg-muted" />
    </div>
  );
}

/* Intersection Observer Hook for Lazy Loading */
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { threshold, rootMargin: '200px' } // Start loading 200px before visible
    );

    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, isInView]);

  return [setNode, isInView] as const;
}

function Page() {
  const [analysisRef, analysisInView] = useInView(0.1);

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
            {/* Priority 1: KPI Grid - Critical data loaded immediately */}
            <ErrorBoundary>
              <section aria-label="Key Performance Indicators">
                <KpiGrid />
              </section>
            </ErrorBoundary>

            {/* Priority 2: Revenue Trend - Primary visualization */}
            <ErrorBoundary fallback={ChartErrorFallback}>
              <section className="w-full" aria-label="Revenue Trend Analysis">
                <Suspense fallback={<ChartSkeleton title="Revenue Trend" />}>
                  <RevenueTrendChart />
                </Suspense>
              </section>
            </ErrorBoundary>

            {/* Priority 3: Revenue Charts - Secondary data */}
            <ErrorBoundary fallback={ChartErrorFallback}>
              <section
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
                aria-label="Revenue Analysis by Hotel and Channel"
              >
                <Suspense fallback={<><ChartSkeleton title="Revenue by Hotel" /><ChartSkeleton title="Revenue by Channel" /></>}>
                  <RevenueChartsGroup />
                </Suspense>
              </section>
            </ErrorBoundary>

            {/* Priority 4: Analysis Charts - Load on scroll with intersection observer */}
            <div
              ref={analysisRef}
              className="min-h-[100px]" // Reserve space to trigger intersection
            >
              {analysisInView && (
                <ErrorBoundary fallback={ChartErrorFallback}>
                  <section
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
                    aria-label="Performance and Cancellation Analysis"
                  >
                    <Suspense fallback={<><ChartSkeleton title="ADR vs Occupancy" /><ChartSkeleton title="Cancellations" /></>}>
                      <AnalysisChartsGroup />
                    </Suspense>
                  </section>
                </ErrorBoundary>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default memo(Page);
