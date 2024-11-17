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
import { outputDate } from "@/lib/utils";
import { format } from "date-fns";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

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

export type AirSensorData = {
    _time: Date;                 // Time as a Date object
    _value: number;              // Measurement value (e.g., 0.7077731111296438)
    _field: string;              // 'co'
    _measurement: string;        // 'airSensors'
    sensor_id: string;           // 'TLM0201'
};

export function LineChartMultiple() {
    const { chartData, connectionStatus, error, reconnect } = useWebSocketData('ws://localhost:3001/temperature');

    // Get the Date
    const duration = chartData?.[0]?._time ? outputDate(chartData[0]._time , chartData[chartData.length - 1]._time) : null
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Line Chart - Temperature</CardTitle>
                <CardDescription>{duration}</CardDescription>
            </CardHeader>
            <CardContent>
                {connectionStatus !== 'connected' && (
                    <div>Connecting to WebSocket...</div>
                )}

                {error && (
                    <div>
                        <p>Error: {error?.message}</p>
                        <Button onClick={reconnect}>Reconnect</Button>
                    </div>
                )}
                {chartData && !error && (
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
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
                                tickMargin={12}
                                tickFormatter={(value) => format(new Date(value), 'MMMd,HH:mm')}                            />
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
                )}

            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="size-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
}
