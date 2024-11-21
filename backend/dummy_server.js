import { InfluxDB, Point } from '@influxdata/influxdb-client'
import 'dotenv/config'
import { writeInfluxDB } from './services.js'

const token = process.env.INFLUXDB_TOKEN
const influx_url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG
const bucket = process.env.INFLUXDB_BUCKET

const influxDB = new InfluxDB({ 
    url: influx_url, 
    token,   
    transportOptions: {
        gzipThreshold: 1, // Compress all requests
    }, })
const writeApi = influxDB.getWriteApi(org, bucket)

const WRITE_INTERVAL = 5 * 1000 // 5 seconds

function writeData() {
    const points = writeInfluxDB()
    points.forEach(point => writeApi.writePoint(point))
    console.log(`Wrote ${points} points to InfluxDB at ${new Date().toISOString()}`)
}

const writeInterval = setInterval(writeData, WRITE_INTERVAL)

process.on('SIGINT', () => {
    clearInterval(writeInterval)
    writeApi.close().then(() => {
        console.log('InfluxDB write API closed')
        process.exit(0)
    })
})

console.log('Dummy InfluxDB writer started. Press Ctrl+C to stop.')