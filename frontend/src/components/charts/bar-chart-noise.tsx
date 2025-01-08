"use client";

import React, { useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { format } from 'date-fns';
import TimeRangeSelector from '../dashboard/time-range-selector';
import { AudioLines } from 'lucide-react';


const chartConfig = {
    views: {
        label: "Page Views",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    tablet: {
        label: "tablet",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;


export function BarChartNoise() {
    const { sensorData, connectionStatus, subscribe, updateTimeRange } = useWebSocketData('ws://localhost:5000/sensors');
    useEffect(() => {
        subscribe(['noise-level'], {
            "noise-level": '5m',
        });
    }, []);
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col space-y-2">
                    <CardTitle>Noise Level Tracking Chart</CardTitle>
                    <CardDescription>Live noise level data across different areas to maintain operational safety and comply with noise regulations.</CardDescription>
                </div>
                <TimeRangeSelector field={'noise-level'} defaultTimeRange={'5m'} />
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={sensorData['noise-level'] || []}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 12,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="_time"
                                tickLine={true}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    // Check if the value is a valid date
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                      // Format only if the value is a valid date
                                      return format(date, 'MMMd,HH:mm');
                                    }
                                    // Return the value as is if it's not a date
                                    return value;
                                }}                      
                            />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'decibels (dB)', angle: 90, position: 'insideRight' }} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        labelFormatter={(value) => {
                                            return format(new Date(value), 'MMMd,HH:mm');
                                        }}
                                    />
                                }
                            />
                            <Bar yAxisId="right" dataKey="_value" fill={`var(--color-desktop)`} name="noise_level" />
                        </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Measured in Decibels (dB){" "}
                    <AudioLines size={18}/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Optimal Noise Range: 50-85 dB
                </div>
            </CardFooter>
        </Card>
    );
}
