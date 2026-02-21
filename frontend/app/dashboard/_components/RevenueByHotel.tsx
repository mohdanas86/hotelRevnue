"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useRevenueByHotel } from "@/hooks/use-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconX } from "@tabler/icons-react"

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
    color: "var(--chart-2)",
  },
} satisfies ChartConfig


export function RevenueByHotelChart() {
  const { data, loading, error, refresh } = useRevenueByHotel();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Hotel</CardTitle>
          <CardDescription>Revenue comparison across hotels</CardDescription>
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
        <CardTitle>Revenue by Hotel</CardTitle>
        <CardDescription>
          Revenue comparison across hotels
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data || []}
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="Hotel_ID"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                `₹${(value / 10000000).toFixed(1)}Cr`
              }
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
              fill="var(--chart-2)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
