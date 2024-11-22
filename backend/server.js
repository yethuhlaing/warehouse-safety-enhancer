import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import { InfluxDB } from '@influxdata/influxdb-client'
import 'dotenv/config'
import { querySensorData, writeInfluxDB } from './services.js'
import url from 'url'

const SERVER_RESPONSE_INTERVAL = 5 * 1000
const SENSOR_TIME_RANGE = '15m'

const app = express()
const server = http.createServer(app)

// Define the list of fields you want to track
const sensors = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'gas', 'emergency',
    'light-intensity', 'motion-detected', 'vibration', 'noise-level',
    'water_level', 'population'
]

// Define default time ranges for specific fields
const defaultTimeRanges = {
    'temperature': '15m',
    'humidity': '15m',
    'co': '1m',
    'no2': '1m',
    'pm10': '1m',
    'gas': 'last',
    'emergency': 'last',
    'light-intensity': 'last',
    'motion-detected': 'last',
    'vibration': 'last',
    'noise-level': '15m',
    'water-level': '15m',
    'population': 'last',
}

// Create a WebSocket server for each field
const wssMap = new Map()

sensors.forEach(sensor => {
    const wss = new WebSocketServer({ noServer: true })
    wssMap.set(sensor, wss)                                                                
    let timeRange = defaultTimeRanges[sensor] || SENSOR_TIME_RANGE // Use default time range for the field, or 15m if not specified

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${sensor} WebSocket`)
        let interval


        const sendData = async () => {
        try {
            const data = await querySensorData(sensor, timeRange)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data))
                console.log(data)

            }} catch (error) {
                console.error(`Error querying InfluxDB for ${sensor}:`, error)
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ error: 'Internal server error' }))
                }
            }
        }

        // Send initial data
        sendData()
        interval = setInterval(sendData, SERVER_RESPONSE_INTERVAL)

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message)
                if (data.timeRange) {
                    timeRange = data.timeRange
                    console.log(`Time range updated to: ${timeRange} for ${sensor}`)

                    clearInterval(interval)
                    await sendData()
                    interval = setInterval(sendData, SERVER_RESPONSE_INTERVAL)
                }
            } catch (error) {
                console.error('Error parsing message:', error)
            }
            })

            ws.on('close', () => {
                console.log(`Client disconnected from ${sensor} WebSocket`)
                clearInterval(interval)
            })

            ws.on('error', (error) => {
                console.error(`WebSocket error for ${sensor}:`, error)
                clearInterval(interval)
            })
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
