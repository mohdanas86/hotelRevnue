"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import axios from "axios"

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

  const [data, setData] = React.useState([])

  React.useEffect(() => {
    axios.get("http://localhost:8000/api/revenue-by-channel")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }, [])

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
            data={data}
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
  )
}
