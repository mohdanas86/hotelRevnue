"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { useRevenueByHotel } from "@/hooks/use-api";

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
    revenue: {
        label: "Revenue (₹)",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function RevenueByHotelChart() {
    const { data, loading, error, refresh } = useRevenueByHotel();

    // Process and sort data by revenue
    const processedData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data
            .filter((item: any) => item && typeof item.Revenue_INR === 'number' && item.Revenue_INR > 0)
            .sort((a: any, b: any) => (b.Revenue_INR || 0) - (a.Revenue_INR || 0))
            .slice(0, 10) // Show top 10 hotels
            .map((item: any) => ({
                hotel: item.Hotel_Name || item.Hotel_ID || 'Unknown',
                revenue: item.Revenue_INR,
                hotelId: item.Hotel_ID
            }));
    }, [data]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Hotel</CardTitle>
                    <CardDescription>Compare revenue performance across hotels</CardDescription>
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
                    <CardTitle>Revenue by Hotel</CardTitle>
                    <CardDescription>Compare revenue performance across hotels</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <IconX className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            Failed to load revenue data: {error.message}
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
                    <CardTitle>Revenue by Hotel</CardTitle>
                    <CardDescription>Compare revenue performance across hotels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                        No revenue data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue by Hotel</CardTitle>
                <CardDescription>
                    Top {processedData.length} performing hotels by revenue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                            <XAxis
                                dataKey="hotel"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    formatter={(value, name) => [
                                        `₹${Number(value).toLocaleString()}`,
                                        'Revenue'
                                    ]}
                                    labelFormatter={(label) => `Hotel: ${label}`}
                                />}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="var(--color-revenue)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}