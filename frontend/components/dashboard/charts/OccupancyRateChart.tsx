"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useOccupancyOverTime } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatDate, formatPercent } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    Occupancy_Rate: { label: "Occupancy %", color: "var(--chart-3)" },
};

interface Props { filters: DashboardFilters }

export const OccupancyRateChart = React.memo(function OccupancyRateChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useOccupancyOverTime(filters);

    const chartData = useMemo(
        () =>
            (data?.data ?? []).map((d) => ({
                ...d,
                label: formatDate(d.Date, filters.granularity),
            })),
        [data, filters.granularity]
    );

    return (
        <ChartCard
            title="Occupancy Rate"
            description="Average occupancy % over time"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                        width={42}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatPercent(Number(value))}
                            />
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="Occupancy_Rate"
                        stroke="var(--chart-3)"
                        strokeWidth={2}
                        fill="url(#occupancyGrad)"
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
});
