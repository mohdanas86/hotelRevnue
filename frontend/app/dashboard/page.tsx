"use client";

import React, { memo } from "react";
import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import KpiGrid from "@/components/KpiGrid";

/* Lazy load heavy chart components for performance */
const RevenueTrendChart = dynamic(
  () =>
    import("@/components/RevenueTrendChart").then((m) => m.RevenueTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const RevenueByHotelChart = dynamic(
  () =>
    import("./_components/RevenueByHotel").then((m) => m.RevenueByHotelChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const RevenueByChannelChart = dynamic(
  () =>
    import("./_components/RevenueByChannel").then(
      (m) => m.RevenueByChannelChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const ADRvsOccupancyScatter = dynamic(
  () => import("./ADRvsOccupancyChart").then((m) => m.ADRvsOccupancyScatter),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const CancellationChart = dynamic(
  () => import("./CancellationChart").then((m) => m.CancellationChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

/* Skeleton Loader */
function ChartSkeleton() {
  return <div className="h-[350px] w-full rounded-xl bg-muted animate-pulse" />;
}

function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* KPI Grid */}
            <section>
              <KpiGrid />
            </section>

            {/* Revenue Trend */}
            <section className="w-full">
              <RevenueTrendChart />
            </section>

            {/* Revenue Hotel + Channel */}
            <section
              className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-2
            "
            >
              <RevenueByHotelChart />
              <RevenueByChannelChart />
            </section>

            {/* ADR Scatter + Cancellation */}
            <section
              className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-2
            "
            >
              <ADRvsOccupancyScatter />
              <CancellationChart />
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default memo(Page);
