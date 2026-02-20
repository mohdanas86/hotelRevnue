"use client"

import * as React from "react"
import axios from "axios"

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"



interface CancellationData {
  Booking_Channel: string
  Cancellation_Count: number
}



const chartConfig = {
  cancellations: {
    label: "Cancellations",
    color: "var(--destructive)",
  },
} satisfies ChartConfig



export function CancellationChart() {

  const [data, setData] = React.useState<CancellationData[]>([])

  React.useEffect(() => {

    axios
      .get("http://localhost:8000/api/cancellations-by-channel")
      .then((res) => setData(res.data))

  }, [])



  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Cancellations by Booking Channel
        </CardTitle>

        <CardDescription>
          Identify channels with highest cancellation rates
        </CardDescription>

      </CardHeader>



      <CardContent>

        <ChartContainer
          config={chartConfig}
          className="h-[350px] w-full"
        >

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={data}>

              <CartesianGrid vertical={false} />



              <XAxis
                dataKey="Booking_Channel"
                tickLine={false}
                axisLine={false}
              />



              <YAxis
                tickFormatter={(value) =>
                  value.toLocaleString()
                }
                tickLine={false}
                axisLine={false}
              />



              <Tooltip
                cursor={false}
                content={({ active, payload }) => {

                  if (!active || !payload?.length) return null

                  const d = payload[0].payload

                  return (

                    <ChartTooltipContent

                      formatter={() =>
                        `Cancellations: ${d.Cancellation_Count.toLocaleString()}`
                      }

                      label={d.Booking_Channel}

                    />

                  )

                }}
              />



              <Bar
                dataKey="Cancellation_Count"
                fill="var(--destructive)"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartContainer>

      </CardContent>

    </Card>

  )

}
