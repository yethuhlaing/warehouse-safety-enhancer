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
const fields = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'propane', 'methane', 'emergency',
    'light_intensity', 'motion_detected', 'vibration', 'noise_level',
    'water_level', 'storage-population', 'lobby-population', 'office-population', 'cafeteria-population', 'security-population', 'inspection-population', 'automation-population', 'maintenance-population'
]

// Define default time ranges for specific fields
const defaultTimeRanges = {
    'temperature': '15m',
    'humidity': '15m',
    'co': '1m',
    'no2': '1m',
    'pm10': '1m',
    'propane': '1m',
    'methane': '1m',
    'emergency': 'last',
    'light_intensity': '15m',
    'motion_detected': 'last',
    'vibration': '1m',
    'noise_level': '15m',
    'water_level': '15m',
    'storage-population': 'last',
    'lobby-population': 'last',
    'office-population': 'last',
    'cafeteria-population': 'last',
    'security-population': 'last',
    'inspection-population': 'last',
    'automation-population': 'last',
    'maintenance-population': 'last'
}

// Create a WebSocket server for each field
const wssMap = new Map()

fields.forEach(field => {
    const wss = new WebSocketServer({ noServer: true })
    wssMap.set(field, wss)                                                                
    let timeRange = defaultTimeRanges[field] || SENSOR_TIME_RANGE // Use default time range for the field, or 15m if not specified

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${field} WebSocket`)
        let interval


        const sendData = async () => {
        try {
            const data = await querySensorData(field, timeRange)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data))
            }} catch (error) {
                console.error(`Error querying InfluxDB for ${field}:`, error)
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
                    console.log(`Time range updated to: ${timeRange} for ${field}`)

                    clearInterval(interval)
                    await sendData()
                    interval = setInterval(sendData, SERVER_RESPONSE_INTERVAL)
                }
            } catch (error) {
                console.error('Error parsing message:', error)
            }
            })

            ws.on('close', () => {
                console.log(`Client disconnected from ${field} WebSocket`)
                clearInterval(interval)
            })

            ws.on('error', (error) => {
                console.error(`WebSocket error for ${field}:`, error)
                clearInterval(interval)
            })
    })
})

// Handle WebSocket upgrade requests
server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url)
    const field = pathname.substring(1) // Extract field from URL (e.g., /temperature)

    if (wssMap.has(field)) {
        wssMap.get(field).handleUpgrade(request, socket, head, (ws) => {
        wssMap.get(field).emit('connection', ws, request)
    })
    } else {
        socket.destroy()
    }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
