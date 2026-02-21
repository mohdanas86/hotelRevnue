"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useRevenueByChannel } from "@/hooks/use-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconX } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function RevenueByChannelChart() {
  const { data, loading, error, refresh } = useRevenueByChannel();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Channel</CardTitle>
          <CardDescription>Revenue from OTA, Website, Walk-in, Agent</CardDescription>
        </CardHeader>
        <CardContent>
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
          <Alert variant="destructive">
            <IconX className="h-4 w-4" />
            <AlertDescription>
              Failed to load channel revenue data: {error.message}
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
        <CardTitle>Revenue by Channel</CardTitle>
        <CardDescription>
          Revenue from OTA, Website, Walk-in, Agent
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            layout="vertical"
            data={data || []}
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              tickFormatter={(value) =>
                `₹${(value / 10000000).toFixed(1)}Cr`
              }
            />

            <YAxis
              type="category"
              dataKey="Booking_Channel"
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString()}`
                  }
                />
              }
            />

            <Bar
              dataKey="Revenue_INR"
              fill="var(--chart-1)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
