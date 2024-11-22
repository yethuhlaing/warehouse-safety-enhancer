"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useWebSocketData } from "@/hooks/use-websocket-data";

import TimeRangeSelector from "../dashboard/time-range-selector";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { format } from "date-fns";


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function BarChartWaterLevel() {
    const { sensorData } = useWebSocketData('ws://localhost:3001/water-level');
    console.log(sensorData)
    // const { 
    //     field, minimum, maximum, average
    // } = formatChartData(chartData) as FormattedAggregateData  

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col space-y-2">
                    <CardTitle>Water Level Monitoring</CardTitle>
                    <CardDescription>Water Level Across Reservoirs and Storage Units</CardDescription>
                </div>
                <TimeRangeSelector field={'water-level'} />
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[350px]">
                <BarChart accessibilityLayer data={sensorData || []}>
                    <CartesianGrid vertical={false} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel hideIndicator />}
                    />
                    <XAxis
                        dataKey="_time"
                        tickLine={true}
                        axisLine={false}
                        tickMargin={12}
                        tickFormatter={(value) => format(new Date(value), 'HH:mm')} />
                    <YAxis />
                    <Bar dataKey="_value">
                    {sensorData?.map((item) => (
                        <Cell
                        key={item._field}
                        fill={
                            item._value > 0
                            ? "hsl(var(--chart-1))"
                            : "hsl(var(--chart-2))"
                        }
                        />
                    ))}
                    </Bar>
                </BarChart>
                </ChartContainer>

            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {maximum}{" "}
                </div>
                <div className="flex items-center gap-2 font-medium leading-none">
                    {minimum}{" "}
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total {field} for today
                </div>
            </CardFooter> */}
        </Card>
    );
}
