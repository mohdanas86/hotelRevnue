"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string;
    subtitle?: string;
    trend?: number;       // % change, positive = good
    trendLabel?: string;
    tooltip?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    invertTrend?: boolean; // For metrics where lower is better (cancellations)
}

export const KPICard = React.memo(function KPICard({
    title,
    value,
    subtitle,
    trend,
    trendLabel,
    tooltip,
    icon,
    isLoading,
    invertTrend = false,
}: KPICardProps) {
    const isPositive = trend !== undefined ? (invertTrend ? trend < 0 : trend > 0) : null;

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-2 h-8 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-3 w-28" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="@container/kpi">
            <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                    <CardDescription className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
                        {icon && <span className="text-muted-foreground">{icon}</span>}
                        {title}
                        {tooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 cursor-help text-muted-foreground/60" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                                        {tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardDescription>
                </div>
                <CardTitle className="mt-1 text-2xl font-bold tabular-nums @[220px]/kpi:text-3xl">
                    {value}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {trend !== undefined && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            isPositive === null
                                ? "text-muted-foreground"
                                : isPositive
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                        )}
                    >
                        {isPositive === null ? (
                            <Minus className="h-3 w-3" />
                        ) : isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                            {trend > 0 ? "+" : ""}
                            {trend.toFixed(1)}%
                        </span>
                        {trendLabel && (
                            <span className="text-muted-foreground font-normal">{trendLabel}</span>
                        )}
                    </div>
                )}
                {subtitle && !trend && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
});
