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
import { useCancellationsOverTime } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatDate, formatPercent } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    cancellation_rate: { label: "Cancellation Rate %", color: "hsl(0 72% 51%)" },
};

interface Props { filters: DashboardFilters }

export const CancellationRateChart = React.memo(function CancellationRateChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useCancellationsOverTime(filters);

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
            title="Cancellation Rate"
            description="Cancellation % over time"
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
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                        width={42}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatPercent(Number(value))}
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="cancellation_rate"
                        stroke="hsl(0 72% 51%)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ChartContainer>
        </ChartCard>
    );
});
