"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
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
import { Button } from "../ui/button";
import { Capitalize, formatChartData, formatSensorDate } from "@/lib/utils";
import { format } from "date-fns";
import { FormattedAggregateData } from "@/types";
import TimeRangeSelector from "../dashboard/time-range-selector";


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

export function LineChartTemperature() {
    const { sensorData, connectionStatus, error, reconnect } = useWebSocketData('ws://localhost:3001/temperature');
    console.log(sensorData)
    // const { 
    //     field, minimum, maximum, average
    // } = formatChartData(chartData) as FormattedAggregateData  

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col space-y-2">
                    <CardTitle>Temperature Monitoring Graph</CardTitle>
                    <CardDescription>Real-time temperature from multiple sensors</CardDescription>
                </div>
                <TimeRangeSelector field={'temperature'} />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[350px]">
                    <LineChart
                        accessibilityLayer
                        data={sensorData || []}
                        margin={{
                            left: -25,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="_time"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={12}
                            tickFormatter={(value) => format(new Date(value), 'HH:mm')} />
                        <YAxis />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="_value"
                            type="monotone"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                        {/* <Line
                            dataKey="temperature"
                            type="monotone"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            dot={false}
                        /> */}
                    </LineChart>
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
