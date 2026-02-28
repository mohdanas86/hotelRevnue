"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, BarChart3 } from "lucide-react";

interface ChartCardProps {
    title: string;
    description?: string;
    isLoading?: boolean;
    error?: Error | null;
    isEmpty?: boolean;
    emptyMessage?: string;
    onRetry?: () => void;
    children: React.ReactNode;
    className?: string;
    headerExtra?: React.ReactNode;
}

export const ChartCard = React.memo(function ChartCard({
    title,
    description,
    isLoading,
    error,
    isEmpty,
    emptyMessage = "No data available for the selected filters.",
    onRetry,
    children,
    className = "",
    headerExtra,
}: ChartCardProps) {
    return (
        <Card className={`@container/chart flex flex-col ${className}`}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base font-semibold">{title}</CardTitle>
                        {description && (
                            <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
                        )}
                    </div>
                    {headerExtra && <div className="shrink-0">{headerExtra}</div>}
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-[280px] w-full rounded-lg" />
                    </div>
                ) : error ? (
                    <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <div>
                            <p className="text-sm font-medium">No data available</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Could not load chart data for the selected filters.
                            </p>
                        </div>
                        {onRetry && (
                            <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Try again
                            </Button>
                        )}
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center">
                        <BarChart3 className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
});
