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

export const writeInfluxDB = () => {
    const now = new Date();
    return [

        // Air Quality Sensors

        new Point('airSensors')
            .tag('sensor_id', 'TLM0100')
            .floatField('co', Math.random() * 100)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_id', 'TLM0103')
            .floatField('pm10', Math.random() * 250)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_id', 'TLM0104')
            .floatField('no2', Math.random() * 300)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_id', 'TLM0101')
            .floatField('temperature', Math.random() * 50 + 20)
            .timestamp(now),
        new Point('airSensors')
            .tag('sensor_id', 'TLM0102')
            .floatField('humidity', Math.random() * 100)
            .timestamp(now),


        // Water Level Sensors
        new Point('h2o_feet')
            .tag('sensor_id', 'TLM0105')
            .floatField('water_level', (6 + Math.random() * 3).toFixed(3)) // Water level field
            .timestamp(now), 

        // Noise Sensors
        new Point('noiseSensors')
        .tag('sensor_id', 'TLM0200')
        .floatField('noise_level', (50 + Math.random() * 40).toFixed(1)) // Noise level in dB
        .timestamp(now),

        // Vibration Sensors
        new Point('vibrationSensors')
        .tag('sensor_id', 'TLM0300')
        .floatField('vibration', Math.random() * 10) // Vibration intensity in m/s²
        .timestamp(now),

        // Motion Detectors
        new Point('motionSensors')
            .tag('sensor_id', 'TLM0400')
            .booleanField('motion_detected', Math.random() > 0.7) // Boolean for motion detection
            .timestamp(now),

        // // Light Intensity Sensors
        new Point('lightSensors')
            .tag('sensor_id', 'TLM0500')
            .floatField('light_intensity', (Math.random() * 1000).toFixed(2)) // Light intensity in lumens
            .timestamp(now),

        // // Gas Leakage Detectors
        new Point('gasLeakage')
            .tag('sensor_id', 'TLM0600')
            .floatField('methane', Math.random() * 50) // Methane levels in ppm
            .floatField('propane', Math.random() * 50) // Propane levels in ppm
            .timestamp(now),

        // Emergency Status
        new Point('emergency')
            .tag('sensor_id', 'TLM0709')
            .floatField('emergency', (Math.random() * 100).toFixed(2)) // Boolean for emergency detection
            .timestamp(now),

        // Visitors
        new Point('visitors')
            .tag('sensor_id', 'TLM0700')
            .intField('lobby-population', Math.floor(40 + Math.random() * 20)) // Visitors fluctuate between 40 and 60
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'StorageArea')
            .intField('storage-population', Math.floor(20 + Math.random() * 15)) // Visitors fluctuate between 20 and 35
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Office')
            .intField('office-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Security')
            .intField('security-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Cafeteria')
            .intField('cafeteria-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Inspection_Zone')
            .intField('inspection-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Automation_Zone')
            .intField('automation-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
            .timestamp(now),
        new Point('visitors')
            .tag('location', 'Maintenance_Room')
            .intField('maintenance-population', Math.floor(60 + Math.random() * 20)) // Visitors fluctuate between 60 and 80
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
export async function querySensorData(field, timeRange) {
    let fluxQuery
    if (timeRange == 'last') {
        fluxQuery = `
            from(bucket: "${bucket}")
                |> range(start: -5s)  // Use a reasonable time range to ensure we get the last value
                |> filter(fn: (r) => r._field == "${field}")
                |> keep(columns: ["_value","_field"])
                |> yield(name: "instant_sensor_data")
        `
    } else {
        fluxQuery = `
        from(bucket: "${bucket}")
            |> range(start: -${timeRange})
            |> filter(fn: (r) => r._field == "${field}")
            |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"])
            |> yield(name: "sensor_data")
        `
    }
    return new Promise((resolve, reject) => {
        const sensorData = []
        queryApi.queryRows(fluxQuery, {
            next: (row, tableMeta) => {
                const o = tableMeta.toObject(row)
                sensorData.push(o)
            },
                error: (error) => {
                    reject(error)
            },
                complete: () => {
                    console.log(sensorData)
                    resolve(sensorData)
            },
        })
    })
}