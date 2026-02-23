"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { useOccupancyTrend } from "@/hooks/use-api";

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

const chartConfig = {
    occupancy: {
        label: "Occupancy Rate",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function OccupancyTrendChart() {
    const { data, loading, error, refresh } = useOccupancyTrend();

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Occupancy Trend</CardTitle>
                    <CardDescription>Track hotel occupancy rates over time</CardDescription>
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
                    <CardTitle>Occupancy Trend</CardTitle>
                    <CardDescription>Track hotel occupancy rates over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <IconX className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            Failed to load occupancy data: {error.message}
                            <Button variant="outline" size="sm" onClick={refresh}>
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Occupancy Trend</CardTitle>
                    <CardDescription>Track hotel occupancy rates over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                        No occupancy data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Occupancy Trend</CardTitle>
                <CardDescription>
                    Monitor occupancy rates across all hotels over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    formatter={(value, name) => [
                                        `${(Number(value) * 100).toFixed(1)}%`,
                                        'Occupancy Rate'
                                    ]}
                                />}
                            />
                            <Line
                                type="monotone"
                                dataKey="occupancy"
                                stroke="var(--color-occupancy)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-occupancy)", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}