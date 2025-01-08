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

const defaultTimeRanges = {
    'temperature': '5m',
    'humidity': 'last',
    'air': 'last',
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
const sensorTypes = Object.keys(defaultTimeRanges);

// Create a single WebSocket server
const wss = new WebSocketServer({ noServer: true })

// Store client subscriptions and their data
const clientSubscriptions = new Map()

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket')
    const intervals = new Map()
    
    const sendSensorData = async (sensorType, timeRange, lastTimestamp = null) => {
        try {
            const data = await querySensorData(sensorType, timeRange, lastTimestamp)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    sensorType,
                    type: lastTimestamp ? 'update' : 'fullData',
                    data: data
                }))
            }
        } catch (error) {
            console.error(`Error querying InfluxDB for ${sensorType}:`, error)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ 
                    sensorType,
                    error: 'Internal server error' 
                }))
            }
        }
    }

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message)
            
            // Handle subscription request
            if (data.action === 'subscribe' && data.sensorTypes) {
                // Clear existing intervals for this client
                intervals.forEach(interval => clearInterval(interval))
                intervals.clear()

                // Store new subscriptions
                clientSubscriptions.set(ws, {
                    sensorTypes: data.sensorTypes,
                    timeRanges: {},
                    lastTimestamps: {}
                })

                // Set up data fetching for each subscribed sensor
                data.sensorTypes.forEach(sensorType => {
                    if (!sensorTypes.includes(sensorType)) return

                    const timeRange = data.timeRanges?.[sensorType] || 
                                    defaultTimeRanges[sensorType] || 
                                    SENSOR_TIME_RANGE

                    clientSubscriptions.get(ws).timeRanges[sensorType] = timeRange

                    // Send initial data
                    sendSensorData(sensorType, timeRange)

                    // Set up interval for updates
                    intervals.set(sensorType, setInterval(() => {
                        const lastTimestamp = clientSubscriptions.get(ws)?.lastTimestamps[sensorType]
                        sendSensorData(sensorType, timeRange, lastTimestamp)
                    }, SERVER_RESPONSE_INTERVAL))
                })
            }
            // Handle timestamp updates
            else if (data.action === 'updateTimestamp' && data.sensorType && data.lastTimestamp) {
                if (clientSubscriptions.has(ws)) {
                    clientSubscriptions.get(ws).lastTimestamps[data.sensorType] = data.lastTimestamp
                    await sendSensorData(
                        data.sensorType,
                        clientSubscriptions.get(ws).timeRanges[data.sensorType],
                        data.lastTimestamp
                    )
                }
            }
            // Handle time range updates
            else if (data.action === 'updateTimeRange' && data.sensorType && data.timeRange) {
                if (clientSubscriptions.has(ws)) {
                    clientSubscriptions.get(ws).timeRanges[data.sensorType] = data.timeRange
                    
                    if (intervals.has(data.sensorType)) {
                        clearInterval(intervals.get(data.sensorType))
                    }
                    
                    await sendSensorData(data.sensorType, data.timeRange)
                    
                    intervals.set(data.sensorType, setInterval(() => {
                        const lastTimestamp = clientSubscriptions.get(ws)?.lastTimestamps[data.sensorType]
                        sendSensorData(data.sensorType, data.timeRange, lastTimestamp)
                    }, SERVER_RESPONSE_INTERVAL))
                }
            }
        } catch (error) {
            console.error('Error processing message:', error)
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket')
        intervals.forEach(interval => clearInterval(interval))
        clientSubscriptions.delete(ws)
    })

    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        intervals.forEach(interval => clearInterval(interval))
        clientSubscriptions.delete(ws)
    })
})

server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url)
    
    if (pathname === '/sensors') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})

const PORT = 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})