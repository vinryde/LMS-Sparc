"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"




export const description = "An interactive area chart"

const dummyEnrollmentData = [
  {
    date: "2025-09-30",
    enrollments: 1200,
  },
  {
    date: "2025-09-29",
    enrollments: 1150,
  },
  {
    date: "2025-09-28",
    enrollments: 1300,
  },
    {
    date: "2025-09-27",
    enrollments: 1400,
  },
    {
    date: "2025-09-26",
    enrollments: 1500,
  },
    {
    date: "2025-09-25",
    enrollments: 1600,
  },
    {
    date: "2025-09-24",
    enrollments: 1700,
  },
    {
    date: "2025-09-23",
    enrollments: 1800,
  },
    {
    date: "2025-09-22",
    enrollments: 1900,
  },

    {
    date: "2025-09-21",
    enrollments: 1000,
  },
    {
    date: "2025-09-20",
    enrollments: 1110,
  },
    {
    date: "2025-09-19",
    enrollments: 1220,
  },
    {
    date: "2025-09-18",
    enrollments: 1330,
  },
    {
    date: "2025-09-17",
    enrollments: 1440,
  },
    {
    date: "2025-09-16",
    enrollments: 1550,
  },
    {
    date: "2025-09-15",
    enrollments: 1660,
  },
    {
    date: "2025-09-14",
    enrollments: 1770,
  },
    {
    date: "2025-09-13",
    enrollments: 1880,
  },
    {
    date: "2025-09-12",
    enrollments: 1990,
  },
    {
    date: "2025-09-11",
    enrollments: 1220,
  },
    {
    date: "2025-09-10",
    enrollments: 1211,
  },
    {
    date: "2025-09-09",
    enrollments: 1222,
  },
    {
    date: "2025-09-08",
    enrollments: 1233,
  },
    {
    date: "2025-09-07",
    enrollments: 1244,
  },
    {
    date: "2025-09-06",
    enrollments: 1255,
  },
    {
    date: "2025-09-05",
    enrollments: 1266,
  },
    {
    date: "2025-09-04",
    enrollments: 1277,
  },
    {
    date: "2025-09-03",
    enrollments: 1288,
  },
    {
    date: "2025-09-02",
    enrollments: 1299,
  },
    {
    date: "2025-09-01",
    enrollments: 1333,
  },

  // Add more data points as needed
]

const  chartConfig= {
 enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
 },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps{
  data: {
    date: string,
    enrollments: number,
  }[];
}

export function ChartAreaInteractive({data}:ChartAreaInteractiveProps) {
 const total = React.useMemo(() => {
  return data.reduce((acc, cur) => acc + cur.enrollments, 0);
 }, [data]);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total Enrollments for the last 30 days:  {total}</span>
          <span className="@[540px]/card:hidden">Last 30 days:</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pxx-2 pt-4 sm:px-6 sm:pt-6">
     <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart 
      data={data}
      margin={{
        left: 12,
        right: 12,
      }}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="date"
      tickLine = {false} axisLine={false} tickMargin={8} interval={"preserveStartEnd"} tickFormatter={(value) => {const date = new Date(value); return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      }} />
      <ChartTooltip content={
        <ChartTooltipContent className="w-[150px]"
        labelFormatter={(value) => {
          const date = new Date(value); return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
        }} />
      } />
      <Bar dataKey={"enrollments"} fill="var(--color-enrollments)"/>
      </BarChart>

     </ChartContainer>
      </CardContent>
      </Card>
  )
}