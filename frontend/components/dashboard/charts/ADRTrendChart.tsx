"use client";

import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useADROverTime } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatDate, formatCurrencyFull } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    ADR_INR: { label: "ADR (₹)", color: "hsl(30 90% 55%)" },
};

interface Props { filters: DashboardFilters }

export const ADRTrendChart = React.memo(function ADRTrendChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useADROverTime(filters);

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
            title="ADR Trend"
            description="Average Daily Rate over time"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`}
                        width={52}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatCurrencyFull(Number(value))}
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="ADR_INR"
                        stroke="hsl(30 90% 55%)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ChartContainer>
        </ChartCard>
    );
});
