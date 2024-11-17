
import { useState, useEffect, useCallback } from 'react';

export type AirSensorData = {
    _time: Date;                 // Time as a Date object
    _value: number;              // Measurement value (e.g., 0.7077731111296438)
    _field: string;              // 'co'
    _measurement: string;        // 'airSensors'
    sensor_id: string;           // 'TLM0201'
};

interface UseWebSocketResult {
    chartData: AirSensorData[] | null;
    connectionStatus: 'connecting' | 'connected' | 'disconnected';
    error: Error | null;
    reconnect: () => void;
}
  
export function useWebSocketData(url: string): UseWebSocketResult {
    const [chartData, setChartData] = useState<AirSensorData[] | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [error, setError] = useState<Error | null>(null);

    const connect = useCallback(() => {
        setConnectionStatus('connecting');
        const ws = new WebSocket(url);

        ws.onopen = () => {
            setConnectionStatus('connected');
            setError(null);
        };

        ws.onmessage = (event) => {
            try {
                const newData: AirSensorData[] = JSON.parse(event.data);
                setChartData(newData);
            } catch (err) {
                setError(new Error('Failed to parse WebSocket data'));
            }
        };

        ws.onerror = (event) => {
            console.error('WebSocket error:', event);
            setError(new Error('WebSocket connection error'));
        };

        ws.onclose = () => {
            setConnectionStatus('disconnected');
        };

        return () => {
            ws.close();
        };
    }, [url]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const reconnect = useCallback(() => {
        connect();
    }, [connect]);

    return { chartData, connectionStatus, error, reconnect };
}