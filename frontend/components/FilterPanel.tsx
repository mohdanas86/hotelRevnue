/**
 * Filter Panel Component for Hotel Revenue Dashboard
 * Provides date range, hotel, channel, and segment filtering
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Filter, X, Calendar, Building2, Users, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Filter types
export interface FilterState {
    startDate?: string;
    endDate?: string;
    hotelId?: string;
    bookingChannel?: string;
    marketSegment?: string;
}

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterPanelProps {
    onFiltersChange: (filters: FilterState) => void;
    loading?: boolean;
    className?: string;
    // Filter options
    hotels?: FilterOption[];
    bookingChannels?: FilterOption[];
    marketSegments?: FilterOption[];
    // Current filter state
    filters?: FilterState;
    // Compact mode for mobile
    isCompact?: boolean;
}

export function FilterPanel({
    onFiltersChange,
    loading = false,
    className,
    hotels = [],
    bookingChannels = [],
    marketSegments = [],
    filters = {},
    isCompact = false,
}: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);
    const [hasChanges, setHasChanges] = useState(false);

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
        setHasChanges(false);
    }, [filters]);

    // Track if there are unsaved changes
    useEffect(() => {
        const hasUnsavedChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);
        setHasChanges(hasUnsavedChanges);
    }, [localFilters, filters]);

    // Handle individual filter changes
    const handleFilterChange = useCallback((key: keyof FilterState, value: string | undefined) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value || undefined,
        }));
    }, []);

    // Apply filters
    const applyFilters = useCallback(() => {
        onFiltersChange(localFilters);
        setHasChanges(false);
    }, [localFilters, onFiltersChange]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        const emptyFilters: FilterState = {};
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
        setHasChanges(false);
    }, [onFiltersChange]);

    // Reset to last applied filters
    const resetFilters = useCallback(() => {
        setLocalFilters(filters);
        setHasChanges(false);
    }, [filters]);

    // Get active filter count
    const getActiveFilterCount = () => {
        return Object.values(filters).filter(value => value && value.length > 0).length;
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Get date 30 days ago
    const getThirtyDaysAgo = () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    };

    if (isCompact) {
        return (
            <Card className={cn('w-full', className)}>
                <CardContent className="pt-4">
                    {/* Mobile Filter Summary */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Filters</span>
                            {getActiveFilterCount() > 0 && (
                                <Badge variant="secondary" className="h-5 px-2 text-xs">
                                    {getActiveFilterCount()}
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAllFilters}
                                disabled={loading || getActiveFilterCount() === 0}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={applyFilters}
                                disabled={loading || !hasChanges}
                            >
                                {loading && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Compact Filter Grid */}
                    <div className="space-y-3">
                        {/* Date Range Row */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="start-date" className="text-xs text-muted-foreground">From</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={localFilters.startDate || ''}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    max={getTodayDate()}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="end-date" className="text-xs text-muted-foreground">To</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={localFilters.endDate || ''}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    max={getTodayDate()}
                                    min={localFilters.startDate}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="space-y-2">
                            <Select
                                value={localFilters.hotelId || ''}
                                onValueChange={(value) => handleFilterChange('hotelId', value)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Hotels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Hotels</SelectItem>
                                    {hotels.map((hotel) => (
                                        <SelectItem key={hotel.value} value={hotel.value}>
                                            {hotel.label}
                                            {hotel.count && <span className="text-muted-foreground ml-1">({hotel.count})</span>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={localFilters.bookingChannel || ''}
                                onValueChange={(value) => handleFilterChange('bookingChannel', value)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Channels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Channels</SelectItem>
                                    {bookingChannels.map((channel) => (
                                        <SelectItem key={channel.value} value={channel.value}>
                                            {channel.label}
                                            {channel.count && <span className="text-muted-foreground ml-1">({channel.count})</span>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={localFilters.marketSegment || ''}
                                onValueChange={(value) => handleFilterChange('marketSegment', value)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Segments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Segments</SelectItem>
                                    {marketSegments.map((segment) => (
                                        <SelectItem key={segment.value} value={segment.value}>
                                            {segment.label}
                                            {segment.count && <span className="text-muted-foreground ml-1">({segment.count})</span>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('w-full', className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Dashboard Data
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {getActiveFilterCount() > 0 && (
                            <Badge variant="secondary">
                                {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                            </Badge>
                        )}
                        {hasChanges && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Unsaved changes
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Date Range Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Date Range
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={localFilters.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                max={getTodayDate()}
                                placeholder="Select start date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={localFilters.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                max={getTodayDate()}
                                min={localFilters.startDate}
                                placeholder="Select end date"
                            />
                        </div>
                    </div>
                    {/* Quick date presets */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = getTodayDate();
                                const thirtyDays = getThirtyDaysAgo();
                                setLocalFilters(prev => ({
                                    ...prev,
                                    startDate: thirtyDays,
                                    endDate: today,
                                }));
                            }}
                        >
                            Last 30 days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = getTodayDate();
                                const date = new Date();
                                date.setDate(date.getDate() - 7);
                                const weekAgo = date.toISOString().split('T')[0];
                                setLocalFilters(prev => ({
                                    ...prev,
                                    startDate: weekAgo,
                                    endDate: today,
                                }));
                            }}
                        >
                            Last 7 days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const date = new Date();
                                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                                setLocalFilters(prev => ({
                                    ...prev,
                                    startDate: firstDay.toISOString().split('T')[0],
                                    endDate: lastDay.toISOString().split('T')[0],
                                }));
                            }}
                        >
                            This month
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Hotel Selection */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        Hotel
                    </div>
                    <Select
                        value={localFilters.hotelId || ''}
                        onValueChange={(value) => handleFilterChange('hotelId', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select hotel or leave blank for all" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Hotels</SelectItem>
                            <SelectGroup>
                                <SelectLabel>Available Hotels</SelectLabel>
                                {hotels.map((hotel) => (
                                    <SelectItem key={hotel.value} value={hotel.value}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{hotel.label}</span>
                                            {hotel.count && <span className="text-muted-foreground text-xs">({hotel.count} records)</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Booking Channel Selection */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ShoppingCart className="h-4 w-4" />
                        Booking Channel
                    </div>
                    <Select
                        value={localFilters.bookingChannel || ''}
                        onValueChange={(value) => handleFilterChange('bookingChannel', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select booking channel or leave blank for all" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Channels</SelectItem>
                            <SelectGroup>
                                <SelectLabel>Available Channels</SelectLabel>
                                {bookingChannels.map((channel) => (
                                    <SelectItem key={channel.value} value={channel.value}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{channel.label}</span>
                                            {channel.count && <span className="text-muted-foreground text-xs">({channel.count} bookings)</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Market Segment Selection */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Market Segment
                    </div>
                    <Select
                        value={localFilters.marketSegment || ''}
                        onValueChange={(value) => handleFilterChange('marketSegment', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select market segment or leave blank for all" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Segments</SelectItem>
                            <SelectGroup>
                                <SelectLabel>Available Segments</SelectLabel>
                                {marketSegments.map((segment) => (
                                    <SelectItem key={segment.value} value={segment.value}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{segment.label}</span>
                                            {segment.count && <span className="text-muted-foreground text-xs">({segment.count} guests)</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={applyFilters}
                        disabled={loading || !hasChanges}
                        className="flex-1 sm:flex-none"
                    >
                        {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Apply Filters
                    </Button>
                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        disabled={loading || !hasChanges}
                        className="flex-1 sm:flex-none"
                    >
                        Reset Changes
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={clearAllFilters}
                        disabled={loading || getActiveFilterCount() === 0}
                        className="flex-1 sm:flex-none"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                    </Button>
                </div>

                {/* Filter Summary */}
                {getActiveFilterCount() > 0 && (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Active Filters:</p>
                        <div className="flex flex-wrap gap-2">
                            {filters.startDate && (
                                <Badge variant="outline">
                                    From: {filters.startDate}
                                    <button
                                        onClick={() => handleFilterChange('startDate', undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters.endDate && (
                                <Badge variant="outline">
                                    To: {filters.endDate}
                                    <button
                                        onClick={() => handleFilterChange('endDate', undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters.hotelId && (
                                <Badge variant="outline">
                                    Hotel: {hotels.find(h => h.value === filters.hotelId)?.label || filters.hotelId}
                                    <button
                                        onClick={() => handleFilterChange('hotelId', undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters.bookingChannel && (
                                <Badge variant="outline">
                                    Channel: {bookingChannels.find(c => c.value === filters.bookingChannel)?.label || filters.bookingChannel}
                                    <button
                                        onClick={() => handleFilterChange('bookingChannel', undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters.marketSegment && (
                                <Badge variant="outline">
                                    Segment: {marketSegments.find(s => s.value === filters.marketSegment)?.label || filters.marketSegment}
                                    <button
                                        onClick={() => handleFilterChange('marketSegment', undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}