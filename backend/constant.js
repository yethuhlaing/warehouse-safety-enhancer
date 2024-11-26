import { Point } from "@influxdata/influxdb-client";

const now = new Date();

export const sensorData = [
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

    // // Noise Sensors
    // new Point('noiseSensors')
    //     .tag('sensor_type', 'noiseSensor')
    //     .tag('sensor', 'noise-level')
    //     .floatField('noise-level', (50 + Math.random() * 40).toFixed(1))
    //     .timestamp(now),
    
    // // Vibration Sensors
    // new Point('vibrationSensors')
    //     .tag('sensor_type', 'vibrationSensor')
    //     .tag('sensor', 'vibration')
    //     .floatField('vibration', Math.random() * 7)
    //     .timestamp(now),
    
    // // Motion Detectors
    // new Point('motionSensors')
    //     .tag('sensor_type', 'motionSensor')
    //     .tag('sensor', 'motion_detected')
    //     .booleanField('motion_detected', Math.random() > 0.7)
    //     .timestamp(now),
    
    // // Light Intensity Sensors
    // new Point('lightSensors')
    //     .tag('sensor_type', 'lightSensor')
    //     .tag('sensor', 'light-intensity')
    //     .floatField('light-intensity', (Math.random() * 1000).toFixed(2))
    //     .timestamp(now),
    
    // // Gas Leakage Detectors
    // new Point('gasLeakage')
    //     .tag('sensor_type', 'gasSensor')
    //     .tag('sensor', 'gas')
    //     .floatField('methane', Math.random() * 50)
    //     .floatField('propane', Math.random() * 50)
    //     .floatField('hydrogen', Math.random() * 50)         // Hydrogen concentration
    //     .floatField('ammonia', Math.random() * 50)          // Ammonia concentration
    //     .floatField('ozone', Math.random() * 30)     
    //     .timestamp(now),
    
    // // // Emergency Status
    // new Point('emergency')
    //     .tag('sensor_type', 'emergencySensor')
    //     .tag('sensor', 'emergency')
    //     .floatField('emergency', (Math.random() * 100).toFixed(2))
    //     .timestamp(now),
    
    // // // Visitors
    // new Point('population')
    // .tag('sensor_type', 'populationSensor')
    // .tag('sensor', 'population')
    // .intField('lobby', Math.floor(40 + Math.random() * 20))         // Lobby population
    // .intField('storage', Math.floor(20 + Math.random() * 15))       // Storage population
    // .intField('office', Math.floor(60 + Math.random() * 20))        // Office population
    // .intField('security', Math.floor(60 + Math.random() * 20))      // Security population
    // .intField('cafeteria', Math.floor(60 + Math.random() * 20))     // Cafeteria population
    // .intField('inspection', Math.floor(60 + Math.random() * 20))    // Inspection population
    // .intField('automation', Math.floor(60 + Math.random() * 20))    // Automation population
    // .intField('maintenance', Math.floor(60 + Math.random() * 20))   // Maintenance population
    // .timestamp(now),

    // // humidity
    // new Point('airSensors')
    // .tag('sensor_type', 'airSensor')
    // .tag('sensor', 'humidity')
    // .floatField('lobby',  Math.random() * 100)         // Lobby humidity
    // .floatField('storage',  Math.random() * 100)       // Storage humidity
    // .floatField('office',  Math.random() * 100)        // Office humidity
    // .floatField('security',  Math.random() * 100)      // Security humidity
    // .floatField('cafeteria',  Math.random() * 100)     // Cafeteria humidity
    // .floatField('inspection',  Math.random() * 100)    // Inspection humidity
    // .floatField('automation',  Math.random() * 100)    // Automation humidity
    // .floatField('maintenance',  Math.random() * 100)   // Maintenance humidity
    // .timestamp(now),

    // // Water Flow
    // new Point('water-flow')
    // .tag('sensor_type', 'water-flow_detector')
    // .tag('sensor', 'water-flow')
    // .tag('location', 'reservoir')
    // .floatField('water-flow', Math.random() * 60) // Flow rate in liters per minute
    // .timestamp(now),

    // // Water Level
    // new Point('waterLevel')
    // .tag('sensor_type', 'water-level_detector')
    // .tag('sensor', 'water-level')
    // .tag('location', 'reservoir')
    // .floatField('water-level', Math.random() * 10) // Water level in meters
    // .timestamp(now),
];