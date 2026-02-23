"use client"

import * as React from "react"
import { memo, useMemo, useState, useTransition } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useRevenueByHotel } from "@/hooks/use-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconX, IconTrendingUp, IconTrendingDown, IconActivity } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  Revenue_INR: {
    label: "Revenue (INR)",
    color: "hsl(var(--chart-1))",
  },
  Performance_Score: {
    label: "Performance Score",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface RevenueData {
  Hotel_ID: string;
  Hotel_Name?: string;
  Revenue_INR: number;
  Occupancy_Rate?: number;
  ADR_INR?: number;
  RevPAR_INR?: number;
  Performance_Score?: number;
  Cancellation_Count?: number;
}


export const RevenueByHotelChart = memo(function RevenueByHotelChart() {
  const { data, loading, error, refresh } = useRevenueByHotel();
  const [sortBy, setSortBy] = useState<'revenue' | 'performance'>('revenue');
  const [isPending, startTransition] = useTransition();

  // Memoize processed data for better performance
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Validate and clean the data first
    const validData = (data as RevenueData[])
      .filter(item => item && typeof item.Revenue_INR === 'number' && item.Revenue_INR > 0)
      .map(item => ({
        ...item,
        Hotel_Name: item.Hotel_Name || `Hotel ${item.Hotel_ID}`,
        Occupancy_Rate: typeof item.Occupancy_Rate === 'number' ? item.Occupancy_Rate : 0,
        ADR_INR: typeof item.ADR_INR === 'number' ? item.ADR_INR : 0,
        Performance_Score: typeof item.Performance_Score === 'number' ? item.Performance_Score : 0
      }));

    return validData
      .sort((a, b) => {
        if (sortBy === 'performance') {
          return (b.Performance_Score || 0) - (a.Performance_Score || 0);
        }
        return (b.Revenue_INR || 0) - (a.Revenue_INR || 0);
      })
      .slice(0, 10); // Show top 10 for better performance
  }, [data, sortBy]);

  // Memoize chart statistics
  const stats = useMemo(() => {
    if (!processedData.length) return { total: 0, average: 0, top: null };

    const total = processedData.reduce((sum, item) => sum + (item.Revenue_INR || 0), 0);
    const average = total / processedData.length;
    const top = processedData[0];

    // Validate top item has required properties
    if (top && typeof top.Revenue_INR === 'number') {
      return { total, average, top };
    }

    return { total, average, top: null };
  }, [processedData]);

  const handleSortChange = (newSort: 'revenue' | 'performance') => {
    startTransition(() => {
      setSortBy(newSort);
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconActivity className="h-5 w-5 animate-pulse" />
            Revenue by Hotel
          </CardTitle>
          <CardDescription>Revenue comparison across hotels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
          <div className="h-[300px] w-full rounded-xl bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Hotel</CardTitle>
          <CardDescription>Revenue comparison across hotels</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <IconX className="h-4 w-4" />
            <AlertDescription>
              Failed to load hotel revenue data: {error.message}
              <button
                onClick={refresh}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5 text-green-500" />
            Revenue by Hotel
          </div>
          <div className="flex gap-2">
            <Badge
              variant={sortBy === 'revenue' ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => handleSortChange('revenue')}
            >
              Revenue
            </Badge>
            <Badge
              variant={sortBy === 'performance' ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => handleSortChange('performance')}
            >
              Performance
            </Badge>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>
            {sortBy === 'revenue' ? 'Top performing hotels by revenue' : 'Top performing hotels by performance score'}
          </span>
          {stats.total > 0 && (
            <span className="text-sm font-medium">
              Total: ₹{(stats.total / 10000000).toFixed(1)}Cr
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        {stats.top && stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Top Performer</p>
              <p className="font-medium">{stats.top.Hotel_Name || 'Unknown Hotel'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Average Revenue</p>
              <p className="font-medium">₹{(stats.average / 1000000).toFixed(1)}M</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Occupancy</p>
              <p className="font-medium">
                {typeof stats.top.Occupancy_Rate === 'number'
                  ? `${stats.top.Occupancy_Rate.toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Chart */}
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ left: 20, right: 20, top: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

              <XAxis
                dataKey="Hotel_Name"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />

              <YAxis
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`}
                fontSize={12}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const data = props.payload as RevenueData;
                      if (!data) return ['', ''];

                      return [
                        <div key="tooltip" className="space-y-1">
                          <p className="font-medium">{data.Hotel_Name || 'Unknown Hotel'}</p>
                          <p>Revenue: ₹{Number(value || 0).toLocaleString()}</p>
                          <p>Occupancy: {typeof data.Occupancy_Rate === 'number' ? `${data.Occupancy_Rate}%` : 'N/A'}</p>
                          <p>ADR: ₹{typeof data.ADR_INR === 'number' ? data.ADR_INR.toLocaleString() : 'N/A'}</p>
                          <p>Performance: {typeof data.Performance_Score === 'number' ? `${(data.Performance_Score * 100).toFixed(1)}%` : 'N/A'}</p>
                        </div>,
                        '',
                      ];
                    }}
                  />
                }
              />

              <Bar
                dataKey="Revenue_INR"
                fill={chartConfig.Revenue_INR.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
