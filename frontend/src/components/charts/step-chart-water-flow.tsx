"use client";

import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

export function StepChartWaterFlow() {
    const { sensorData, connectionStatus, subscribe, updateTimeRange } = useWebSocketData('ws://localhost:5000/sensors');

    // Subscribe to multiple sensors
    useEffect(() => {
        subscribe(['water-flow'], {
            waterFlowSensor: '5m',
        });
    }, []);
    // const { 
    //     field, minimum, maximum, average
    // } = formatChartData(chartData) as FormattedAggregateData  

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col space-y-2">
                    <CardTitle>Water Flow Analysis</CardTitle>
                    <CardDescription>Monitoring water flow rates in real time to ensure efficient usage and leak detection (liters/min)</CardDescription>
                </div>
                <TimeRangeSelector field={'water-flow'} defaultTimeRange='5m' />
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[350px]">
                <AreaChart
                    accessibilityLayer
                    data={sensorData['water-flow'] || []}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="_time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => {
                            // Check if the value is a valid date
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                              // Format only if the value is a valid date
                              return format(date, 'HH:mm');
                            }
                            // Return the value as is if it's not a date
                            return value;
                        }}
                    />
                    <YAxis />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                        dataKey="_value"
                        type="step"
                        fill="var(--color-desktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                    />
                </AreaChart>
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
