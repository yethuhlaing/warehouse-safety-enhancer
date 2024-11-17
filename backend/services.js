import { Point } from "@influxdata/influxdb-client";

export const writeInfluxDB = () => {
    const now = new Date();
    return [

        // Air Quality Sensors
        // new Point('airSensors')
        //     .tag('sensor_id', 'TLM0100')
        //     .floatField('co', Math.random() * 100)
        //     .timestamp(now),
        new Point('airSensors')
            .tag('sensor_id', 'TLM0101')
            .floatField('temperature', Math.random() * 50 + 20)
            .timestamp(now),
        // new Point('airSensors')
        //     .tag('sensor_id', 'TLM0102')
        //     .floatField('humidity', Math.random() * 100)
        //     .timestamp(now),
        // new Point('airSensors')
        //     .tag('sensor_id', 'TLM0103')
        //     .floatField('pm2_5', Math.random() * 250) // Particulate matter (2.5 μm)
        //     .timestamp(now),
        // new Point('airSensors')
        //     .tag('sensor_id', 'TLM0104')
        //     .floatField('pm10', Math.random() * 300) // Particulate matter (10 μm)
        //     .timestamp(now),

        // // Water Level Sensors
        // new Point('h2o_feet')
        //     .tag('sensor_id', 'TLM0105')
        //     .floatField('water_level', (6 + Math.random() * 3).toFixed(3)) // Water level field
        //     .timestamp(now), 

        // // Noise Sensors
        // new Point('noiseSensors')
        // .tag('sensor_id', 'TLM0200')
        // .floatField('noise_level', (50 + Math.random() * 40).toFixed(1)) // Noise level in dB
        // .timestamp(now),

        // // Vibration Sensors
        // new Point('vibrationSensors')
        // .tag('sensor_id', 'TLM0300')
        // .floatField('vibration', Math.random() * 10) // Vibration intensity in m/s²
        // .timestamp(now),

        // // Motion Detectors
        // new Point('motionSensors')
        //     .tag('sensor_id', 'TLM0400')
        //     .booleanField('motion_detected', Math.random() > 0.7) // Boolean for motion detection
        //     .timestamp(now),

        // // Light Intensity Sensors
        // new Point('lightSensors')
        //     .tag('sensor_id', 'TLM0500')
        //     .floatField('light_intensity', Math.random() * 1000) // Light intensity in lumens
        //     .timestamp(now),

        // // Gas Leakage Detectors
        // new Point('gasLeakage')
        //     .tag('sensor_id', 'TLM0600')
        //     .floatField('methane', Math.random() * 50) // Methane levels in ppm
        //     .floatField('propane', Math.random() * 50) // Propane levels in ppm
        //     .timestamp(now),

        // // Emergency Status
        // new Point('emergencyStatus')
        //     .tag('sensor_id', 'TLM0700')
        //     .booleanField('emergency', Math.random() > 0.95) // Boolean for emergency detection
        //     .timestamp(now),
    ];
};