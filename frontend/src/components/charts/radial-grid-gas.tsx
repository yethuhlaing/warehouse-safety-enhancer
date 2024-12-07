"use client";

import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

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
    const { sensorData } = useWebSocketData('ws://localhost:5000/gas');
    console.log(sensorData)
    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col space-y-2">
                    <CardTitle>Hazardous Gas Distribution</CardTitle>
                    <CardDescription>Real-time monitoring of gas levels across multiple zones</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pb-0">
            <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[450px] 2xl:max-h-[350px]"
                >
                    <RadialBarChart
                        data={sensorData || []}
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
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Hazardous Gas Distribution {" "}
                    <Skull size={20} />
                </div>
                <div className="leading-none text-muted-foreground">
                    
                </div>
            </CardFooter> */}
        </Card>
    );
}
