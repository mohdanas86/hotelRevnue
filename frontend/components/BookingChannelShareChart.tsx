"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

import { useRevenueByChannel } from "@/hooks/use-api";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
];

const chartConfig = {
    channels: {
        label: "Booking Channels",
    },
} satisfies ChartConfig;

export function BookingChannelShareChart() {
    const { data, loading, error, refresh } = useRevenueByChannel();

    // Process data for pie chart
    const processedData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        const channelData = data
            .filter((item: any) => item && typeof item.Revenue_INR === 'number' && item.Revenue_INR > 0)
            .map((item: any) => ({
                name: item.Booking_Channel || 'Unknown',
                value: item.Revenue_INR,
                share: item.Market_Share || 0
            }))
            .sort((a, b) => b.value - a.value);

        // Calculate total revenue for percentage
        const total = channelData.reduce((sum, item) => sum + item.value, 0);

        return channelData.map((item, index) => ({
            ...item,
            percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0',
            fill: COLORS[index % COLORS.length]
        }));
    }, [data]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Channel Share</CardTitle>
                    <CardDescription>Revenue distribution by booking channels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full rounded-xl bg-muted animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Channel Share</CardTitle>
                    <CardDescription>Revenue distribution by booking channels</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <IconX className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            Failed to load channel data: {error.message}
                            <Button variant="outline" size="sm" onClick={refresh}>
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!processedData || processedData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Channel Share</CardTitle>
                    <CardDescription>Revenue distribution by booking channels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                        No channel data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Channel Share</CardTitle>
                <CardDescription>
                    Revenue contribution by booking channel ({processedData.length} channels)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <Pie
                                data={processedData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    formatter={(value, name) => [
                                        `₹${Number(value).toLocaleString()}`,
                                        'Revenue'
                                    ]}
                                    labelFormatter={(label) => `${label}`}
                                />}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry: any) => (
                                    <span style={{ color: entry.color }}>
                                        {value} ({entry.payload.percentage}%)
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}