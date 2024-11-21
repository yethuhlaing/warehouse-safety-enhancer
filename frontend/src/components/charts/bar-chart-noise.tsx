"use client";

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { format } from 'date-fns';
import { FormattedAggregateData } from '@/types';
import { Capitalize, formatChartData } from '@/lib/utils';
import TimeRangeSelector from '../dashboard/time-range-selector';


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
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("desktop");
    const { sensorData, connectionStatus, error, reconnect } = useWebSocketData('ws://localhost:3001/noise_level');
    // const { field, rawData, minimum, maximum, average } = formatChartData(chartData) as FormattedAggregateData  
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col space-y-2">
                    <CardTitle>Noise Level</CardTitle>
                </div>
                <TimeRangeSelector field={'noise_level'} />
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {sensorData && !error && connectionStatus == 'connected' && (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={sensorData}
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
                                tickFormatter={(value) => format(new Date(value), 'MMMd,HH:mm')}                            
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
                )}

            </CardContent>
        </Card>
    );
}
