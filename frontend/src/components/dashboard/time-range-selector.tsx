"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSocketData } from '@/hooks/use-websocket-data';
import { toast } from "@/components/ui/use-toast";
import { FieldType } from '@/types';

const timeRanges = [
    '5m', '10m', '15m', '30m', '1h', '4h', '8h', '12h', '24h', '1d'
  ];
function TimeRangeSelector({ field } : { field : FieldType} ) {
    const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
    const { connectionStatus, error, sendMessage } = useWebSocketData(`ws://localhost:3001/${field}`);

    // useEffect(() => {
    //     if (connectionStatus === 'connected') {
    //         sendMessage(JSON.stringify({ timeRange: selectedTimeRange })); // Send initial time range
    //     }
    // }, [connectionStatus, sendMessage]);

    // const handleTimeRangeChange = (newTimeRange: string) => {
    //     setSelectedTimeRange(newTimeRange);
    //     sendMessage(JSON.stringify({ timeRange: newTimeRange }));
    // };

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
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
            {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                {range}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    )
}

export default TimeRangeSelector