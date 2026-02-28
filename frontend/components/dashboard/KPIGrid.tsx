"use client";

import React from "react";
import {
    DollarSign,
    BedDouble,
    TrendingUp,
    BarChart2,
    Percent,
    XCircle,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { useDashboardSummary } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import {
    formatCurrency,
    formatNumber,
    formatPercent,
} from "@/lib/formatters";

interface KPIGridProps {
    filters: DashboardFilters;
}

export const KPIGrid = React.memo(function KPIGrid({ filters }: KPIGridProps) {
    const { data, isLoading, error } = useDashboardSummary(filters);

    const occupancyPct = data ? data.avg_occupancy * 100 : 0;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            <KPICard
                title="Total Revenue"
                value={data ? formatCurrency(data.total_revenue) : "—"}
                subtitle="Across all hotels"
                tooltip="Sum of Revenue_INR for the selected period and filters."
                icon={<DollarSign className="h-3.5 w-3.5" />}
                isLoading={isLoading && !data}
            />
            <KPICard
                title="Room Nights Sold"
                value={data ? formatNumber(data.total_bookings) : "—"}
                subtitle="Total rooms sold"
                tooltip="Total number of room nights sold (sum of Rooms_Sold)."
                icon={<BedDouble className="h-3.5 w-3.5" />}
                isLoading={isLoading && !data}
            />
            <KPICard
                title="Avg ADR"
                value={data ? formatCurrency(data.avg_adr, false) : "—"}
                subtitle="Average Daily Rate"
                tooltip="Average Daily Rate (ADR) — average revenue per occupied room."
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                isLoading={isLoading && !data}
            />
            <KPICard
                title="RevPAR"
                value={data ? formatCurrency(data.avg_revpar, false) : "—"}
                subtitle="Revenue Per Avail. Room"
                tooltip="RevPAR = Revenue ÷ Rooms Available. Key efficiency metric."
                icon={<BarChart2 className="h-3.5 w-3.5" />}
                isLoading={isLoading && !data}
            />
            <KPICard
                title="Occupancy"
                value={data ? formatPercent(occupancyPct) : "—"}
                subtitle="Avg occupancy rate"
                tooltip="Average occupancy rate across all hotels and dates."
                icon={<Percent className="h-3.5 w-3.5" />}
                isLoading={isLoading && !data}
            />
            <KPICard
                title="Cancellation Rate"
                value={data ? formatPercent(data.cancellation_rate) : "—"}
                subtitle={data ? `${formatNumber(data.total_cancellations)} cancellations` : undefined}
                tooltip="Cancellation rate = Cancellations ÷ Rooms Sold × 100."
                icon={<XCircle className="h-3.5 w-3.5" />}
                invertTrend
                isLoading={isLoading && !data}
            />
        </div>
    );
});
