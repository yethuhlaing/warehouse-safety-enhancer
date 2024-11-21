"use client";

import { Flame } from 'lucide-react';
import {
    Cell,
    Label,
    Pie,
    PieChart,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useWebSocketData } from '@/hooks/use-websocket-data';
import { useState, useEffect } from 'react';
import GaugeComponent from 'react-gauge-component';


type radarChartData = {
    category: string
    value: number
    fill?: string
}
const chartConfig = {

    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function GuageEmergency() {
    const { sensorData } = useWebSocketData('ws://localhost:3001/emergency')

    const [ emergencyValue, setEmergencyValue ] = useState<number | undefined>(undefined)
    useEffect(() => {
        if (sensorData) {
            setEmergencyValue(sensorData[sensorData.length-1]?._value)
        }
    }, [sensorData])
    console.log(sensorData)
    return (
        <Card className="flex flex-col">

            <CardContent className="pb-0">
                <ChartContainer
                        config={chartConfig}
                        className="mx-auto max-h-[450px] 2xl:max-h-[350px] "
                        >
                    <GaugeComponent
                        type="semicircle"
                        arc={{
                            colorArray: ['#00FF15', '#FF2121'],
                            padding: 0.02,
                            subArcs:
                            [
                                {   limit: 40, 
                                    tooltip: {
                                        text: 'Safe!'
                                    }, 
                                },
                                {   
                                    limit: 60,
                                    tooltip: {
                                        text: 'Fire Suspected!'
                                    }, 
                                },
                                {   
                                    limit: 70,
                                    tooltip: {
                                        text: 'Fire Alarm Activated!'
                                    },
                                 },
                                 {   
                                    limit: 80,
                                    tooltip: {
                                        text: 'Emergency!'
                                    },
                                 },
                            ]
                        }}
                        pointer={{type: "blob", animationDelay: 0 }}
                        value={emergencyValue}
                    />
                </ChartContainer>

            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <Flame size={4}/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Total visitors in the last 6 months
                </div>
            </CardFooter> */}
        </Card>
    );
}
