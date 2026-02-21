"use client";

import React, { memo } from "react";
import {
  IconCurrencyRupee,
  IconBed,
  IconChartBar,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import { KpiCard } from "@/app/dashboard/_components/KPI/KapiComponents";
import { useKPI } from "@/hooks/use-api";

const KpiGrid = memo(function KpiGrid() {
  const { data, loading, error, refresh } = useKPI();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive">
          <IconX className="h-4 w-4" />
          <span className="text-sm font-medium">Failed to load KPI data: {error.message}</span>
          <button
            onClick={refresh}
            className="ml-2 text-xs underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border rounded-lg p-4 bg-muted/5">
        <span className="text-sm text-muted-foreground">No KPI data available</span>
      </div>
    );
  }

  /* ---------- Helpers ---------- */

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1_000_000) return "₹" + (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return "₹" + (num / 1_000).toFixed(1) + "K";
    return "₹" + num.toString();
  };

  const formatChange = (value: number) => {
    const percent = (value * 100).toFixed(1);
    return `${value >= 0 ? "+" : ""}${percent}%`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <KpiCard
        title="Total Revenue"
        value={formatCurrency(data.total_revenue)}
        // change={formatChange(data.total_revenue_change)}
        icon={<IconCurrencyRupee className="size-4" />}
        footerTitle="Revenue performance"
        footerSubtitle="Across all hotels"
      />

      <KpiCard
        title="Avg Occupancy"
        value={`${(data.avg_occupancy * 100).toFixed(1)}%`}
        // change={formatChange(data.avg_occupancy_change)}
        icon={<IconBed className="size-4" />}
        footerTitle="Room utilization"
        footerSubtitle="Average occupancy rate"
      />

      <KpiCard
        title="Average ADR"
        value={formatCurrency(data.avg_adr)}
        // change={formatChange(data.avg_adr_change)}
        icon={<IconTrendingUp className="size-4" />}
        footerTitle="Pricing strength"
        footerSubtitle="Average Daily Rate"
      />

      <KpiCard
        title="RevPAR"
        value={formatCurrency(data.avg_revpar)}
        // change={formatChange(data.avg_revpar_change)}
        icon={<IconChartBar className="size-4" />}
        footerTitle="Revenue efficiency"
        footerSubtitle="Revenue per available room"
      />

      <KpiCard
        title="Total Cancellations"
        value={formatNumber(data.total_cancellations)}
        // change={formatChange(data.total_cancellations_change)}
        icon={<IconX className="size-4" />}
        footerTitle="Booking risk"
        footerSubtitle="Cancelled bookings"
      />
    </div>
  );
});

export default KpiGrid;
