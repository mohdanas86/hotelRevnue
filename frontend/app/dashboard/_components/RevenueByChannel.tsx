"use client"

import * as React from "react"
import { memo, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { useRevenueByChannel } from "@/hooks/use-api"
import { IconX, IconBrandBooking, IconDevicesUp, IconTrendingUp } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  Revenue_INR: {
    label: "Revenue (INR)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Channel colors for better visualization
const CHANNEL_COLORS = {
  'Website': 'hsl(var(--chart-1))',
  'OTA': 'hsl(var(--chart-2))',
  'Walk-in': 'hsl(var(--chart-3))',
  'Agent': 'hsl(var(--chart-4))',
  'Phone': 'hsl(var(--chart-5))',
};

interface ChannelData {
  Booking_Channel: string;
  Revenue_INR: number;
  Occupancy_Rate?: number;
  ADR_INR?: number;
  RevPAR_INR?: number;
  Efficiency_Score?: number;
  Market_Share?: number;
  Hotel_Count?: number;
  Cancellation_Count?: number;
}

export const RevenueByChannelChart = memo(function RevenueByChannelChart() {
  const { data, loading, error, refresh } = useRevenueByChannel();

  // Memoize processed data and statistics
  const processedData = useMemo(() => {
    if (!data) return { channels: [], stats: null };

    // Validate and clean the data first
    const validChannels = (data as ChannelData[])
      .filter(item => item && typeof item.Revenue_INR === 'number' && item.Revenue_INR > 0 && item.Booking_Channel)
      .map(item => ({
        ...item,
        Market_Share: typeof item.Market_Share === 'number' ? item.Market_Share : 0,
        Occupancy_Rate: typeof item.Occupancy_Rate === 'number' ? item.Occupancy_Rate : 0,
        Hotel_Count: typeof item.Hotel_Count === 'number' ? item.Hotel_Count : 1,
        Efficiency_Score: typeof item.Efficiency_Score === 'number' ? item.Efficiency_Score : 0
      }))
      .sort((a, b) => (b.Revenue_INR || 0) - (a.Revenue_INR || 0));

    if (!validChannels.length) return { channels: [], stats: null };

    const stats = {
      totalRevenue: validChannels.reduce((sum, item) => sum + (item.Revenue_INR || 0), 0),
      topChannel: validChannels[0],
      avgMarketShare: validChannels.reduce((sum, item) => sum + (item.Market_Share || 0), 0) / validChannels.length,
      totalHotels: Math.max(...validChannels.map(item => item.Hotel_Count || 0))
    };

    return { channels: validChannels, stats };
  }, [data]);

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'website': return <IconDevicesUp className="h-4 w-4" />;
      case 'ota': return <IconBrandBooking className="h-4 w-4" />;
      case 'walk-in': return <IconTrendingUp className="h-4 w-4" />;
      default: return <IconBrandBooking className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrandBooking className="h-5 w-5 animate-pulse" />
            Revenue by Channel
          </CardTitle>
          <CardDescription>Revenue from OTA, Website, Walk-in, Agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-6 w-28 bg-muted animate-pulse rounded" />
            </div>
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
          <CardTitle>Revenue by Channel</CardTitle>
          <CardDescription>Revenue from OTA, Website, Walk-in, Agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <IconX className="h-4 w-4" />
              <span className="text-sm font-medium">
                Failed to load channel revenue data: {error.message}
              </span>
              <button
                onClick={refresh}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconBrandBooking className="h-5 w-5 text-blue-500" />
            Revenue by Channel
          </div>
          {processedData.stats && (
            <span className="text-sm font-medium text-muted-foreground">
              Total: ₹{(processedData.stats.totalRevenue / 10000000).toFixed(1)}Cr
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Revenue distribution across booking channels
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        {processedData.stats && processedData.stats.topChannel && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1">
                {getChannelIcon(processedData.stats.topChannel.Booking_Channel)}
                Top Channel
              </p>
              <p className="font-medium">
                {processedData.stats.topChannel.Booking_Channel} ({typeof processedData.stats.topChannel.Market_Share === 'number' ? `${processedData.stats.topChannel.Market_Share}%` : 'N/A'})
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Avg Occupancy</p>
              <p className="font-medium">
                {processedData.channels.length > 0
                  ? (processedData.channels.reduce((sum, item) => sum + (item.Occupancy_Rate || 0), 0) / processedData.channels.length).toFixed(1)
                  : '0'}%
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Chart */}
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={processedData.channels}
              margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />

              <XAxis
                type="number"
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`}
                fontSize={12}
              />

              <YAxis
                type="category"
                dataKey="Booking_Channel"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={70}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const data = props.payload as ChannelData;
                      if (!data) return ['', ''];

                      return [
                        <div key="tooltip" className="space-y-1">
                          <p className="font-medium flex items-center gap-2">
                            {getChannelIcon(data.Booking_Channel || 'unknown')}
                            {data.Booking_Channel || 'Unknown Channel'}
                          </p>
                          <p>Revenue: ₹{Number(value || 0).toLocaleString()}</p>
                          <p>Market Share: {typeof data.Market_Share === 'number' ? `${data.Market_Share}%` : 'N/A'}</p>
                          <p>Hotels: {data.Hotel_Count || 0}</p>
                          <p>Occupancy: {typeof data.Occupancy_Rate === 'number' ? `${data.Occupancy_Rate}%` : 'N/A'}</p>
                          <p>Efficiency: {typeof data.Efficiency_Score === 'number' ? `${(data.Efficiency_Score * 100).toFixed(1)}%` : 'N/A'}</p>
                        </div>,
                        '',
                      ];
                    }}
                  />
                }
              />

              <Bar dataKey="Revenue_INR" radius={[0, 4, 4, 0]}>
                {processedData.channels.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHANNEL_COLORS[entry.Booking_Channel as keyof typeof CHANNEL_COLORS] || 'hsl(var(--chart-1))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
