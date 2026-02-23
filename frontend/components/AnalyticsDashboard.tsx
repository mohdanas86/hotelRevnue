"use client";

import React, { memo } from 'react';
import { RevenueTrendChart } from '@/components/RevenueTrendChart';
import { OccupancyTrendChart } from '@/components/OccupancyTrendChart';
import { RevenueByHotelChart } from '@/components/RevenueByHotelChart';
import { BookingChannelShareChart } from '@/components/BookingChannelShareChart';
import { ADRvsOccupancyScatter } from '@/app/dashboard/ADRvsOccupancyChart';
import { CancellationChart } from '@/app/dashboard/CancellationChart';

/**
 * Complete Analytics Dashboard with all chart components
 * Showcases revenue trends, hotel performance, channel analysis, and operational metrics
 */
export const AnalyticsDashboard = memo(function AnalyticsDashboard() {
    return (
        <div className="space-y-6 p-6">
            {/* Dashboard Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                    Comprehensive hotel revenue and performance analytics
                </p>
            </div>

            {/* Trend Analysis Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Trend Analysis</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RevenueTrendChart />
                    <OccupancyTrendChart />
                </div>
            </section>

            {/* Performance Analysis Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Performance Analysis</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RevenueByHotelChart />
                    <BookingChannelShareChart />
                </div>
            </section>

            {/* Operational Analysis Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Operational Analysis</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ADRvsOccupancyScatter />
                    <CancellationChart />
                </div>
            </section>
        </div>
    );
});

export default AnalyticsDashboard;