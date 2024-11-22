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


    const [ emergencyValue, setEmergencyValue ] = useState<number>(0)
    useEffect(() => {
        if (sensorData && sensorData.length > 0) {
            setEmergencyValue(sensorData[sensorData.length - 1]?._value ?? 0); // Ensure fallback if _value is undefined
        } else {
            setEmergencyValue(0); // Default to 0 when no data
        }
    }, [sensorData])
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
                            colorArray: ['#F2E2FB', '#DEC2F7', '#C7A6F3','#B486ED','#9F5FE1'],
                            padding: 0.02,
                            subArcs: [
                                { limit: 40, showTick: true, tooltip: { text: 'Safe!' } },
                                { limit: 60, showTick: true, tooltip: { text: 'Fire Suspected!' } },
                                { limit: 70, showTick: true, tooltip: { text: 'Fire Alarm Activated!' } },
                                { limit: 80, showTick: true, tooltip: { text: 'Emergency!' } },
                                { limit: 90, showTick: true, tooltip: { text: 'Evacuation!' } },
                            ]
                        }}
                        pointer={{ type: "blob", animationDelay: 0 }}
                        value={emergencyValue ?? 0} // Fallback to 0 if lightIntensity is undefined or null
                    />
                </ChartContainer>

            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Emergency Status Indicator{" "}
                    <Flame size={18}/>
                </div>
                {/* <div className="leading-none text-muted-foreground">
                    Total visitors in the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    );
}
