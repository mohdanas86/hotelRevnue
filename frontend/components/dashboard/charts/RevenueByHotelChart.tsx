"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useRevenueByHotel } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatCurrencyFull } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    revenue: { label: "Revenue (₹)", color: "var(--chart-4)" },
};

interface Props { filters: DashboardFilters }

export const RevenueByHotelChart = React.memo(function RevenueByHotelChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useRevenueByHotel(filters, 10);

    const chartData = useMemo(
        () =>
            (data?.data ?? []).map((d) => ({
                name: d.Hotel_ID,
                revenue: d.revenue,
                occupancy: d.avg_occupancy,
            })),
        [data]
    );

    return (
        <ChartCard
            title="Revenue by Hotel"
            description="Top 10 hotels by revenue"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${(v / 1_000_000).toFixed(0)}M`}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={48}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatCurrencyFull(Number(value))}
                            />
                        }
                    />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={20} fill="var(--chart-4)" />
                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
});
