/**
 * Example integration of FilterPanel component with existing dashboard
 * This demonstrates how to integrate filtering into your current dashboard
 */

'use client';

import React, { useState, useCallback } from 'react';
import { FilterPanel, type FilterState } from '@/components/FilterPanel';
import { useFilteredDashboardData } from '@/hooks/use-filtered-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';

// Example integration component
export function DashboardWithFilters() {
    const [showFilters, setShowFilters] = useState(true);

    // Use the filtered dashboard data hook
    const {
        kpi,
        revenueTrend,
        revenueByHotel,
        revenueByChannel,
        marketSegment,
        filterMetadata,
        loading,
        errors,
        currentFilters,
        applyFilters,
        refreshAll,
    } = useFilteredDashboardData();

    // Handle filter changes
    const handleFiltersChange = useCallback((filters: FilterState) => {
        console.log('Applying filters:', filters);
        applyFilters(filters);
    }, [applyFilters]);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Hotel Revenue Dashboard</h1>
                        <p className="text-muted-foreground">
                            Filter and analyze your hotel revenue data
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                        <Button
                            variant="outline"
                            onClick={refreshAll}
                            disabled={loading}
                        >
                            {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="lg:col-span-1">
                            <FilterPanel
                                onFiltersChange={handleFiltersChange}
                                loading={loading}
                                hotels={filterMetadata.hotels}
                                bookingChannels={filterMetadata.bookingChannels}
                                marketSegments={filterMetadata.marketSegments}
                                filters={currentFilters}
                            />
                        </div>
                    )}

                    {/* Main Dashboard Content */}
                    <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
                        {/* Error Display */}
                        {errors.length > 0 && (
                            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                                <h3 className="font-semibold text-destructive">Error Loading Data</h3>
                                <ul className="mt-2 text-sm text-destructive">
                                    {errors.map((error, index) => (
                                        <li key={index}>• {error?.message || 'Unknown error occurred'}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {loading ? (
                                            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                                        ) : (
                                            `₹${(kpi as any)?.total_revenue?.toLocaleString() || '0'}`
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {loading ? (
                                            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                                        ) : (
                                            `${(((kpi as any)?.avg_occupancy || 0) * 100).toFixed(1)}%`
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg ADR</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {loading ? (
                                            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                                        ) : (
                                            `₹${(kpi as any)?.avg_adr?.toLocaleString() || '0'}`
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Cancellations</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {loading ? (
                                            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                                        ) : (
                                            (kpi as any)?.total_cancellations?.toLocaleString() || '0'
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Data Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue by Hotel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue by Hotel</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {(revenueByHotel as any)?.slice(0, 5).map((hotel: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-sm">{hotel.Hotel_ID}</span>
                                                    <span className="text-sm font-medium">
                                                        ₹{hotel.Revenue_INR?.toLocaleString()}
                                                    </span>
                                                </div>
                                            )) || <p className="text-muted-foreground">No data available</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Revenue by Channel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue by Channel</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {(revenueByChannel as any)?.slice(0, 5).map((channel: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-sm">{channel.Booking_Channel}</span>
                                                    <span className="text-sm font-medium">
                                                        ₹{channel.Revenue_INR?.toLocaleString()}
                                                    </span>
                                                </div>
                                            )) || <p className="text-muted-foreground">No data available</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filter Status */}
                        {Object.keys(currentFilters).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Filters</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {currentFilters.startDate && (
                                            <div className="rounded bg-primary/10 px-2 py-1">
                                                From: {currentFilters.startDate}
                                            </div>
                                        )}
                                        {currentFilters.endDate && (
                                            <div className="rounded bg-primary/10 px-2 py-1">
                                                To: {currentFilters.endDate}
                                            </div>
                                        )}
                                        {currentFilters.hotelId && (
                                            <div className="rounded bg-primary/10 px-2 py-1">
                                                Hotel: {currentFilters.hotelId}
                                            </div>
                                        )}
                                        {currentFilters.bookingChannel && (
                                            <div className="rounded bg-primary/10 px-2 py-1">
                                                Channel: {currentFilters.bookingChannel}
                                            </div>
                                        )}
                                        {currentFilters.marketSegment && (
                                            <div className="rounded bg-primary/10 px-2 py-1">
                                                Segment: {currentFilters.marketSegment}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Usage instructions component
export function FilterPanelUsageExample() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold">Filter Panel Integration Guide</h1>

            <Card>
                <CardHeader>
                    <CardTitle>How to Use the Filter Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">1. Import the Components</h3>
                        <pre className="mt-2 rounded bg-muted p-4 text-sm">
                            {`import { FilterPanel, type FilterState } from '@/components/FilterPanel';
import { useFilteredDashboardData } from '@/hooks/use-filtered-api';`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold">2. Use the Hook</h3>
                        <pre className="mt-2 rounded bg-muted p-4 text-sm">
                            {`const {
  kpi,
  revenueTrend,
  revenueByHotel,
  filterMetadata,
  loading,
  currentFilters,
  applyFilters,
} = useFilteredDashboardData();`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold">3. Add the Filter Panel</h3>
                        <pre className="mt-2 rounded bg-muted p-4 text-sm">
                            {`<FilterPanel
  onFiltersChange={applyFilters}
  loading={loading}
  hotels={filterMetadata.hotels}
  bookingChannels={filterMetadata.bookingChannels}
  marketSegments={filterMetadata.marketSegments}
  filters={currentFilters}
/>`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold">4. API Calls</h3>
                        <p className="text-sm text-muted-foreground">
                            The filter panel automatically generates API calls with query parameters like:
                        </p>
                        <pre className="mt-2 rounded bg-muted p-4 text-sm">
                            {`GET /api/kpi?hotel_id=H101&start_date=2024-01-01&end_date=2024-01-31
GET /api/revenue-trend?booking_channel=OTA&market_segment=Corporate`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}