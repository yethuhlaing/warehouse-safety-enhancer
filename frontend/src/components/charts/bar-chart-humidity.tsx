"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

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
    const { sensorData } = useWebSocketData('ws://localhost:3001/humidity')
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
                        data={sensorData || []}
                        layout="vertical"
                        margin={{
                            left: 32,
                        }}
                    >
                        <YAxis
                            dataKey="_field"
                            type="category"
                            tickLine={false}
                            tickMargin={12}
                            axisLine={false}
                            
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                    ?.label
                            }
                        />
                        <XAxis dataKey="_value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="_value" layout="vertical" radius={5} fill={"hsl(var(--chart-1)"} />
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
