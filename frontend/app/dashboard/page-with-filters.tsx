"use client";

import React, { memo, Suspense, lazy, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "../../hooks/use-intersection-observer";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilterPanel, type FilterState } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { useFilteredDashboardData } from "@/hooks/use-filtered-api";
import ErrorBoundary, { ChartErrorFallback } from "@/components/ErrorBoundary";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Immediately load critical components
import KpiGrid from "@/components/KpiGrid";

// Loading skeleton component for charts
const ChartSkeleton = memo(({ title }: { title: string }) => (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="mt-6 h-[200px] w-full animate-pulse rounded bg-muted"></div>
    </div>
));

// Priority 1: Essential charts (visible immediately)
const RevenueTrendChart = dynamic(
    () => import("@/components/RevenueTrendChart").then((m) => m.RevenueTrendChart),
    {
        ssr: false,
        loading: () => <ChartSkeleton title="Revenue Trend" />
    }
);

// Priority 2: Secondary charts (load after trend)
const RevenueChartsGroup = dynamic(
    () => Promise.all([
        import("./_components/RevenueByHotel").then(m => ({ RevenueByHotelChart: m.RevenueByHotelChart })),
        import("./_components/RevenueByChannel").then(m => ({ RevenueByChannelChart: m.RevenueByChannelChart }))
    ]).then(([hotel, channel]) => ({
        default: () => (
            <>
                <hotel.RevenueByHotelChart />
                <channel.RevenueByChannelChart />
            </>
        )
    })),
    {
        ssr: false,
        loading: () => (
            <>
                <ChartSkeleton title="Revenue by Hotel" />
                <ChartSkeleton title="Revenue by Channel" />
            </>
        )
    }
);

// Priority 3: Analysis charts (lazy load on scroll)
const AnalysisChartsGroup = lazy(
    () => Promise.all([
        import("./ADRvsOccupancyChart").then(m => ({ ADRvsOccupancyScatter: m.ADRvsOccupancyScatter })),
        import("./CancellationChart").then(m => ({ CancellationChart: m.CancellationChart }))
    ]).then(([scatter, cancellation]) => ({
        default: () => (
            <>
                <scatter.ADRvsOccupancyScatter />
                <cancellation.CancellationChart />
            </>
        )
    }))
);

function DashboardPage() {
    // Filter panel state
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Dashboard data with filtering
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

    // Intersection observer for lazy loading analysis charts
    const [analysisRef, analysisInView] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '50px',
    });

    // Check if mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsFilterPanelOpen(true); // Keep open on desktop by default
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle filter changes
    const handleFiltersChange = useCallback((filters: FilterState) => {
        applyFilters(filters);
    }, [applyFilters]);

    // Handle filter panel toggle
    const toggleFilterPanel = useCallback(() => {
        setIsFilterPanelOpen(prev => !prev);
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <main className="flex min-h-screen bg-background">
                    {/* Main Content */}
                    <div className={cn(
                        "flex-1 transition-all duration-300 ease-in-out",
                        isFilterPanelOpen && !isMobile ? "mr-80" : "mr-0"
                    )}>
                        <div className="flex-1 space-y-6 p-6">
                            {/* Dashboard Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Hotel Revenue Dashboard</h1>
                                    <p className="text-muted-foreground">
                                        Monitor your hotel&apos;s performance with real-time analytics and insights
                                    </p>
                                </div>

                                {/* Filter Toggle & Controls */}
                                <div className="flex items-center gap-2">
                                    {errors.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={refreshAll}
                                            disabled={loading}
                                        >
                                            Retry
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleFilterPanel}
                                        className="flex items-center gap-2"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Filters
                                        {isFilterPanelOpen ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <ChevronLeft className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

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

                            {/* Active Filters Summary */}
                            {Object.keys(currentFilters).length > 0 && (
                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <p className="text-sm font-medium">Active Filters:</p>
                                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                                        {currentFilters.startDate && (
                                            <span>From: {currentFilters.startDate}</span>
                                        )}
                                        {currentFilters.endDate && (
                                            <span>To: {currentFilters.endDate}</span>
                                        )}
                                        {currentFilters.hotelId && (
                                            <span>Hotel: {currentFilters.hotelId}</span>
                                        )}
                                        {currentFilters.bookingChannel && (
                                            <span>Channel: {currentFilters.bookingChannel}</span>
                                        )}
                                        {currentFilters.marketSegment && (
                                            <span>Segment: {currentFilters.marketSegment}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Priority 1: KPI Grid */}
                            <ErrorBoundary fallback={ChartErrorFallback}>
                                <section aria-label="Key Performance Indicators">
                                    <KpiGrid />
                                </section>
                            </ErrorBoundary>

                            {/* Priority 2: Revenue Trend Chart */}
                            <ErrorBoundary fallback={ChartErrorFallback}>
                                <section aria-label="Revenue Trends">
                                    <Suspense fallback={<ChartSkeleton title="Revenue Trend" />}>
                                        <RevenueTrendChart />
                                    </Suspense>
                                </section>
                            </ErrorBoundary>

                            {/* Priority 3: Revenue Analysis Charts */}
                            <ErrorBoundary fallback={ChartErrorFallback}>
                                <section
                                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                                    aria-label="Revenue Analysis"
                                >
                                    <Suspense fallback={
                                        <>
                                            <ChartSkeleton title="Revenue by Hotel" />
                                            <ChartSkeleton title="Revenue by Channel" />
                                        </>
                                    }>
                                        <RevenueChartsGroup />
                                    </Suspense>
                                </section>
                            </ErrorBoundary>

                            {/* Priority 4: Analysis Charts - Load on scroll */}
                            <div
                                ref={analysisRef}
                                className="min-h-[100px]" // Reserve space to trigger intersection
                            >
                                {analysisInView && (
                                    <ErrorBoundary fallback={ChartErrorFallback}>
                                        <section
                                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"
                                            aria-label="Performance and Cancellation Analysis"
                                        >
                                            <Suspense fallback={
                                                <>
                                                    <ChartSkeleton title="ADR vs Occupancy" />
                                                    <ChartSkeleton title="Cancellations" />
                                                </>
                                            }>
                                                <AnalysisChartsGroup />
                                            </Suspense>
                                        </section>
                                    </ErrorBoundary>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel Overlay/Sidebar */}
                    {isFilterPanelOpen && (
                        <>
                            {/* Mobile Overlay */}
                            {isMobile && (
                                <div
                                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                                    onClick={toggleFilterPanel}
                                />
                            )}

                            {/* Filter Panel */}
                            <div className={cn(
                                "fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-background shadow-lg transition-transform duration-300",
                                "lg:relative lg:z-auto lg:shadow-none",
                                isMobile && !isFilterPanelOpen && "translate-x-full",
                                "border-l"
                            )}>
                                {/* Panel Header (Mobile) */}
                                {isMobile && (
                                    <div className="flex items-center justify-between border-b p-4 lg:hidden">
                                        <h2 className="text-lg font-semibold">Filter Data</h2>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleFilterPanel}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {/* Filter Panel Content */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <FilterPanel
                                        onFiltersChange={handleFiltersChange}
                                        loading={loading}
                                        hotels={filterMetadata.hotels}
                                        bookingChannels={filterMetadata.bookingChannels}
                                        marketSegments={filterMetadata.marketSegments}
                                        filters={currentFilters}
                                        isCompact={isMobile}
                                        className="border-0 shadow-none"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default memo(DashboardPage);