import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import { InfluxDB } from '@influxdata/influxdb-client'
import 'dotenv/config'
import { queryInfluxDB, writeInfluxDB } from './services.js'
import url from 'url'

const SERVER_RESPONSE_INTERVAL = 5 * 1000

const app = express()
const server = http.createServer(app)

// Define the list of fields you want to track
const fields = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'propane', 'methane', 'emergency',
    'light_intensity', 'motion_detected', 'vibration', 'noise_level',
    'water_level', 
]

// Create a WebSocket server for each field
const wssMap = new Map()

fields.forEach(field => {
    const wss = new WebSocketServer({ noServer: true })
    wssMap.set(field, wss)
    let timeRange = '15m' // Default time range

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${field} WebSocket`)
        let interval


        const sendData = async () => {
        try {
            const data = await queryInfluxDB(field, timeRange)
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

// import express from 'express'
// import { WebSocketServer, WebSocket } from 'ws';
// import http from 'http'
// import { InfluxDB  } from '@influxdata/influxdb-client';
// import 'dotenv/config';
// import { writeInfluxDB } from './services.js';
// import url from 'url'

// const SEVER_RESPONSE_INTERVAL =  5 * 1000;
// const SERVER_DATA_WRITING_INTERVAL = 5000
// const QUERY_DURATION = "1d"

// const app = express()
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// const token = process.env.INFLUXDB_TOKEN;
// const influx_url = process.env.INFLUXDB_URL;
// const org = process.env.INFLUXDB_ORG;
// const bucket = process.env.INFLUXDB_BUCKET;

// const influxDB = new InfluxDB({ url: influx_url, token });
// const queryApi = influxDB.getQueryApi(org);
// const writeApi = influxDB.getWriteApi(org, bucket);


// // Define the list of fields you want to track
// const fields = [
//     'temperature', 'humidity', 'co', 'propane', 'methane', 'emergency', 
//     'light_intensity', 'motion_detected', 'vibration', 'noise_level', 
//     'water_level', 'pm10', 'pm2_5'
// ];

// async function queryInfluxDB(field, timeRange) {

//     const fluxQuery = `
//         from(bucket: "${bucket}")
//             |> range(start: -${timeRange})
//             |> filter(fn: (r) => r._field == "${field}")
//             |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
//             |> aggregateWindow(every: ${QUERY_DURATION}, fn: mean)
//             |> yield(name: "mean")
        
//         from(bucket: "${bucket}")
//             |> range(start: -${timeRange})
//             |> filter(fn: (r) => r._field == "${field}")
//             |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
//             |> aggregateWindow(every: ${QUERY_DURATION}, fn: min)
//             |> yield(name: "min") 

//         from(bucket: "${bucket}")
//             |> range(start: -${timeRange})
//             |> filter(fn: (r) => r._field == "${field}")
//             |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
//             |> aggregateWindow(every: ${QUERY_DURATION}, fn: max)
//             |> yield(name: "max") 

//         from(bucket: "${bucket}")
//             |> range(start: -${timeRange})
//             |> filter(fn: (r) => r._field == "${field}")
//             |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
//             |> yield(name: "raw_data") // Raw data array
//     `;
//     return new Promise((resolve, reject) => {
//         const meanData = [];
//         const minData = [];
//         const maxData = [];
//         const rawData = [];
//         queryApi.queryRows(fluxQuery, {
//         next: (row, tableMeta) => {
//             const o = tableMeta.toObject(row);
//             if (o.result === "mean") {
//                 meanData.push({
//                     _field: o._field,         
//                     _value: o._value,
//                     _time: o._time,
//                 });
//             } else if(o.result === "max"){
//                 maxData.push({
//                     _field: o._field,         
//                     _value: o._value,
//                     _time: o._time,
//                 });
//             } else if(o.result === "min"){
//                 minData.push({
//                     _field: o._field,         
//                     _value: o._value,
//                     _time: o._time,
//                 });
//             } else if (o.result === "raw_data") {
//                 rawData.push({
//                     _time: o._time,              
//                     _value: o._value,              
//                     _field: o._field,         
//                     _measurement: o._measurement,        
//                     sensor_id: o.sensor_id
//                 });
//             }
//             // console.log(
//             //     `${o._time} ${o._measurement} in '${o.location}' (${o.sensor_id}): ${o._field}=${o._value}`
//             // )
//         },
//         error: (error) => {
//             reject(error);
//         },
//         complete: () => {
//             resolve({ meanData, rawData, minData, maxData });
//         },
//         });
//     });
// }

// wss.on('connection', (ws, req) => {
//     console.log('Client connected');

//     let timeRange = '1h'; // Default time range

//     const { pathname } = url.parse(req.url);
//     const dataType = pathname.substring(1); // Extract data type from URL (e.g., /temperature)

//     if (!fields.includes(dataType)) {
//         ws.close(1008, 'Invalid data type');
//         return;
//     }

//     const sendData = async () => {
//         try {
//             const data = await queryInfluxDB(dataType, timeRange);
//             if (ws.readyState === WebSocket.OPEN) {

//                 // Send the data in chunks (for large data sets)
//                 // const chunkSize = 1000; // Split data into chunks of 1000 items
//                 // let i = 0;
//                 // while (i < data.length) {
//                 //     const chunk = data.slice(i, i + chunkSize);
//                 //     ws.send(JSON.stringify(chunk)); // Send chunk to client
//                 //     i += chunkSize;
//                 //     await new Promise(resolve => setTimeout(resolve, 100)); // Optional delay between chunks
//                 // }
//                 ws.send(JSON.stringify(data));
//             }
//         } catch (error) {
//             console.error(`Error querying InfluxDB for ${dataType}:`, error);
//             if (ws.readyState === WebSocket.OPEN) {
//                 ws.send(JSON.stringify({ error: 'Internal server error' }));
//             }
//         }
//     };

//     // Send initial data
//     sendData();

//     const interval = setInterval(() => sendData(dataType), SEVER_RESPONSE_INTERVAL);

//     const writeInterval = setInterval(() => {
//         const points = writeInfluxDB();
//         points.forEach(point => writeApi.writePoint(point));
//         // console.log('Data written to InfluxDB:', points);
//       }, SERVER_DATA_WRITING_INTERVAL);

      
//     ws.on('message', (message) => {
//         try {
//             const data = JSON.parse(message);
//             if (data.timeRange) {
//                 timeRange = data.timeRange;
//                 console.log(`Time range updated to: ${timeRange}`);
                
//                 clearInterval(interval);
//                 sendData(); 
//                 interval = setInterval(() => sendData(dataType), SEVER_RESPONSE_INTERVAL);
//             }
//         } catch (error) {
//             console.error('Error parsing message:', error);
//         }    
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//         clearInterval(interval);
//         clearInterval(writeInterval)
//     });
//     ws.on('error', (error) => {
//         console.error('WebSocket error:', error);
//         clearInterval(interval);
//       });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });