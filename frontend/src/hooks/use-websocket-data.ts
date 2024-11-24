import { SensorData, UseWebSocketResult } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketPool {
    [url: string]: WebSocket;
}

interface DataCache {
    historicalData: SensorData[];
    lastTimestamp: string | null;
}
export function useWebSocketData(url: string): UseWebSocketResult {
    const [sensorData, setSensorData] = useState<SensorData[] | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [error, setError] = useState<Error | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const messageQueueRef = useRef<string[]>([]);
    const poolRef = useRef<WebSocketPool>({});
    const dataCacheRef = useRef<DataCache>({
        historicalData: [],
        lastTimestamp: null
    });

    const mergeData = useCallback((newData: SensorData[]) => {
        if (!newData || newData.length === 0) return;

        dataCacheRef.current.historicalData = [
            ...dataCacheRef.current.historicalData.filter(existing => 
                !newData.some(update => update._time === existing._time)
            ),
            ...newData
        ].sort((a, b) => new Date(a._time).getTime() - new Date(b._time).getTime());

        setSensorData(dataCacheRef.current.historicalData);
    }, []);

    const connect = useCallback(() => {
        setConnectionStatus('connecting');
        if (!poolRef.current[url]) {
            const ws = new WebSocket(url);
            wsRef.current = ws;
    
            ws.onopen = () => {
                setConnectionStatus('connected');
                setError(null);

                // Send last timestamp to get only new data
                if (dataCacheRef.current.lastTimestamp) {
                    ws.send(JSON.stringify({
                        lastTimestamp: dataCacheRef.current.lastTimestamp
                    }));
                }
                // Send any queued messages
                messageQueueRef.current.forEach(message => ws.send(message));
                messageQueueRef.current = [];
            };
    
            ws.onmessage = (event) => {
                try {
                    const result = JSON.parse(event.data);
                    if (result.type === 'fullData') {
                        // Reset cache for full data update
                        dataCacheRef.current.historicalData = result.data;
                        setSensorData(result.data);
                    } else if (result.type === 'update') {
                        // Merge updates with existing data
                        mergeData(result.data);
                    }
                    
                    // Update last timestamp
                    if (result.data && result.data.length > 0) {
                        const latestTimestamp = result.data[result.data.length - 1]._time;
                        dataCacheRef.current.lastTimestamp = latestTimestamp;
                    }
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
        }else {
            wsRef.current = poolRef.current[url];
            setConnectionStatus('connected');
        }


        return () => {
            if (poolRef.current[url]) {
                poolRef.current[url].close();
                delete poolRef.current[url];
            }
        };
    }, [url]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const reconnect = useCallback(() => {
        if (poolRef.current[url]) {
            poolRef.current[url].close();
            delete poolRef.current[url];
        }
        connect();
    }, [connect, url]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        } else {
            console.log('WebSocket is not connected. Queueing message.');
            console.log(messageQueueRef)
            messageQueueRef.current.push(message);
        }
    }, []);

    return { sensorData, connectionStatus, error, reconnect, sendMessage };
}