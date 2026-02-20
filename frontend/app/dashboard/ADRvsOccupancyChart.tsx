"use client";

import * as React from "react";
import axios from "axios";

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

interface ScatterData {
  Hotel_ID: string;
  ADR_INR: number;
  Occupancy_Rate: number;
  Revenue_INR: number;
}

const chartConfig = {
  scatter: {
    label: "ADR vs Occupancy",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ADRvsOccupancyScatter() {
  const [data, setData] = React.useState<ScatterData[]>([]);

  React.useEffect(() => {
    axios.get("http://localhost:8000/api/scatter").then((res) => {
      // convert occupancy to percentage
      const formatted = res.data.map((item: ScatterData) => ({
        ...item,
        Occupancy_Percent: item.Occupancy_Rate * 100,
      }));

      setData(formatted);
    });
  }, []);

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
                            Hotel: <b>{d.Hotel_ID}</b>
                          </div>

                          <div>ADR: ₹{d.ADR_INR.toLocaleString()}</div>

                          <div>
                            Occupancy: {(d.Occupancy_Rate * 100).toFixed(1)}%
                          </div>

                          <div>Revenue: ₹{d.Revenue_INR.toLocaleString()}</div>
                        </div>
                      )}
                    />
                  );
                }}
              />

              <Scatter
                name="Hotels"
                data={data}
                fill="#f59f0b"
                stroke="#d97706"
                strokeWidth={1}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
