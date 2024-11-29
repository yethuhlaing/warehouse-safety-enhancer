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
    population: number
    fill?: string
}
export function RadarChartPopulation() {
    const { sensorData } = useWebSocketData('ws://localhost:5000/population')
    console.log(sensorData)
    const [totalPopulation, setTotalPopulation] = useState<radarChartData[]>([])
    useEffect(() => {
        if (Array.isArray(sensorData)) {
            const populations = sensorData?.reduce((sum, item) => sum + item?._value, 0);

            setTotalPopulation([{
                category: "Warehouse",
                population: populations,
                fill: "var(--color-safari)"
            }])
        }
      }, [sensorData])
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1">
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[450px] 2xl:max-h-[350px] "
                    >
                        <RadarChart data={sensorData || []} outerRadius={78}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <PolarAngleAxis dataKey="_field" domain={[0, 'dataMax']}/>
                            <PolarGrid />
                            <Radar
                                dataKey="_value"
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
            </Card>
            <Card className="flex-1">
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[450px] 2xl:max-h-[350px] "
                    >
                        <RadialBarChart
                            data={totalPopulation}
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
                                                        {(totalPopulation[0]?.population || 0).toLocaleString()}
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

