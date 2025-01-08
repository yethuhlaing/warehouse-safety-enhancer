"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
import { useEffect } from "react";
import { SensorData } from "@/types";


const chartConfig = {
    lobby: {
        label: "Lobby",
        color: "hsl(var(--chart-3))",
    },
    storage: {
        label: "Storage",
        color: "hsl(var(--chart-1))",
    },
    office: {
        label: "Office",
        color: "hsl(var(--chart-1))",
    },
    security: {
        label: "Security",
        color: "hsl(var(--chart-2))",
    },
    cafeteria: {
        label: "Cafeteria",
        color: "hsl(var(--chart-3))",
    },
    inspection: {
        label: "Inspection",
        color: "hsl(var(--chart-4))",
    },
    automation: {
        label: "Automation",
        color: "hsl(var(--chart-5))",
    },    
    maintenance: {
        label: "Maintenance",
        color: "ff0000",
    },
} satisfies ChartConfig;

export function BarChartHumidity() {
    const { sensorData, connectionStatus, subscribe, updateTimeRange } = useWebSocketData('ws://localhost:5000/sensors');
    
    useEffect(() => {
        subscribe(['humidity']);
    }, []);
    
     
    const latestReading = sensorData?.humidity?.[sensorData?.humidity?.length - 1] as SensorData;


        // Transform the raw data for Recharts
    const chartData = latestReading ? [
        { category: "lobby", value: latestReading.lobby },
        { category: "storage", value: latestReading.storage },
        { category: "office", value: latestReading.office },
        { category: "security", value: latestReading.security },
        { category: "cafeteria", value: latestReading.cafeteria },
        { category: "inspection", value: latestReading.inspection },
        { category: "automation", value: latestReading.automation },
        { category: "maintenance", value: latestReading.maintenance }
    ] : [];
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Humidity Monitoring Graph</CardTitle>
                <CardDescription>Real-time humidity levels across different areas</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData || []}
                        layout="vertical"
                        margin={{
                            left: 32,
                        }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={12}
                            axisLine={false}
                            
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                    ?.label
                            }
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="value" layout="vertical" radius={5} fill={"hsl(var(--chart-1)"} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="size-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Results for the top 5 browsers
                </div>
            </CardFooter> */}
        </Card>
    );
}
