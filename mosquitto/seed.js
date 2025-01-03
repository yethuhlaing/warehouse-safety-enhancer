import mqtt from 'mqtt'
import { generateSensorData } from './data.js'

const mqtt_url = process.env.MOSQUITTO_BROKER_URL || 'tcp://localhost:1883'
const mqtt_username = process.env.MOSQUITTO_USERNAME
const mqtt_password = process.env.MOSQUITTO_PASSWORD

// Constants for configuration
const PUBLISH_INTERVAL = 5 * 1000 // 5 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const BATCH_SIZE = 100 // Number of messages to publish in one batch

class MQTTPublisher {
    constructor() {
        this.client = mqtt.connect(mqtt_url, {
            username: mqtt_username,
            password: mqtt_password
        })

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker')
        })

        this.client.on('error', (error) => {
            console.error('MQTT client error:', error)
        })

        this.isRunning = false
        this.publishCount = 0
        this.errorCount = 0
        this.lastPublish = null
        this.publishInterval = null
    }

    async publishDataWithRetry(retryCount = 0) {
        try {
            const sensorData = generateSensorData()
            
            // Add timestamp if not present
            sensorData.forEach(data => {
                if (!data.timestamp) {
                    data.timestamp = new Date().toISOString()
                }
            })

            const publishPromises = sensorData.map(data => {
                return new Promise((resolve, reject) => {
                    this.client.publish(`sensors/${data.sensor}`, JSON.stringify(data), (err) => {
                        if (err) reject(err)
                        else resolve()
                    })
                })
            })

            await Promise.all(publishPromises)
            
            this.publishCount += sensorData.length
            this.lastPublish = new Date()
            
            console.log(`Successfully published ${sensorData.length} messages to MQTT at ${this.lastPublish.toISOString()}`)
            console.log(`Total publishes: ${this.publishCount}, Total errors: ${this.errorCount}`)
            
            return true
        } catch (error) {
            this.errorCount++
            console.error(`Error publishing to MQTT (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message)
            
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`)
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
                return this.publishDataWithRetry(retryCount + 1)
            } else {
                console.error('Max retries reached, skipping this batch')
                return false
            }
        }
    }

    async start() {
        if (this.isRunning) {
            console.warn('Publisher is already running')
            return
        }

        this.isRunning = true
        console.log('Starting MQTT publisher...')

        const scheduleNextPublish = async () => {
            if (!this.isRunning) return
            
            await this.publishDataWithRetry()
            
            // Schedule next publish using setTimeout
            this.publishInterval = setTimeout(scheduleNextPublish, PUBLISH_INTERVAL)
        }

        // Start the first publish
        scheduleNextPublish()
    }

    async stop() {
        console.log('Stopping MQTT publisher...')
        this.isRunning = false
        
        if (this.publishInterval) {
            clearTimeout(this.publishInterval)
            this.publishInterval = null
        }

        try {
            await new Promise((resolve, reject) => {
                this.client.end(false, {}, (err) => {
                    if (err) reject(err)
                    else resolve()
                })
            })
            console.log('Successfully closed MQTT connection')
            
            // Log final statistics
            console.log(`Final statistics:`)
            console.log(`- Total successful publishes: ${this.publishCount}`)
            console.log(`- Total errors: ${this.errorCount}`)
            console.log(`- Last successful publish: ${this.lastPublish ? this.lastPublish.toISOString() : 'never'}`)
        } catch (error) {
            console.error('Error while closing MQTT connection:', error)
            throw error
        }
    }

    getStats() {
        return {
            publishCount: this.publishCount,
            errorCount: this.errorCount,
            lastPublish: this.lastPublish,
            isRunning: this.isRunning
        }
    }
}

// Create publisher instance
const publisher = new MQTTPublisher()

// Handle process termination
async function handleShutdown(signal) {
    console.log(`Received ${signal} signal`)
    try {
        await publisher.stop()
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

// Start the publisher
publisher.start().catch(error => {
    console.error('Failed to start publisher:', error)
    process.exit(1)
})

console.log('MQTT publisher started. Press Ctrl+C to stop.')