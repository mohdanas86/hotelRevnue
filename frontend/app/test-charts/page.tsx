"use client";

import React from 'react';
import { RevenueTrendChart } from '@/components/RevenueTrendChart';
import { OccupancyTrendChart } from '@/components/OccupancyTrendChart';
import { RevenueByHotelChart } from '@/components/RevenueByHotelChart';
import { BookingChannelShareChart } from '@/components/BookingChannelShareChart';
import { ADRvsOccupancyScatter } from '@/app/dashboard/ADRvsOccupancyChart';
import { CancellationChart } from '@/app/dashboard/CancellationChart';

/**
 * Quick test page to check all charts are displaying data
 */
export default function TestChartsPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Chart Data Test</h1>
                <p className="text-muted-foreground">
                    Quick visual test to verify all charts are displaying data correctly
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Trend */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Revenue Trend</h3>
                    <RevenueTrendChart />
                </div>

                {/* Occupancy Trend */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Occupancy Trend</h3>
                    <OccupancyTrendChart />
                </div>

                {/* Revenue by Hotel */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Revenue by Hotel</h3>
                    <RevenueByHotelChart />
                </div>

                {/* Booking Channel Share */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Booking Channel Share</h3>
                    <BookingChannelShareChart />
                </div>

                {/* ADR vs Occupancy Scatter */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">ADR vs Occupancy</h3>
                    <ADRvsOccupancyScatter />
                </div>

                {/* Cancellation Chart */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Cancellations by Channel</h3>
                    <CancellationChart />
                </div>

            </div>
        </div>
    );
}