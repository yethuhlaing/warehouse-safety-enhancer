import { SensorData, UseWebSocketResult } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketPool {
    [url: string]: WebSocket;
}
export function useWebSocketData(url: string): UseWebSocketResult {
    const [sensorData, setSensortData] = useState<SensorData[] | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [error, setError] = useState<Error | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const messageQueueRef = useRef<string[]>([]);
    const poolRef = useRef<WebSocketPool>({});

    const connect = useCallback(() => {
        setConnectionStatus('connecting');
        if (!poolRef.current[url]) {
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
                    const result: SensorData[] = JSON.parse(event.data);
                    setSensortData(result);
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