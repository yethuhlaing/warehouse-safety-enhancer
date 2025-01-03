import { InfluxDB, Point } from "@influxdata/influxdb-client";

const QUERY_DURATION = "1d"

const token = process.env.INFLUXDB_TOKEN
const influx_url = process.env.INFLUXDB_URL
const org = process.env.INFLUXDB_ORG
const bucket = process.env.INFLUXDB_BUCKET

const influxDB = new InfluxDB(
    { 
        url: influx_url, 
        token ,
        transportOptions: {
            gzipThreshold: 1, // Compress all requests
        },
    })
const queryApi = influxDB.getQueryApi(org)

export const generateSensorData = () => {
    const now = new Date();
    return [
        // Gas
        new Point('airSensors')
            .tag('sensor_type', 'airSensor')
            .tag('sensor', 'co')
            .floatField('co', Math.random() * 100)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_type', 'airSensor')
            .tag('sensor', 'pm10')
            .floatField('pm10', Math.random() * 250)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_type', 'airSensor')
            .tag('sensor', 'no2')
            .floatField('no2', Math.random() * 300)
            .timestamp(now),
        
        // Temperature
        new Point('airSensors')
            .tag('sensor_type', 'airSensor')
            .tag('sensor', 'temperature')
            .floatField('temperature', Math.random() * 50 + 20)
            .timestamp(now),

        
        // Noise Sensors
        new Point('noiseSensors')
            .tag('sensor_type', 'noiseSensor')
            .tag('sensor', 'noise-level')
            .floatField('noise-level', (50 + Math.random() * 40).toFixed(1))
            .timestamp(now),
        
        // Vibration Sensors
        new Point('vibrationSensors')
            .tag('sensor_type', 'vibrationSensor')
            .tag('sensor', 'vibration')
            .floatField('vibration', Math.random() * 7)
            .timestamp(now),
        
        // Motion Detectors
        new Point('motionSensors')
            .tag('sensor_type', 'motionSensor')
            .tag('sensor', 'motion_detected')
            .booleanField('motion_detected', Math.random() > 0.7)
            .timestamp(now),
        
        // Light Intensity Sensors
        new Point('lightSensors')
            .tag('sensor_type', 'lightSensor')
            .tag('sensor', 'light-intensity')
            .floatField('light-intensity', (Math.random() * 1000).toFixed(2))
            .timestamp(now),
        
        // Gas Leakage Detectors
        new Point('gasLeakage')
            .tag('sensor_type', 'gasSensor')
            .tag('sensor', 'gas')
            .floatField('methane', Math.random() * 50)
            .floatField('propane', Math.random() * 50)
            .floatField('hydrogen', Math.random() * 50)         // Hydrogen concentration
            .floatField('ammonia', Math.random() * 50)          // Ammonia concentration
            .floatField('ozone', Math.random() * 30)     
            .timestamp(now),
        
        // // Emergency Status
        new Point('emergency')
            .tag('sensor_type', 'emergencySensor')
            .tag('sensor', 'emergency')
            .floatField('emergency', (Math.random() * 100).toFixed(2))
            .timestamp(now),
        
        // // Visitors
        new Point('population')
        .tag('sensor_type', 'populationSensor')
        .tag('sensor', 'population')
        .intField('lobby', Math.floor(40 + Math.random() * 20))         // Lobby population
        .intField('storage', Math.floor(20 + Math.random() * 15))       // Storage population
        .intField('office', Math.floor(60 + Math.random() * 20))        // Office population
        .intField('security', Math.floor(60 + Math.random() * 20))      // Security population
        .intField('cafeteria', Math.floor(60 + Math.random() * 20))     // Cafeteria population
        .intField('inspection', Math.floor(60 + Math.random() * 20))    // Inspection population
        .intField('automation', Math.floor(60 + Math.random() * 20))    // Automation population
        .intField('maintenance', Math.floor(60 + Math.random() * 20))   // Maintenance population
        .timestamp(now),

        // humidity
        new Point('airSensors')
        .tag('sensor_type', 'airSensor')
        .tag('sensor', 'humidity')
        .floatField('lobby',  Math.random() * 100)         // Lobby humidity
        .floatField('storage',  Math.random() * 100)       // Storage humidity
        .floatField('office',  Math.random() * 100)        // Office humidity
        .floatField('security',  Math.random() * 100)      // Security humidity
        .floatField('cafeteria',  Math.random() * 100)     // Cafeteria humidity
        .floatField('inspection',  Math.random() * 100)    // Inspection humidity
        .floatField('automation',  Math.random() * 100)    // Automation humidity
        .floatField('maintenance',  Math.random() * 100)   // Maintenance humidity
        .timestamp(now),

        // Water Flow
        new Point('water-flow')
        .tag('sensor_type', 'water-flow_detector')
        .tag('sensor', 'water-flow')
        .tag('location', 'reservoir')
        .floatField('water-flow', Math.random() * 60) // Flow rate in liters per minute
        .timestamp(now),

        // Water Level
        new Point('waterLevel')
        .tag('sensor_type', 'water-level_detector')
        .tag('sensor', 'water-level')
        .tag('location', 'reservoir')
        .floatField('water-level', Math.random() * 10) // Water level in meters
        .timestamp(now),
    ];
};

export async function queryAggregateValue() {
    const fluxQuery = `
        from(bucket: "${bucket}")
        |> range(start: -${timeRange})
        |> filter(fn: (r) => r._field == "${field}")
        |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
        |> aggregateWindow(every: ${QUERY_DURATION}, fn: mean)
        |> yield(name: "mean")
        
    from(bucket: "${bucket}")
        |> range(start: -${timeRange})
        |> filter(fn: (r) => r._field == "${field}")
        |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
        |> aggregateWindow(every: ${QUERY_DURATION}, fn: min)
        |> yield(name: "min") 

    from(bucket: "${bucket}")
        |> range(start: -${timeRange})
        |> filter(fn: (r) => r._field == "${field}")
        |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
        |> aggregateWindow(every: ${QUERY_DURATION}, fn: max)
        |> yield(name: "max") 
    `
    return new Promise((resolve, reject) => {
        const rawData = []
        queryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
            const o = tableMeta.toObject(row)
            if (o.result === "mean") {
                meanData.push({ _field: o._field, _value: o._value, _time: o._time })
            } else if (o.result === "max") {
                maxData.push({ _field: o._field, _value: o._value, _time: o._time })
            } else if (o.result === "min") {
                minData.push({ _field: o._field, _value: o._value, _time: o._time })
            }
        },
            error: (error) => {
                reject(error)
        },
            complete: () => {
                resolve({ meanData, minData, maxData })
        },
        })
    })
}
export async function querySensorData(sensor, timeRange, lastTimestamp = null) {
    let fluxQuery;
    
    if (timeRange === 'last') {
        fluxQuery = `
            from(bucket: "${bucket}")
                |> range(start: -5s) 
                |> filter(fn: (r) => r._field == "${sensor}")
                |> keep(columns: ["_value","_field"])
                |> last()
        `;
    } else {
        const start = lastTimestamp ? lastTimestamp : `-${timeRange}`;
        fluxQuery = `
            from(bucket: "${bucket}")
                |> range(start: ${start})
                |> filter(fn: (r) => r._field == "${sensor}")
                |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
                // Add aggregation if querying large time ranges
                ${timeRange > '1h' ? '|> aggregateWindow(every: 5s, fn: mean)' : ''}
        `;
    }
    return new Promise((resolve, reject) => {
        let sensorData = []
        queryApi.queryRows(fluxQuery, {
            next: (row, tableMeta) => {
                const o = tableMeta.toObject(row)
                sensorData.push(o)
            },
            error: (error) => {
                reject(error)
            },
            complete: () => {
                resolve(sensorData)
            },
        })
    })
}