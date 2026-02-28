"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useBookingsBySegment } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatNumber, formatCurrencyFull } from "@/lib/formatters";

const chartConfig: ChartConfig = {
    bookings: { label: "Bookings", color: "var(--chart-1)" },
    revenue: { label: "Revenue", color: "var(--chart-2)" },
};

interface Props { filters: DashboardFilters }

export const BookingsBySegmentChart = React.memo(function BookingsBySegmentChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useBookingsBySegment(filters);

    const chartData = useMemo(
        () =>
            (data?.data ?? []).map((d) => ({
                name: d.Market_Segment,
                bookings: d.bookings,
                revenue: d.revenue,
            })),
        [data]
    );

    return (
        <ChartCard
            title="Bookings by Market Segment"
            description="Room nights and revenue by market segment"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                    <YAxis
                        yAxisId="bookings"
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatNumber(v)}
                        width={60}
                    />
                    <YAxis
                        yAxisId="revenue"
                        orientation="right"
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${(v / 1_000_000).toFixed(0)}M`}
                        width={60}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) =>
                                    name === "revenue"
                                        ? formatCurrencyFull(Number(value))
                                        : formatNumber(Number(value))
                                }
                            />
                        }
                    />
                    <Legend iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
                    <Bar yAxisId="bookings" dataKey="bookings" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="revenue" dataKey="revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
});
