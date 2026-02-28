"use client";

import React, { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterOptions } from "@/hooks/useDashboard";
import type { DashboardFilters, Granularity } from "@/types/dashboard";
import { buildParams, countActiveFilters, DEFAULT_FILTERS } from "@/lib/filterUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, X, RotateCcw, Clock } from "lucide-react";
import { formatLastUpdated } from "@/lib/formatters";

const ALL_SENTINEL = "__all__";
const NONE_LABEL = "All";

interface FilterBarProps {
    filters: DashboardFilters;
    onFiltersChange: (next: Partial<DashboardFilters>) => void;
    onRefresh: () => void;
    lastUpdated?: number;
}

export function FilterBar({ filters, onFiltersChange, onRefresh, lastUpdated }: FilterBarProps) {
    const { data: options } = useFilterOptions();
    const activeCount = countActiveFilters(filters);

    const setField = useCallback(
        (key: keyof DashboardFilters) => (value: string) => {
            onFiltersChange({ [key]: value === ALL_SENTINEL ? "" : value });
        },
        [onFiltersChange]
    );

    const resetAll = useCallback(() => {
        onFiltersChange({
            startDate: "",
            endDate: "",
            hotelId: "",
            channel: "",
            segment: "",
        });
    }, [onFiltersChange]);

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
            {/* Row 1 – date + hotel + refresh */}
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">From</Label>
                    <Input
                        type="date"
                        className="h-8 w-36 text-xs"
                        value={filters.startDate}
                        min={options?.date_range.min_date}
                        max={options?.date_range.max_date}
                        onChange={(e) => setField("startDate")(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">To</Label>
                    <Input
                        type="date"
                        className="h-8 w-36 text-xs"
                        value={filters.endDate}
                        min={options?.date_range.min_date}
                        max={options?.date_range.max_date}
                        onChange={(e) => setField("endDate")(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Hotel</Label>
                    <Select
                        value={filters.hotelId || ALL_SENTINEL}
                        onValueChange={setField("hotelId")}
                    >
                        <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="All hotels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_SENTINEL}>{NONE_LABEL}</SelectItem>
                            {options?.hotels.map((h) => (
                                <SelectItem key={h} value={h}>
                                    {h}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Channel</Label>
                    <Select
                        value={filters.channel || ALL_SENTINEL}
                        onValueChange={setField("channel")}
                    >
                        <SelectTrigger className="h-8 w-36 text-xs">
                            <SelectValue placeholder="All channels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_SENTINEL}>{NONE_LABEL}</SelectItem>
                            {options?.channels.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Segment</Label>
                    <Select
                        value={filters.segment || ALL_SENTINEL}
                        onValueChange={setField("segment")}
                    >
                        <SelectTrigger className="h-8 w-36 text-xs">
                            <SelectValue placeholder="All segments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_SENTINEL}>{NONE_LABEL}</SelectItem>
                            {options?.segments.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="ml-auto flex items-end gap-2">
                    {activeCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={resetAll}
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                            <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-[10px]">
                                {activeCount}
                            </Badge>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onRefresh}>
                        <RefreshCw className="h-3 w-3" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Row 2 – granularity + last updated */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Granularity:</Label>
                    <ToggleGroup
                        type="single"
                        size="sm"
                        value={filters.granularity}
                        onValueChange={(val) => val && setField("granularity")(val as Granularity)}
                        className="h-7"
                    >
                        <ToggleGroupItem value="day" className="h-7 px-2.5 text-xs">
                            Day
                        </ToggleGroupItem>
                        <ToggleGroupItem value="week" className="h-7 px-2.5 text-xs">
                            Week
                        </ToggleGroupItem>
                        <ToggleGroupItem value="month" className="h-7 px-2.5 text-xs">
                            Month
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {lastUpdated && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Last updated: {formatLastUpdated(lastUpdated)}
                    </div>
                )}
            </div>
        </div>
    );
}
