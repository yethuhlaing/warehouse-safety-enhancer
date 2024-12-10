import { InfluxDB, Point } from '@influxdata/influxdb-client'
import 'dotenv/config'
import { generateSensorData } from './services.js'

const token = process.env.INFLUXDB_TOKEN
const influx_url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG
const bucket = process.env.INFLUXDB_BUCKET

// Constants for configuration
const WRITE_INTERVAL = 5 * 1000 // 5 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const BATCH_SIZE = 100 // Number of points to write in one batch

class InfluxWriter {
    constructor() {
        this.influxDB = new InfluxDB({ 
            url: influx_url, 
            token,   
            transportOptions: {
                gzipThreshold: 1,
            },
            debug: process.env.NODE_ENV === 'development'
        })
        
        this.writeApi = this.influxDB.getWriteApi(org, bucket, 'ms', {
            defaultTags: { host: process.env.HOST_NAME || 'unknown' },
            batchSize: BATCH_SIZE,
            flushInterval: WRITE_INTERVAL,
            maxRetries: MAX_RETRIES,
            retryJitter: 200,
            maxRetryDelay: 5000,
            minRetryDelay: 1000,
        })

        this.isRunning = false
        this.writeCount = 0
        this.errorCount = 0
        this.lastWrite = null
        this.writeInterval = null
    }

    async writeDataWithRetry(retryCount = 0) {
        try {
            const points = generateSensorData()
            
            // Add timestamp if not present
            points.forEach(point => {
                if (!point._time) {
                    point.timestamp(new Date())
                }
            })

            await this.writeApi.writePoints(points)
            await this.writeApi.flush()
            
            this.writeCount++
            this.lastWrite = new Date()
            
            console.log(`Successfully wrote ${points.length} points to InfluxDB at ${this.lastWrite.toISOString()}`)
            console.log(`Total writes: ${this.writeCount}, Total errors: ${this.errorCount}`)
            
            return true
        } catch (error) {
            this.errorCount++
            console.error(`Error writing to InfluxDB (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message)
            
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`)
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
                return this.writeDataWithRetry(retryCount + 1)
            } else {
                console.error('Max retries reached, skipping this batch')
                return false
            }
        }
    }

    async start() {
        if (this.isRunning) {
            console.warn('Writer is already running')
            return
        }

        this.isRunning = true
        console.log('Starting InfluxDB writer...')

        const scheduleNextWrite = async () => {
            if (!this.isRunning) return
            
            await this.writeDataWithRetry()
            
            // Schedule next write using setTimeout
            this.writeInterval = setTimeout(scheduleNextWrite, WRITE_INTERVAL)
        }

        // Start the first write
        scheduleNextWrite()
    }

    async stop() {
        console.log('Stopping InfluxDB writer...')
        this.isRunning = false
        
        if (this.writeInterval) {
            clearTimeout(this.writeInterval)
            this.writeInterval = null
        }

        try {
            await this.writeApi.flush()
            await this.writeApi.close()
            console.log('Successfully closed InfluxDB connection')
            
            // Log final statistics
            console.log(`Final statistics:`)
            console.log(`- Total successful writes: ${this.writeCount}`)
            console.log(`- Total errors: ${this.errorCount}`)
            console.log(`- Last successful write: ${this.lastWrite ? this.lastWrite.toISOString() : 'never'}`)
        } catch (error) {
            console.error('Error while closing InfluxDB connection:', error)
            throw error
        }
    }

    getStats() {
        return {
            writeCount: this.writeCount,
            errorCount: this.errorCount,
            lastWrite: this.lastWrite,
            isRunning: this.isRunning
        }
    }
}

// Create writer instance
const writer = new InfluxWriter()

// Handle process termination
async function handleShutdown(signal) {
    console.log(`Received ${signal} signal`)
    try {
        await writer.stop()
        console.log('Graceful shutdown completed')
        process.exit(0)
    } catch (error) {
        console.error('Error during shutdown:', error)
        process.exit(1)
    }
}

// Register shutdown handlers
process.on('SIGINT', () => handleShutdown('SIGINT'))
process.on('SIGTERM', () => handleShutdown('SIGTERM'))
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)
    handleShutdown('uncaughtException')
})
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason)
    handleShutdown('unhandledRejection')
})

// Start the writer
writer.start().catch(error => {
    console.error('Failed to start writer:', error)
    process.exit(1)
})

console.log('Dummy InfluxDB writer started. Press Ctrl+C to stop.')