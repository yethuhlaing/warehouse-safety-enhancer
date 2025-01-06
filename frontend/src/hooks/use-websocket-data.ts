import { SensorData, UseWebSocketResult } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface DataCache {
    [sensorType: string]: {
        historicalData: SensorData[];
        lastTimestamp: string | null;
    };
}

interface UseWebSocketDataResult {
    sensorData: { [sensorType: string]: SensorData[] | null };
    connectionStatus: 'connecting' | 'connected' | 'disconnected';
    error: Error | null;
    reconnect: () => void;
    sendMessage: (message: string) => void;
    subscribe: (sensorTypes: string[], timeRanges?: { [sensorType: string]: string }) => void;
    updateTimeRange: (sensorType: string, timeRange: string) => void;
}

export function useWebSocketData(url: string): UseWebSocketDataResult {
    const [sensorData, setSensorData] = useState<{ [sensorType: string]: SensorData[] | null }>({});
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [error, setError] = useState<Error | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const messageQueueRef = useRef<string[]>([]);
    const dataCacheRef = useRef<DataCache>({});

    const mergeData = useCallback((sensorType: string, newData: SensorData[]) => {
        if (!newData || newData.length === 0) return;

        if (!dataCacheRef.current[sensorType]) {
            dataCacheRef.current[sensorType] = {
                historicalData: [],
                lastTimestamp: null
            };
        }

        dataCacheRef.current[sensorType].historicalData = [
            ...dataCacheRef.current[sensorType].historicalData.filter(existing => 
                !newData.some(update => update._time === existing._time)
            ),
            ...newData
        ].sort((a, b) => new Date(a._time).getTime() - new Date(b._time).getTime());

        setSensorData(prevData => ({
            ...prevData,
            [sensorType]: dataCacheRef.current[sensorType].historicalData
        }));
    }, []);

    const connect = useCallback(() => {
        setConnectionStatus('connecting');
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnectionStatus('connected');
            setError(null);

            // Send any queued messages
            messageQueueRef.current.forEach(message => ws.send(message));
            messageQueueRef.current = [];
        };

        ws.onmessage = (event) => {
            try {
                const result = JSON.parse(event.data);
                const { sensorType, type, data, error: wsError } = result;

                if (wsError) {
                    setError(new Error(wsError));
                    return;
                }

                if (type === 'fullData') {
                    if (!dataCacheRef.current[sensorType]) {
                        dataCacheRef.current[sensorType] = {
                            historicalData: [],
                            lastTimestamp: null
                        };
                    }
                    dataCacheRef.current[sensorType].historicalData = data;
                    setSensorData(prevData => ({
                        ...prevData,
                        [sensorType]: data
                    }));
                } else if (type === 'update') {
                    mergeData(sensorType, data);
                }

                if (data && data.length > 0) {
                    dataCacheRef.current[sensorType].lastTimestamp = data[data.length - 1]._time;
                }
            } catch (err) {
                console.error(err);
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
    }, [url, mergeData]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const reconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
        }
        connect();
    }, [connect]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        } else {
            messageQueueRef.current.push(message);
        }
    }, []);

    const subscribe = useCallback((sensorTypes: string[], timeRanges?: { [sensorType: string]: string }) => {
        sendMessage(JSON.stringify({
            action: 'subscribe',
            sensorTypes,
            timeRanges
        }));
    }, [sendMessage]);

    const updateTimeRange = useCallback((sensorType: string, timeRange: string) => {
        sendMessage(JSON.stringify({
            action: 'updateTimeRange',
            sensorType,
            timeRange
        }));
    }, [sendMessage]);

    return { 
        sensorData, 
        connectionStatus, 
        error, 
        reconnect, 
        sendMessage,
        subscribe,
        updateTimeRange
    };
}