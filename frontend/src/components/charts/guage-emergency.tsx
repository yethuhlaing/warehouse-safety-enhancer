"use client";

import { Flame } from 'lucide-react';
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
import { SensorData } from '@/types';

const chartConfig = {

    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function GuageEmergency() {

    const { sensorData, connectionStatus, subscribe, updateTimeRange } = useWebSocketData('ws://localhost:5000/sensors');
    useEffect(() => {
        subscribe(['emergency'], {
            "emergency": 'last',
        });
    }, []);
    const latestReading = sensorData?.emergency?.[sensorData?.emergency?.length - 1] as SensorData;

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col space-y-2">
                <CardTitle>Emergency Status Indicator</CardTitle>
                <CardDescription>Showing the tendency for fire alert</CardDescription>
            </CardHeader>
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
                        value={latestReading?.emergency ?? 0} // Fallback to 0 if lightIntensity is undefined or null
                    />
                </ChartContainer>

            </CardContent>
            <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Fire Alert system detection{" "}<Flame size={18}/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Integrated fire Alarm system
                </div>
            </CardFooter>
        </Card>
    );
}
