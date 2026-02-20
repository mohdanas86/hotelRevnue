"use client";

import { useEffect, useState } from "react";
import {
  IconCurrencyRupee,
  IconBed,
  IconChartBar,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import { KpiCard } from "@/app/dashboard/_components/KPI/KapiComponents";

interface KPIData {
  total_revenue: number;
  total_revenue_change: number;

  avg_occupancy: number;
  avg_occupancy_change: number;

  avg_adr: number;
  avg_adr_change: number;

  avg_revpar: number;
  avg_revpar_change: number;

  total_cancellations: number;
  total_cancellations_change: number;
}

export default function KpiGrid() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:8000/api/kpi", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );

  if (!data) return <div>Failed to load KPI data</div>;

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
}
