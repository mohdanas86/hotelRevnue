"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * API Response Format
 */
interface ApiRevenueData {
  Date: string;
  Revenue_INR: number;
}

/**
 * Chart Format
 */
interface RevenueData {
  date: string;
  revenue: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function RevenueTrendChart() {
  const isMobile = useIsMobile();

  const [timeRange, setTimeRange] = React.useState("90d");

  const [data, setData] = React.useState<RevenueData[]>([]);

  /**
   * Fetch and transform API data
   */
  React.useEffect(() => {
    fetch("http://localhost:8000/api/revenue-trend")
      .then((res) => res.json())

      .then((apiData: ApiRevenueData[]) => {
        const transformed: RevenueData[] = apiData.map((item) => ({
          date: item.Date,
          revenue: item.Revenue_INR,
        }));

        setData(transformed);
      })

      .catch(console.error);
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  /**
   * Filter data by selected time range
   */
  const filteredData = React.useMemo(() => {
    if (!data.length) return [];

    const referenceDate = new Date(data[data.length - 1].date);

    let days = 90;

    if (timeRange === "30d") days = 30;
    if (timeRange === "7d") days = 7;

    const startDate = new Date(referenceDate);

    startDate.setDate(startDate.getDate() - days);

    return data.filter((item) => new Date(item.date) >= startDate);
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>

        <CardDescription>Hotel revenue over time</CardDescription>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>

            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>

            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 @[767px]/card:hidden">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>

              <SelectItem value="30d">Last 30 days</SelectItem>

              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <defs>
              <linearGradient
                id="revenueGoldGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#f59f0b" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#f59f0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59f0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return `₹${value.toLocaleString()}`;
                    }
                    return value;
                  }}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-IN")
                  }
                />
              }
            />

            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#revenueGoldGradient)"
              stroke="#d97706"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
