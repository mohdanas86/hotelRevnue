"use client";

import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useBookingsByChannel } from "@/hooks/useDashboard";
import type { DashboardFilters } from "@/types/dashboard";
import { formatNumber, formatPercent } from "@/lib/formatters";

const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

interface Props { filters: DashboardFilters }

export const BookingsByChannelChart = React.memo(function BookingsByChannelChart({ filters }: Props) {
    const { data, isLoading, error, refetch } = useBookingsByChannel(filters);

    const chartData = useMemo(
        () =>
            (data?.data ?? []).map((d) => ({
                name: d.Booking_Channel,
                value: d.bookings,
                share: d.share_pct,
            })),
        [data]
    );

    const chartConfig: ChartConfig = useMemo(
        () =>
            Object.fromEntries(
                chartData.map((d, i) => [
                    d.name,
                    { label: d.name, color: COLORS[i % COLORS.length] },
                ])
            ),
        [chartData]
    );

    return (
        <ChartCard
            title="Bookings by Channel"
            description="Room nights sold per booking channel"
            isLoading={isLoading && !data}
            error={error as Error | null}
            isEmpty={!isLoading && chartData.length === 0}
            onRetry={refetch}
        >
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                    >
                        {chartData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) =>
                                    `${formatNumber(Number(value))} (${chartData.find((d) => d.name === name)?.share ?? 0}%)`
                                }
                            />
                        }
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span className="text-xs">{v}</span>}
                    />
                </PieChart>
            </ChartContainer>
        </ChartCard>
    );
});
