"use client"

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSocketData } from '@/hooks/use-websocket-data';
import { toast } from "@/components/ui/use-toast";
import { FieldType } from '@/types';


const timeRanges = [
    '1m', '5m', '15m', '30m', '1h', '4h', '8h', '12h', '1d'
];
function TimeRangeSelector({ field, defaultTimeRange } : { field : FieldType , defaultTimeRange: string} ) {
    const [selectedTimeRange, setSelectedTimeRange] = useState<string | undefined>();
    const { updateTimeRange  } = useWebSocketData();

    useEffect(() => {
        if (field) {
            // Set the default time range based on the field
            setSelectedTimeRange(defaultTimeRange);
        }
    }, [field]);

    const handleTimeRangeChange = (timeRange: string) => {
        try {
            setSelectedTimeRange(timeRange);
            updateTimeRange(field, timeRange);
        } catch (error) {
            toast({
                title: "Error",
                description: `: ${error.message}`,
            })
        }

    };

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