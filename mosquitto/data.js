export const generateSensorData = () => {
    const now = new Date().toISOString();
    return [
        // Gas
        {
            measurement: 'co',
            sensorType: 'airSensor',
            sensor: 'co',
            co: Math.random() * 100,
            timestamp: now
        },
        {
            measurement: 'pm10',
            sensorType: 'airSensor',
            sensor: 'pm10',
            pm10: Math.random() * 250,
            timestamp: now
        },
        {
            measurement: 'no2',
            sensorType: 'airSensor',
            sensor: 'no2',
            no2: Math.random() * 300,
            timestamp: now
        },
        
        // Temperature
        {
            measurement: 'temperature',
            sensorType: 'temperatureSensor',
            sensor: 'temperature',
            temperature: Math.random() * 50 + 20,
            timestamp: now
        },

        // Noise Sensors
        {
            measurement: 'noise-level',
            sensorType: 'noiseSensor',
            sensor: 'noise-level',
            'noise-level': parseFloat((50 + Math.random() * 40).toFixed(1)),
            timestamp: now
        },
        
        // Vibration Sensors
        {
            measurement: 'vibration',
            sensorType: 'vibrationSensor',
            sensor: 'vibration',
            vibration: Math.random() * 7,
            timestamp: now
        },
        
        // Motion Detectors
        {
            measurement: 'motion_detected',
            sensorType: 'motionSensor',
            sensor: 'motion_detected',
            motion_detected: Math.random() > 0.7,
            timestamp: now
        },
        
        // Light Intensity Sensors
        {
            measurement: 'light-intensity',
            sensorType: 'lightSensor',
            sensor: 'light-intensity',
            'light-intensity': parseFloat((Math.random() * 1000).toFixed(2)),
            timestamp: now
        },
        
        // Gas Leakage Detectors
        {
            measurement: 'gas',
            sensorType: 'gasSensor',
            sensor: 'gas',
            methane: Math.random() * 50,
            propane: Math.random() * 50,
            hydrogen: Math.random() * 50,
            ammonia: Math.random() * 50,
            ozone: Math.random() * 30,
            timestamp: now
        },
        
        // Emergency Status
        {
            measurement: 'emergency',
            sensorType: 'emergencySensor',
            sensor: 'emergency',
            "emergency": parseFloat((Math.random() * 100).toFixed(2)),
            timestamp: now
        },
        
        // Visitors
        {
            measurement: 'population',
            sensorType: 'populationSensor',
            sensor: 'population',
            lobby: Math.floor(40 + Math.random() * 20),
            storage: Math.floor(20 + Math.random() * 15),
            office: Math.floor(60 + Math.random() * 20),
            security: Math.floor(60 + Math.random() * 20),
            cafeteria: Math.floor(60 + Math.random() * 20),
            inspection: Math.floor(60 + Math.random() * 20),
            automation: Math.floor(60 + Math.random() * 20),
            maintenance: Math.floor(60 + Math.random() * 20),
            timestamp: now
        },

        // Humidity
        {
            measurement: 'humidity',
            sensorType: 'humiditySensor',
            sensor: 'humidity',
            lobby: Math.random() * 100,
            storage: Math.random() * 100,
            office: Math.random() * 100,
            security: Math.random() * 100,
            cafeteria: Math.random() * 100,
            inspection: Math.random() * 100,
            automation: Math.random() * 100,
            maintenance: Math.random() * 100,
            timestamp: now
        },

        // Water Flow
        {
            measurement: 'water-flow',
            sensorType: 'waterFlowDetector',
            sensor: 'water-flow',
            'water-flow': Math.random() * 60,
            timestamp: now
        },

        // Water Level
        {
            measurement: 'water-level',
            sensorType: 'waterLevelDetector',
            sensor: 'water-level',
            'water-level': Math.random() * 10,
            timestamp: now
        }
    ];
};