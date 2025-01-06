export const generateSensorData = () => {
    const now = new Date().toISOString();
    return [
        // Gas
        {
            measurement: 'co',
            tags: {
                sensor_type: 'airSensor',
                sensor: 'co'
            },
            fields: {
                co: Math.random() * 100
            },
            timestamp: now
        },
        {
            measurement: 'pm10',
            tags: {
                sensor_type: 'airSensor',
                sensor: 'pm10'
            },
            fields: {
                pm10: Math.random() * 250
            },
            timestamp: now
        },
        {
            measurement: 'no2',
            tags: {
                sensor_type: 'airSensor',
                sensor: 'no2'
            },
            fields: {
                no2: Math.random() * 300
            },
            timestamp: now
        },
        
        // Temperature
        {
            measurement: 'temperature',
            tags: {
                sensor_type: 'temperatureSensor',
                sensor: 'temperature'
            },
            fields: {
                temperature: Math.random() * 50 + 20
            },
            timestamp: now
        },

        // Noise Sensors
        {
            measurement: 'noise-level',
            tags: {
                sensor_type: 'noiseSensor',
                sensor: 'noise-level'
            },
            fields: {
                'noise-level': parseFloat((50 + Math.random() * 40).toFixed(1))
            },
            timestamp: now
        },
        
        // Vibration Sensors
        {
            measurement: 'vibration',
            tags: {
                sensor_type: 'vibrationSensor',
                sensor: 'vibration'
            },
            fields: {
                vibration: Math.random() * 7
            },
            timestamp: now
        },
        
        // Motion Detectors
        {
            measurement: 'motion_detected',
            tags: {
                sensor_type: 'motionSensor',
                sensor: 'motion_detected'
            },
            fields: {
                motion_detected: Math.random() > 0.7
            },
            timestamp: now
        },
        
        // Light Intensity Sensors
        {
            measurement: 'light-intensity',
            tags: {
                sensor_type: 'lightSensor',
                sensor: 'light-intensity'
            },
            fields: {
                'light-intensity': parseFloat((Math.random() * 1000).toFixed(2))
            },
            timestamp: now
        },
        
        // Gas Leakage Detectors
        {
            measurement: 'gas',
            tags: {
                sensor_type: 'gasSensor',
                sensor: 'gas'
            },
            fields: {
                methane: Math.random() * 50,
                propane: Math.random() * 50,
                hydrogen: Math.random() * 50,
                ammonia: Math.random() * 50,
                ozone: Math.random() * 30
            },
            timestamp: now
        },
        
        // Emergency Status
        {
            measurement: 'emergency',
            tags: {
                sensor_type: 'emergencySensor',
                sensor: 'emergency'
            },
            fields: {
                emergency: parseFloat((Math.random() * 100).toFixed(2))
            },
            timestamp: now
        },
        
        // Visitors
        {
            measurement: 'population',
            tags: {
                sensor_type: 'populationSensor',
                sensor: 'population'
            },
            fields: {
                lobby: Math.floor(40 + Math.random() * 20),
                storage: Math.floor(20 + Math.random() * 15),
                office: Math.floor(60 + Math.random() * 20),
                security: Math.floor(60 + Math.random() * 20),
                cafeteria: Math.floor(60 + Math.random() * 20),
                inspection: Math.floor(60 + Math.random() * 20),
                automation: Math.floor(60 + Math.random() * 20),
                maintenance: Math.floor(60 + Math.random() * 20)
            },
            timestamp: now
        },

        // Humidity
        {
            measurement: 'humidity',
            tags: {
                sensor_type: 'humiditySensor',
                sensor: 'humidity'
            },
            fields: {
                lobby: Math.random() * 100,
                storage: Math.random() * 100,
                office: Math.random() * 100,
                security: Math.random() * 100,
                cafeteria: Math.random() * 100,
                inspection: Math.random() * 100,
                automation: Math.random() * 100,
                maintenance: Math.random() * 100
            },
            timestamp: now
        },

        // Water Flow
        {
            measurement: 'water-flow',
            tags: {
                sensor_type: 'waterFlowDetector',
                sensor: 'water-flow'
            },
            fields: {
                'water-flow': Math.random() * 60
            },
            timestamp: now
        },

        // Water Level
        {
            measurement: 'water-level',
            tags: {
                sensor_type: 'waterLevelDetector',
                sensor: 'water-level'
            },
            fields: {
                'water-level': Math.random() * 10
            },
            timestamp: now
        }
    ];
};