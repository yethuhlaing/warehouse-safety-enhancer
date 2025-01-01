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

// Define the list of sensors you want to track
const sensors = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'gas', 'emergency',
    'light-intensity', 'motion-detected', 'vibration', 'noise-level',
    'water-level', 'population', 'water-flow'
]

// Define default time ranges for specific sensors
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

// Create a single WebSocket server
const wss = new WebSocketServer({ noServer: true })

// Store client subscriptions and their last timestamps
const clientSubscriptions = new Map()

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket')
    let intervals = new Map()
    
    const sendSensorData = async (sensor, timeRange, lastTimestamp = null) => {
        try {
            const data = await querySensorData(sensor, timeRange, lastTimestamp)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    sensor,
                    type: lastTimestamp ? 'update' : 'fullData',
                    data: data
                }))
            }
        } catch (error) {
            console.error(`Error querying InfluxDB for ${sensor}:`, error)
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ 
                    sensor,
                    error: 'Internal server error' 
                }))
            }
        }
    }

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message)
            
            // Handle subscription request
            if (data.action === 'subscribe' && data.sensors) {
                // Clear existing intervals for this client
                intervals.forEach(interval => clearInterval(interval))
                intervals.clear()

                // Store new subscriptions
                clientSubscriptions.set(ws, {
                    sensors: data.sensors,
                    timeRanges: {},
                    lastTimestamps: {}
                })

                // Set up data fetching for each subscribed sensor
                data.sensors.forEach(sensor => {
                    if (!sensors.includes(sensor)) return

                    const timeRange = data.timeRanges?.[sensor] || 
                                    defaultTimeRanges[sensor] || 
                                    SENSOR_TIME_RANGE

                    clientSubscriptions.get(ws).timeRanges[sensor] = timeRange

                    // Send initial data
                    sendSensorData(sensor, timeRange)

                    // Set up interval for updates
                    intervals.set(sensor, setInterval(() => {
                        const lastTimestamp = clientSubscriptions.get(ws)?.lastTimestamps[sensor]
                        sendSensorData(sensor, timeRange, lastTimestamp)
                    }, SERVER_RESPONSE_INTERVAL))
                })
            }
            // Handle timestamp updates
            else if (data.action === 'updateTimestamp' && data.sensor && data.lastTimestamp) {
                if (clientSubscriptions.has(ws)) {
                    clientSubscriptions.get(ws).lastTimestamps[data.sensor] = data.lastTimestamp
                    await sendSensorData(
                        data.sensor,
                        clientSubscriptions.get(ws).timeRanges[data.sensor],
                        data.lastTimestamp
                    )
                }
            }
            // Handle time range updates
            else if (data.action === 'updateTimeRange' && data.sensor && data.timeRange) {
                if (clientSubscriptions.has(ws)) {
                    clientSubscriptions.get(ws).timeRanges[data.sensor] = data.timeRange
                    
                    // Clear existing interval and set up new one
                    if (intervals.has(data.sensor)) {
                        clearInterval(intervals.get(data.sensor))
                    }
                    
                    await sendSensorData(data.sensor, data.timeRange)
                    
                    intervals.set(data.sensor, setInterval(() => {
                        const lastTimestamp = clientSubscriptions.get(ws)?.lastTimestamps[data.sensor]
                        sendSensorData(data.sensor, data.timeRange, lastTimestamp)
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

// Handle WebSocket upgrade requests
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
// import express from 'express'
// import { WebSocketServer, WebSocket } from 'ws'
// import http from 'http'
// import 'dotenv/config'
// import { querySensorData } from './services.js'
// import url from 'url'

// const SERVER_RESPONSE_INTERVAL = 5 * 1000
// const SENSOR_TIME_RANGE = '15m'

// const app = express()
// const server = http.createServer(app)

// // Define the list of fields you want to track
// const sensors = [
//     'temperature', 'humidity', 'co', 'no2', 'pm10', 'gas', 'emergency',
//     'light-intensity', 'motion-detected', 'vibration', 'noise-level',
//     'water-level', 'population', 'water-flow'
// ]

// // Define default time ranges for specific fields
// const defaultTimeRanges = {
//     'temperature': '5m',
//     'humidity': 'last',
//     'co': '5m',
//     'no2': '5m',
//     'pm10': '5m',
//     'gas': 'last',
//     'emergency': 'last',
//     'light-intensity': 'last',
//     'motion-detected': 'last',
//     'vibration': 'last',
//     'noise-level': '5m',
//     'water-level': '5m',
//     'population': 'last',
//     'water-flow': '5m',
// }

// // Create a WebSocket server for each field
// const wssMap = new Map()
// const lastSentData = new Map()
// const clientDataCache = new Map();

// sensors.forEach(sensor => {
//     const wss = new WebSocketServer({ noServer: true })
//     wssMap.set(sensor, wss)                                                                
//     let timeRange = defaultTimeRanges[sensor] || SENSOR_TIME_RANGE // Use default time range for the field, or 15m if not specified

//     wss.on('connection', (ws) => {
//         console.log(`Client connected to ${sensor} WebSocket`)
//         let interval

//         const sendData = async (lastTimestamp = null) => {
//         try {
//             const data = await querySensorData(sensor, timeRange, lastTimestamp);
//             if (ws.readyState === WebSocket.OPEN) {
//                 if (!lastTimestamp) {
//                     // Send full data for initial connection
//                     ws.send(JSON.stringify({
//                         type: 'fullData',
//                         data: data
//                     }));
//                 } else if (data.length > 0) {
//                     // Send only updates
//                     ws.send(JSON.stringify({
//                         type: 'update',
//                         data: data
//                     }));
//                 }

//             }} catch (error) {
//                 console.error(`Error querying InfluxDB for ${sensor}:`, error)
//                 if (ws.readyState === WebSocket.OPEN) {
//                     ws.send(JSON.stringify({ error: 'Internal server error' }))
//                 }
//             }
//         }

//         ws.on('message', async (message) => {
//             try {
//                 const data = JSON.parse(message)
//                 if (data.timeRange) {
//                     timeRange = data.timeRange
//                     console.log(`Time range updated to: ${timeRange} for ${sensor}`)

//                     clearInterval(interval)
//                     await sendData()
//                     interval = setInterval(() => sendData(clientDataCache.get(ws)), SERVER_RESPONSE_INTERVAL);
//                 } else if (data.lastTimestamp) {
//                     clientDataCache.set(ws, data.lastTimestamp);
//                     await sendData(data.lastTimestamp);
//                 }
//             } catch (error) {
//                 console.error('Error parsing message:', error)
//             }
//         })

//         // Send initial full data
//         sendData();

//         // Set up interval for updates
//         interval = setInterval(() => {
//             const lastTimestamp = clientDataCache.get(ws);
//             sendData(lastTimestamp);
//         }, SERVER_RESPONSE_INTERVAL);

//         ws.on('close', () => {
//             console.log(`Client disconnected from ${sensor} WebSocket`);
//             clearInterval(interval);
//             clientDataCache.delete(ws);
//         });

//         ws.on('error', (error) => {
//             console.error(`WebSocket error for ${sensor}:`, error);
//             clearInterval(interval);
//             clientDataCache.delete(ws);
//         });
//     })
// })

// // Handle WebSocket upgrade requests
// server.on('upgrade', (request, socket, head) => {
//     const { pathname } = url.parse(request.url)
//     const sensor = pathname.substring(1) // Extract field from URL (e.g., /temperature)

//     if (wssMap.has(sensor)) {
//         wssMap.get(sensor).handleUpgrade(request, socket, head, (ws) => {
//         wssMap.get(sensor).emit('connection', ws, request)
//     })
//     } else {
//         socket.destroy()
//     }
// })

// const PORT = 5000
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })
