"use client";

import * as React from "react";
import { useScatterData } from "@/hooks/use-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconX } from "@tabler/icons-react";

import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  scatter: {
    label: "ADR vs Occupancy",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ADRvsOccupancyScatter() {
  const { data, loading, error, refresh } = useScatterData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ADR vs Occupancy</CardTitle>
          <CardDescription>Shows relationship between room price and occupancy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full rounded-xl bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ADR vs Occupancy</CardTitle>
          <CardDescription>Shows relationship between room price and occupancy</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <IconX className="h-4 w-4" />
            <AlertDescription>
              Failed to load scatter data: {error.message}
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
        <CardTitle>ADR vs Occupancy</CardTitle>
        <CardDescription>
          Shows relationship between room price and occupancy
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />

              <XAxis
                type="number"
                dataKey="Occupancy_Percent"
                name="Occupancy"
                unit="%"
                tickFormatter={(value) => `${value}%`}
              />

              <YAxis
                type="number"
                dataKey="ADR_INR"
                name="ADR"
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const d = payload[0].payload;

                  return (
                    <ChartTooltipContent
                      formatter={() => (
                        <div className="space-y-1">
                          <div>
                            <strong>Hotel:</strong> {d.Hotel_ID}
                          </div>
                          <div>
                            <strong>ADR:</strong> ₹{d.ADR_INR.toLocaleString()}
                          </div>
                          <div>
                            <strong>Occupancy:</strong> {d.Occupancy_Percent.toFixed(1)}%
                          </div>
                          <div>
                            <strong>Revenue:</strong> ₹{d.Revenue_INR.toLocaleString()}
                          </div>
                        </div>
                      )}
                    />
                  );
                }}
              />

              <Scatter
                data={data || []}
                fill="var(--primary)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
