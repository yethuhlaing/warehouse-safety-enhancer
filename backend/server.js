import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import 'dotenv/config'
import { querySensorData } from './services.js'
import url from 'url'

const SERVER_RESPONSE_INTERVAL = 5 * 1000
const SENSOR_TIME_RANGE = '15m'

const app = express()
const server = http.createServer(app)

// Define the list of fields you want to track
const sensors = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'gas', 'emergency',
    'light-intensity', 'motion-detected', 'vibration', 'noise-level',
    'water-level', 'population', 'water-flow'
]

// Define default time ranges for specific fields
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

// Create a WebSocket server for each field
const wssMap = new Map()
const lastSentData = new Map()
const clientDataCache = new Map();

sensors.forEach(sensor => {
    const wss = new WebSocketServer({ noServer: true })
    wssMap.set(sensor, wss)                                                                
    let timeRange = defaultTimeRanges[sensor] || SENSOR_TIME_RANGE // Use default time range for the field, or 15m if not specified

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${sensor} WebSocket`)
        let interval

        const sendData = async (lastTimestamp = null) => {
        try {
            const data = await querySensorData(sensor, timeRange, lastTimestamp);
            if (ws.readyState === WebSocket.OPEN) {
                if (!lastTimestamp) {
                    // Send full data for initial connection
                    ws.send(JSON.stringify({
                        type: 'fullData',
                        data: data
                    }));
                } else if (data.length > 0) {
                    // Send only updates
                    ws.send(JSON.stringify({
                        type: 'update',
                        data: data
                    }));
                }

            }} catch (error) {
                console.error(`Error querying InfluxDB for ${sensor}:`, error)
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ error: 'Internal server error' }))
                }
            }
        }

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message)
                if (data.timeRange) {
                    timeRange = data.timeRange
                    console.log(`Time range updated to: ${timeRange} for ${sensor}`)

                    clearInterval(interval)
                    await sendData()
                    interval = setInterval(() => sendData(clientDataCache.get(ws)), SERVER_RESPONSE_INTERVAL);
                } else if (data.lastTimestamp) {
                    clientDataCache.set(ws, data.lastTimestamp);
                    await sendData(data.lastTimestamp);
                }
            } catch (error) {
                console.error('Error parsing message:', error)
            }
        })

        // Send initial full data
        sendData();

        // Set up interval for updates
        interval = setInterval(() => {
            const lastTimestamp = clientDataCache.get(ws);
            sendData(lastTimestamp);
        }, SERVER_RESPONSE_INTERVAL);

        ws.on('close', () => {
            console.log(`Client disconnected from ${sensor} WebSocket`);
            clearInterval(interval);
            clientDataCache.delete(ws);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error for ${sensor}:`, error);
            clearInterval(interval);
            clientDataCache.delete(ws);
        });
    })
})

// Handle WebSocket upgrade requests
server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url)
    const sensor = pathname.substring(1) // Extract field from URL (e.g., /temperature)

    if (wssMap.has(sensor)) {
        wssMap.get(sensor).handleUpgrade(request, socket, head, (ws) => {
        wssMap.get(sensor).emit('connection', ws, request)
    })
    } else {
        socket.destroy()
    }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
