"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import axios from "axios"

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

  const [data, setData] = React.useState([])

  React.useEffect(() => {

    axios.get("http://localhost:8000/api/revenue-by-hotel")
      .then(res => setData(res.data))
      .catch(err => console.error(err))

  }, [])

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
            data={data}
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
  )
}
