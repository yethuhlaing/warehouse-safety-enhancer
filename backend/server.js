import express from 'express'
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http'
import { InfluxDB  } from '@influxdata/influxdb-client';
import 'dotenv/config';
import { writeInfluxDB } from './services.js';
import url from 'url'

const SEVER_RESPONSE_INTERVAL =  5 * 1000;
const SERVER_DATA_WRITING_INTERVAL = 5000
const QUERY_STARTING_TIME = "30m"

const app = express()
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const token = process.env.INFLUXDB_TOKEN;
const influx_url = process.env.INFLUXDB_URL;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;

const influxDB = new InfluxDB({ url: influx_url, token });
const queryApi = influxDB.getQueryApi(org);
const writeApi = influxDB.getWriteApi(org, bucket);


// Define the list of fields you want to track
const fields = [
    'temperature', 'humidity', 'co', 'propane', 'methane', 'emergency', 
    'light_intensity', 'motion_detected', 'vibration', 'noise_level', 
    'water_level', 'pm10', 'pm2_5'
];

async function queryInfluxDB(field) {

    const fluxQuery = `
        from(bucket:"${bucket}")
            |> range(start: - ${QUERY_STARTING_TIME})
            |> filter(fn: (r) => r._field == "${field}")
            |> yield(name: "max")
        `;

    return new Promise((resolve, reject) => {
        const data = [];
        queryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            data.push({
                // result: o.result,              
                // _start: o._start,               
                // _stop: o._stop,                 
                _time: o._time,              
                _value: o._value,              
                _field: o._field,         
                _measurement: o._measurement,        
                sensor_id: o.sensor_id
            });
            // console.log(
            //     `${o._time} ${o._measurement} in '${o.location}' (${o.sensor_id}): ${o._field}=${o._value}`
            // )
        },
        error: (error) => {
            reject(error);
        },
        complete: () => {
            resolve(data);
        },
        });
    });
}

wss.on('connection', (ws, req) => {
    console.log('Client connected');


    const { pathname } = url.parse(req.url);
    const dataType = pathname.substring(1); // Extract data type from URL (e.g., /temperature)

    if (!fields.includes(dataType)) {
        ws.close(1008, 'Invalid data type');
        return;
    }

    const sendData = async () => {
        try {
            const data = await queryInfluxDB(dataType);
            if (ws.readyState === WebSocket.OPEN) {

                // Send the data in chunks (for large data sets)
                // const chunkSize = 1000; // Split data into chunks of 1000 items
                // let i = 0;
                // while (i < data.length) {
                //     const chunk = data.slice(i, i + chunkSize);
                //     ws.send(JSON.stringify(chunk)); // Send chunk to client
                //     i += chunkSize;
                //     await new Promise(resolve => setTimeout(resolve, 100)); // Optional delay between chunks
                // }
                ws.send(JSON.stringify(data));
            }
        } catch (error) {
            console.error(`Error querying InfluxDB for ${dataType}:`, error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ error: 'Internal server error' }));
            }
        }
    };

    // Send initial data
    sendData();

    const interval = setInterval(() => sendData(dataType), SEVER_RESPONSE_INTERVAL);

    const writeInterval = setInterval(() => {
        const points = writeInfluxDB();
        points.forEach(point => writeApi.writePoint(point));
        // console.log('Data written to InfluxDB:', points);
      }, SERVER_DATA_WRITING_INTERVAL);

      
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
        clearInterval(writeInterval)
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});