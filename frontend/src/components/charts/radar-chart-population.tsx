"use client";

import { Footprints, UsersRound  } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Label,RadialBar,RadialBarChart, } from "recharts";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect , useState } from "react";
import { useWebSocketData } from "@/hooks/use-websocket-data";
import { getCurrentDateTime } from "@/lib/utils";
import { SensorData } from "@/types";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    population: {
        label: "Population",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

type radarChartData = {
    category: string
    population: string | number | undefined
    fill?: string
}

export function RadarChartPopulation() {
    const { sensorData, connectionStatus, subscribe, updateTimeRange } = useWebSocketData();
    useEffect(() => {
        subscribe(['population']);
    }, []);
    
    function getTotalPopulation(sensorData: SensorData) {
        // Extract only numeric fields and sum them up
        let total = 0;
        for (const key in sensorData) {
            if (key !== "_time" && key !== "_value" && key !== "_field" && key !== "_measurement" && key !== "sensor_id") {
                const value = sensorData[key];
                if (typeof value === "number") {
                    total += value;
                }
            }
        }
        return total;
    }
    const latestReading = sensorData?.population?.[sensorData?.population?.length - 1] as SensorData;
    // Calculate total population by summing all areas
    console.log(latestReading)
    if (!latestReading) return null;
    const totalPeople = [{
        category: "Warehouse",
        population: getTotalPopulation(latestReading || {}),
        fill: "var(--color-safari)"
    }];

      // Transform the raw data for Recharts
    const chartData = latestReading ? [
        { category: "Lobby", population: latestReading.lobby },
        { category: "Storage", population: latestReading.storage },
        { category: "Office", population: latestReading.office },
        { category: "Security", population: latestReading.security },
        { category: "Cafeteria", population: latestReading.cafeteria },
        { category: "Inspection", population: latestReading.inspection },
        { category: "Automation", population: latestReading.automation },
        { category: "Maintenance", population: latestReading.maintenance }
    ] : [];

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1">
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[450px] 2xl:max-h-[350px] "
                    >
                        <RadarChart data={chartData} outerRadius={78}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <PolarAngleAxis dataKey="category" domain={[0, 'dataMax']}/>
                            <PolarGrid />
                            <Radar
                                dataKey="population"
                                fill="var(--color-desktop)"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        Population distribution in Warehouse Zone{" "}
                        <UsersRound className="size-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        {getCurrentDateTime()}
                    </div>
                </CardFooter>
            </Card>* 
            <Card className="flex-1">
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[450px] 2xl:max-h-[350px] "
                    >
                        <RadialBarChart
                            data={totalPeople}
                            startAngle={0}
                            endAngle={250}
                            innerRadius={80}
                            outerRadius={110}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar
                                dataKey="population"
                                background
                                cornerRadius={10}
                            />
                            <PolarRadiusAxis
                                tick={false}
                                tickLine={false}
                                axisLine={false}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            "cx" in viewBox &&
                                            "cy" in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-4xl font-bold"
                                                    >
                                                        {(totalPeople[0]?.population || 0).toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Visitors
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        Showing total population in Warehouse {" "}
                        <Footprints className="size-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        {getCurrentDateTime()}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

