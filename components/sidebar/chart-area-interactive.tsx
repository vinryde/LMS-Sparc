"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2025-07-01", desktop: 222, mobile: 150 },
  { date: "2025-07-02", desktop: 97, mobile: 180 },
  { date: "2025-07-03", desktop: 167, mobile: 120 },
  { date: "2025-07-04", desktop: 242, mobile: 260 },
  { date: "2025-07-05", desktop: 373, mobile: 290 },
  { date: "2025-07-06", desktop: 301, mobile: 340 },
  { date: "2025-07-07", desktop: 245, mobile: 180 },
  { date: "2025-07-08", desktop: 409, mobile: 320 },
  { date: "2025-07-09", desktop: 59, mobile: 110 },
  { date: "2025-07-10", desktop: 261, mobile: 190 },
  { date: "2025-07-11", desktop: 327, mobile: 350 },
  { date: "2025-07-12", desktop: 292, mobile: 210 },
  { date: "2025-07-13", desktop: 342, mobile: 380 },
  { date: "2025-07-14", desktop: 137, mobile: 220 },
  { date: "2025-07-15", desktop: 120, mobile: 170 },
  { date: "2025-07-16", desktop: 138, mobile: 190 },
  { date: "2025-07-17", desktop: 446, mobile: 360 },
  { date: "2025-07-18", desktop: 364, mobile: 410 },
  { date: "2025-07-19", desktop: 243, mobile: 180 },
  { date: "2025-07-20", desktop: 89, mobile: 150 },
  { date: "2025-07-21", desktop: 137, mobile: 200 },
  { date: "2025-07-22", desktop: 224, mobile: 170 },
  { date: "2025-07-23", desktop: 138, mobile: 230 },
  { date: "2025-07-24", desktop: 387, mobile: 290 },
  { date: "2025-07-25", desktop: 215, mobile: 250 },
  { date: "2025-07-26", desktop: 75, mobile: 130 },
  { date: "2025-07-27", desktop: 383, mobile: 420 },
  { date: "2025-07-28", desktop: 122, mobile: 180 },
  { date: "2025-07-29", desktop: 315, mobile: 240 },
  { date: "2025-07-30", desktop: 454, mobile: 380 },
  { date: "2025-07-31", desktop: 165, mobile: 220 },
  { date: "2025-08-01", desktop: 293, mobile: 310 },
  { date: "2025-08-02", desktop: 247, mobile: 190 },
  { date: "2025-08-03", desktop: 385, mobile: 420 },
  { date: "2025-08-04", desktop: 481, mobile: 390 },
  { date: "2025-08-05", desktop: 498, mobile: 520 },
  { date: "2025-08-06", desktop: 388, mobile: 300 },
  { date: "2025-08-07", desktop: 149, mobile: 210 },
  { date: "2025-08-08", desktop: 227, mobile: 180 },
  { date: "2025-08-09", desktop: 293, mobile: 330 },
  { date: "2025-08-10", desktop: 335, mobile: 270 },
  { date: "2025-08-11", desktop: 197, mobile: 240 },
  { date: "2025-08-12", desktop: 197, mobile: 160 },
  { date: "2025-08-13", desktop: 448, mobile: 490 },
  { date: "2025-08-14", desktop: 473, mobile: 380 },
  { date: "2025-08-15", desktop: 338, mobile: 400 },
  { date: "2025-08-16", desktop: 499, mobile: 420 },
  { date: "2025-08-17", desktop: 315, mobile: 350 },
  { date: "2025-08-18", desktop: 235, mobile: 180 },
  { date: "2025-08-19", desktop: 177, mobile: 230 },
  { date: "2025-08-20", desktop: 82, mobile: 140 },
  { date: "2025-08-21", desktop: 81, mobile: 120 },
  { date: "2025-08-22", desktop: 252, mobile: 290 },
  { date: "2025-08-23", desktop: 294, mobile: 220 },
  { date: "2025-08-24", desktop: 201, mobile: 250 },
  { date: "2025-08-25", desktop: 213, mobile: 170 },
  { date: "2025-08-26", desktop: 420, mobile: 460 },
  { date: "2025-08-27", desktop: 233, mobile: 190 },
  { date: "2025-08-28", desktop: 78, mobile: 130 },
  { date: "2025-08-29", desktop: 340, mobile: 280 },
  { date: "2025-08-30", desktop: 178, mobile: 230 },
  { date: "2025-08-31", desktop: 178, mobile: 200 },
  { date: "2025-09-01", desktop: 470, mobile: 410 },
  { date: "2025-09-02", desktop: 103, mobile: 160 },
  { date: "2025-09-03", desktop: 439, mobile: 380 },
  { date: "2025-09-04", desktop: 88, mobile: 140 },
  { date: "2025-09-05", desktop: 294, mobile: 250 },
  { date: "2025-09-06", desktop: 323, mobile: 370 },
  { date: "2025-09-07", desktop: 385, mobile: 320 },
  { date: "2025-09-08", desktop: 438, mobile: 480 },
  { date: "2025-09-09", desktop: 155, mobile: 200 },
  { date: "2025-09-10", desktop: 92, mobile: 150 },
  { date: "2025-09-11", desktop: 492, mobile: 420 },
  { date: "2025-09-12", desktop: 81, mobile: 130 },
  { date: "2025-09-13", desktop: 426, mobile: 380 },
  { date: "2025-09-14", desktop: 307, mobile: 350 },
  { date: "2025-09-15", desktop: 371, mobile: 310 },
  { date: "2025-09-16", desktop: 475, mobile: 520 },
  { date: "2025-09-17", desktop: 107, mobile: 170 },
  { date: "2025-09-18", desktop: 341, mobile: 290 },
  { date: "2025-09-19", desktop: 408, mobile: 450 },
  { date: "2025-09-20", desktop: 169, mobile: 210 },
  { date: "2025-09-21", desktop: 317, mobile: 270 },
  { date: "2025-09-22", desktop: 480, mobile: 530 },
  { date: "2025-09-23", desktop: 132, mobile: 180 },
  { date: "2025-09-24", desktop: 141, mobile: 190 },
  { date: "2025-09-25", desktop: 434, mobile: 380 },
  { date: "2025-09-26", desktop: 448, mobile: 490 },
  { date: "2025-09-27", desktop: 149, mobile: 200 },
  { date: "2025-09-28", desktop: 103, mobile: 160 },
  { date: "2025-09-29", desktop: 446, mobile: 400 },
  { date: "2025-09-30", desktop: 385, mobile: 350 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-09-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}