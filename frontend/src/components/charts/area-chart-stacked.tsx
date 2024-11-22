"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { useState, useEffect } from "react";
import { useWebSocketData } from "@/hooks/use-websocket-data";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { format } from "date-fns";
import { Button } from "../ui/button";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

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

type CombinedDataType = {
    time: Date,
    co: number,
    pm10: number,
    no2: number,
}
export function AreaChartStacked() {
    const { sensorData: coData, connectionStatus: coStatus, error: coError, reconnect: coReconnect } = useWebSocketData('ws://localhost:3001/co')
    const { sensorData: pm10Data, connectionStatus: pm10Status, error: pm10Error, reconnect: pm10Reconnect } = useWebSocketData('ws://localhost:3001/pm10')
    const { sensorData: no2Data, connectionStatus: pm25Status, error: no2Error, reconnect: no2Reconnect } = useWebSocketData('ws://localhost:3001/no2')
    const [visibleAreas, setVisibleAreas] = useState({
        co: true,
        pm10: false,
        no2: false,
      })
    const [combinedData, setCombinedData] = useState<CombinedDataType[]>([])

    const toggleArea = (area: keyof typeof visibleAreas) => {
        setVisibleAreas(prev => ({ ...prev, [area]: !prev[area] }))
    }

    useEffect(() => {
        if (Array.isArray(coData) && Array.isArray(pm10Data) && Array.isArray(no2Data)) {
            const combined = coData?.map((item, index) => ({
                time: item._time,
                co: item._value,
                pm10: pm10Data[index]?._value,
                no2: no2Data[index]?._value,
          }))
          setCombinedData(combined)
        }
      }, [coData, pm10Data, no2Data])
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Air Quality Measurements</CardTitle>
                    <CardDescription>
                        Showing the Air quality Area Chart for an hour
                    </CardDescription>
                </div>
                <div className="flex px-6 py-4">
                    <div className="flex space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="co-toggle"
                            checked={visibleAreas.co}
                            onCheckedChange={() => toggleArea('co')}
                            />
                            <Label htmlFor="co-toggle">co</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="pm10-toggle"
                            checked={visibleAreas.pm10}
                            onCheckedChange={() => toggleArea('pm10')}
                            />
                            <Label htmlFor="pm10-toggle">pm10</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="no2-toggle"
                            checked={visibleAreas.no2}
                            onCheckedChange={() => toggleArea('no2')}
                            />
                            <Label htmlFor="no2-toggle">no2</Label>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
                <ChartContainer config={chartConfig} className="aspect-auto h-[350px]">
                    <AreaChart
                        accessibilityLayer
                        data={combinedData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: -30,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <defs>
                            <linearGradient id="colorCo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis />
                        <XAxis
                            dataKey="time"
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
                        {visibleAreas.co && (
                            <Area
                                type="natural"
                                dataKey="co"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorCo)"
                                stackId="a"
                                activeDot={{ stroke: 'red', strokeWidth: 2 }}
                            />
                            )}
                            {visibleAreas.pm10 && (
                            <Area
                                type="natural"
                                dataKey="pm10"
                                stroke="#82ca9d"
                                fillOpacity={1}
                                fill="url(#colorPm10)"
                                stackId="a"
                                activeDot={{ stroke: 'red', strokeWidth: 2 }}
                            />
                            )}
                            {visibleAreas.no2 && (
                            <Area
                                type="natural"
                                dataKey="no2"
                                stroke="#ffc658"
                                fillOpacity={1}
                                fill="url(#colorNo2)"
                                stackId="a"
                                activeDot={{ stroke: 'red', strokeWidth: 2 }}
                            />
                            )}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="size-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    January - June 2024
                </div>
            </CardFooter> */}
        </Card>
    );
}
