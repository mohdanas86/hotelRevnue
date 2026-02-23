"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueTrendChart } from '@/components/RevenueTrendChart';
import { OccupancyTrendChart } from '@/components/OccupancyTrendChart';
import { RevenueByHotelChart } from '@/components/RevenueByHotelChart';
import { BookingChannelShareChart } from '@/components/BookingChannelShareChart';
import { ADRvsOccupancyScatter } from '@/app/dashboard/ADRvsOccupancyChart';

/**
 * Individual Charts Demo Page
 * Demonstrates each chart component separately for testing and documentation
 */
export default function ChartsDemo() {
    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Analytics Charts Demo</h1>
                <p className="text-muted-foreground">
                    Interactive showcase of all available chart components using Recharts
                </p>
            </div>

            <Tabs defaultValue="revenue-trend" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="revenue-trend">Revenue Trend</TabsTrigger>
                    <TabsTrigger value="occupancy-trend">Occupancy Trend</TabsTrigger>
                    <TabsTrigger value="hotel-revenue">Hotel Revenue</TabsTrigger>
                    <TabsTrigger value="channel-share">Channel Share</TabsTrigger>
                    <TabsTrigger value="adr-scatter">ADR vs Occupancy</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue-trend" className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Revenue Trend Chart</h2>
                        <p className="text-muted-foreground">
                            Line chart showing revenue trends over time using Recharts LineChart component
                        </p>
                    </div>
                    <RevenueTrendChart />
                    <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <strong>Features:</strong> ResponsiveContainer, Tooltip, Legend, Custom styling
                    </div>
                </TabsContent>

                <TabsContent value="occupancy-trend" className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Occupancy Trend Chart</h2>
                        <p className="text-muted-foreground">
                            Line chart displaying hotel occupancy rates over time with percentage formatting
                        </p>
                    </div>
                    <OccupancyTrendChart />
                    <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <strong>Features:</strong> LineChart, Percentage formatting, Custom tooltips
                    </div>
                </TabsContent>

                <TabsContent value="hotel-revenue" className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Revenue by Hotel Chart</h2>
                        <p className="text-muted-foreground">
                            Bar chart comparing revenue performance across different hotels
                        </p>
                    </div>
                    <RevenueByHotelChart />
                    <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <strong>Features:</strong> BarChart, Sorted data, Currency formatting, Rotated labels
                    </div>
                </TabsContent>

                <TabsContent value="channel-share" className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Booking Channel Share Chart</h2>
                        <p className="text-muted-foreground">
                            Pie chart showing revenue distribution across different booking channels
                        </p>
                    </div>
                    <BookingChannelShareChart />
                    <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <strong>Features:</strong> PieChart, Custom colors, Percentage labels, Legend
                    </div>
                </TabsContent>

                <TabsContent value="adr-scatter" className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">ADR vs Occupancy Scatter Plot</h2>
                        <p className="text-muted-foreground">
                            Scatter chart showing the relationship between Average Daily Rate and occupancy
                        </p>
                    </div>
                    <ADRvsOccupancyScatter />
                    <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <strong>Features:</strong> ScatterChart, Correlation analysis, Interactive tooltips
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}