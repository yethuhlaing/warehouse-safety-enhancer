"use client";

import { Skull, TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

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

const sensorColors = {
    methane: "hsl(var(--chart-1))",
    propane: "hsl(var(--chart-2))",
    hydrogen: "hsl(var(--chart-3))",
    ammonia: "hsl(var(--chart-4))",
    ozone: "hsl(var(--chart-5))",
  }

const chartConfig = {
    methane: {
        label: "Methane",
        color: sensorColors.methane,
    },
    propane: {
        label: "Propane",
        color: sensorColors.propane,
    },
    hydrogen: {
        label: "Hydrogen",
        color: sensorColors.hydrogen,
    },
    ammonia: {
        label: "Ammonia",
        color: sensorColors.ammonia,
    },
    ozone: {
        label: "Ozone",
        color: sensorColors.ozone,
    },
      
} satisfies ChartConfig;

export function RadialGridGas() {
    const { sensorData, connectionStatus, error, reconnect } = useWebSocketData('ws://localhost:3001/gas');
    console.log(sensorData)
    return (
        <Card className="flex flex-col">

            <CardContent className="flex-1 pb-0">
                {sensorData && !error && connectionStatus == 'connected' && (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto max-h-[250px]"
                    >
                        <RadialBarChart
                            data={sensorData}
                            innerRadius={40}
                            outerRadius={120}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        nameKey="_field"
                                    />
                                }
                            />
                            <PolarGrid gridType="circle" />
                            <RadialBar
                                dataKey="_value"
                                fill="hsl(var(--chart-1))"
                                label={{ 
                                    position: 'insideStart', 
                                    fontWeight: 600,
                                    fontSize: 8,
                                    formatter: (value) => `${value.toFixed(2)}`
                                }}
                                />
                        </RadialBarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Distribution of hazardous Gases {" "}
                    <Skull size={14} />
                </div>
                <div className="leading-none text-muted-foreground">
                    If levels approach critical values, take immediate action to mitigate risks.
                </div>
            </CardFooter>
        </Card>
    );
}
