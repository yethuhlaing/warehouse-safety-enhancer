"use client";

import { Sun } from 'lucide-react';
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

const chartConfig = {

    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function GuageLightIntensity() {
    const { sensorData } = useWebSocketData('ws://localhost:3001/light-intensity')

    const [ lightIntensity, setLightIntensity ] = useState<number>(0)
    useEffect(() => {
        if (sensorData && sensorData.length > 0) {
            setLightIntensity(sensorData[sensorData.length - 1]?._value ?? 0); // Ensure fallback if _value is undefined
        } else {
            setLightIntensity(0); // Default to 0 when no data
        }
    }, [sensorData])

    const formatIntensityValue = (value: any): string => {
        if (value !== undefined && value !== null) {
            return value.toFixed(1) + ' lux';
        }
        return '0'; // Default to an empty string or another fallback string
    };
    console.log(sensorData)
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col space-y-2">
                <CardTitle>Light Intensity Indicator</CardTitle>
                <CardDescription>Real time light intensity inside warehouse</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                        config={chartConfig}
                        className="mx-auto max-h-[450px] 2xl:max-h-[350px] "
                        >
                    <GaugeComponent
                        arc={{
                            nbSubArcs: 150,
                            colorArray: ['#F2E2FB', '#DEC2F7','#C7A6F3', '#B486ED', '#9F5FE1'],
                            width: 0.3,
                            padding: 0.003
                        }}
                        labels={{
                            valueLabel: {
                                style: {fontSize: 40},
                                formatTextValue: formatIntensityValue
                            },
                            tickLabels: {
                            type: "outer",
                            ticks: [
                                { value: 100 },
                                { value: 200 },
                                { value: 300 },
                                { value: 400 },
                                { value: 500 },
                                { value: 600 },
                                { value: 700 },
                                { value: 800 },
                                { value: 900 },
                                { value: 1000 },
                            ],
                            defaultTickValueConfig: {
                                formatTextValue: formatIntensityValue
                            }
                            }
                        }}
                        value={lightIntensity}
                        maxValue={1000}
                    />
                </ChartContainer>

            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Measured in lux (lumens per square meter){" "}
                    <Sun size={18}/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Optimal Range: 300-800 lux
                </div>
            </CardFooter>
        </Card>
    );
}
