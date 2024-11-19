import { chartData, UseWebSocketResult } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocketData(url: string): UseWebSocketResult {
    const [chartData, setChartData] = useState<chartData | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [error, setError] = useState<Error | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const messageQueueRef = useRef<string[]>([]);

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
                const newData: chartData = JSON.parse(event.data);
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
        if (wsRef.current) {
            wsRef.current.close();
        }
        connect();
    }, [connect]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        } else {
            console.log('WebSocket is not connected. Queueing message.');
            console.log(messageQueueRef)
            messageQueueRef.current.push(message);
        }
    }, []);

    return { chartData, connectionStatus, error, reconnect, sendMessage };
}