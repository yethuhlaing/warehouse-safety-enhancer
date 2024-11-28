"use client"

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSocketData } from '@/hooks/use-websocket-data';
import { toast } from "@/components/ui/use-toast";
import { FieldType } from '@/types';

const defaultTimeRanges = {
    'temperature': '5m',
    'humidity': 'last',
    'co': '5m',
    'no2': '5m',
    'pm10': '5m',
    'gas': 'last',
    'emergency': 'last',
    'light-intensity': 'last',
    'motion-detected': 'last',
    'vibration': 'last',
    'noise-level': '5m',
    'water-level': '5m',
    'population': 'last',
    'water-flow': '5m',
}
const timeRanges = [
    '1m', '5m', '15m', '30m', '1h', '4h', '8h', '12h', '1d'
];
function TimeRangeSelector({ field } : { field : FieldType | null} ) {
    const [selectedTimeRange, setSelectedTimeRange] = useState<string | undefined>();
    const { error, sendMessage } = useWebSocketData(`ws://localhost:3001/${field}`);

    useEffect(() => {
        if (field) {
            // Set the default time range based on the field
            setSelectedTimeRange(defaultTimeRanges[field]);
        }
    }, [field]);

    const handleTimeRangeChange = (timeRange: string) => {
        setSelectedTimeRange(timeRange);
        sendMessage(JSON.stringify({ timeRange: timeRange }));
    };

    if (error) {
        toast({
            title: "Error",
            description: `: ${error.message}`,
        })
    }

    return (
        <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[100px] md:w-[180px]">
            <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
            {timeRanges?.map((range) => (
                <SelectItem key={range} value={range}>
                {range}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    )
}

export default TimeRangeSelector