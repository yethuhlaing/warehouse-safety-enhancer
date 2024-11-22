"use client";

import { AudioLines, AudioWaveform } from 'lucide-react';
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

export function GuageVibration() {
    const { sensorData } = useWebSocketData('ws://localhost:3001/vibration')

    const [ vibration, setVibration ] = useState<number>(0)
    useEffect(() => {
        if (sensorData && sensorData.length > 0) {
            setVibration(sensorData[sensorData.length - 1]?._value ?? 0); // Ensure fallback if _value is undefined
        } else {
            setVibration(0); // Default to 0 when no data
        }
    }, [sensorData])

    const formatVibrationValue = (value: any): string => {
        if (value !== undefined && value !== null) {
            return value.toFixed(1) + ' m/s²';
        }
        return '0'; // Default to an empty string or another fallback string
    };
    console.log(sensorData)
    return (
        <Card className="flex flex-col">

            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[450px] 2xl:max-h-[350px] "
                    >
                        <GaugeComponent
                            arc={{
                                subArcs: [
                                {
                                    limit: 1.6,
                                    color: '#F2E2FB',
                                    showTick: true
                                },
                                {
                                    limit: 3.2,
                                    color: '#DEC2F7',
                                    showTick: true
                                },
                                {
                                    limit: 4.8,
                                    color: '#C7A6F3',
                                    showTick: true
                                },
                                {
                                    limit: 6.4,
                                    color: '#B486ED',
                                    showTick: true
                                },
                                {
                                    limit: 8,
                                    color: '#9F5FE1',
                                    showTick: true
                                },
                                ]
                            }}
                            value={vibration}
                            minValue={0}
                            maxValue={8}
                            labels={{
                                valueLabel: {
                                    formatTextValue: formatVibrationValue,
                                style: { fontSize: '45px' }
                                },
                                tickLabels: {
                                type: 'outer',
                                ticks: [
                                    { value: 0 },
                                    { value: 2 },
                                    { value: 4 },
                                    { value: 6 },
                                    { value: 8 }
                                ]
                                }
                            }}
                    />
                </ChartContainer>

            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Measured in Meters per Second Squared (m/s²){" "}
                    <AudioWaveform size={18}/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Moderate Vibration: Between 1.5 m/s² and 3.0 m/s² (Potential for minor wear and tear)
                </div>
            </CardFooter>
        </Card>
    );
}
