"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useRevenueOverTime, useRefreshDashboard } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatDate, formatCurrencyFull } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    Revenue_INR: {
        label: "Revenue",
        color: "var(--primary)",
    },
};

interface Props { filters: DashboardFilters }

export const RevenueOverTimeChart = React.memo(function RevenueOverTimeChart({ filters }: Props) {
    const { data, isLoading, error, refetch, dataUpdatedAt } = useRevenueOverTime(filters);
    const refresh = useRefreshDashboard();

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
            title="Revenue Over Time"
            description="Total revenue grouped by selected granularity"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${(v / 1_000_000).toFixed(1)}M`}
                        width={56}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatCurrencyFull(Number(value))}
                            />
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="Revenue_INR"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fill="url(#revenueGrad)"
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
});
