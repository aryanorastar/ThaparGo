import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

// Mock IoT sensor data (for development and fallback)
export const MOCK_IOT_DATA = [
  {
    id: 'temp-001',
    name: 'Temperature Sensor 1',
    type: 'temperature',
    status: 'active',
    lastReading: '24.5°C',
    battery: 85,
    coordinates: [30.3525, 76.3685], // Near Main Building
    building: 1
  },
  {
    id: 'temp-002',
    name: 'Temperature Sensor 2',
    type: 'temperature',
    status: 'active',
    lastReading: '22.8°C',
    battery: 92,
    coordinates: [30.3535, 76.3705], // Near Science Block
    building: 4
  },
  {
    id: 'hum-001',
    name: 'Humidity Sensor 1',
    type: 'humidity',
    status: 'active',
    lastReading: '65%',
    battery: 78,
    coordinates: [30.3515, 76.3675], // Near Student Center
    building: 3
  },
  {
    id: 'motion-001',
    name: 'Motion Detector 1',
    type: 'motion',
    status: 'active',
    lastReading: 'Movement detected',
    battery: 90,
    coordinates: [30.3505, 76.3665], // Near Hostel A
    building: 5
  },
  {
    id: 'light-001',
    name: 'Light Sensor 1',
    type: 'light',
    status: 'inactive',
    lastReading: '250 lux',
    battery: 45,
    coordinates: [30.3545, 76.3715], // Near Sports Complex
    building: 6
  }
];

// MQTT topics to subscribe to
const TOPICS = [
  'campus/sensors/temperature',
  'campus/sensors/humidity',
  'campus/sensors/motion',
  'campus/sensors/light'
];

// MQTT broker URL (replace with your actual MQTT broker in production)
const MQTT_BROKER_URL = 'wss://test.mosquitto.org:8081';

// Custom hook to handle IoT data
export const useIoTData = () => {
  const [iotData, setIotData] = useState(MOCK_IOT_DATA);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let client;
    
    try {
      // Connect to MQTT broker
      client = mqtt.connect(MQTT_BROKER_URL);
      
      // Handle connection events
      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        setConnected(true);
        
        // Subscribe to topics
        TOPICS.forEach(topic => {
          client.subscribe(topic, (err) => {
            if (err) {
              console.error(`Error subscribing to ${topic}:`, err);
            } else {
              console.log(`Subscribed to ${topic}`);
            }
          });
        });
      });
      
      // Handle messages
      client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          console.log(`Received message on ${topic}:`, payload);
          
          // Update sensor data
          setIotData(prevData => {
            // Find the sensor by ID
            const index = prevData.findIndex(sensor => sensor.id === payload.id);
            
            if (index !== -1) {
              // Update existing sensor
              const updatedData = [...prevData];
              updatedData[index] = {
                ...updatedData[index],
                ...payload
              };
              return updatedData;
            } else {
              // Add new sensor
              return [...prevData, payload];
            }
          });
        } catch (err) {
          console.error('Error processing message:', err);
        }
      });
      
      // Handle errors
      client.on('error', (err) => {
        console.error('MQTT connection error:', err);
        setError(err.message);
        setConnected(false);
      });
      
      // Handle disconnection
      client.on('close', () => {
        console.log('Disconnected from MQTT broker');
        setConnected(false);
      });
    } catch (err) {
      console.error('Failed to connect to MQTT broker:', err);
      setError(err.message);
    }
    
    // Cleanup on unmount
    return () => {
      if (client) {
        TOPICS.forEach(topic => {
          client.unsubscribe(topic);
        });
        client.end();
      }
    };
  }, []);
  
  return { iotData, connected, error };
};

// Function to simulate IoT data updates (for testing)
export const simulateIoTUpdate = (setIotData) => {
  // Update a random sensor with new data
  const randomIndex = Math.floor(Math.random() * MOCK_IOT_DATA.length);
  const sensorToUpdate = MOCK_IOT_DATA[randomIndex];
  
  let newReading;
  switch (sensorToUpdate.type) {
    case 'temperature':
      newReading = `${(20 + Math.random() * 10).toFixed(1)}°C`;
      break;
    case 'humidity':
      newReading = `${Math.floor(50 + Math.random() * 40)}%`;
      break;
    case 'motion':
      newReading = Math.random() > 0.5 ? 'Movement detected' : 'No movement';
      break;
    case 'light':
      newReading = `${Math.floor(100 + Math.random() * 900)} lux`;
      break;
    default:
      newReading = 'Updated reading';
  }
  
  const updatedSensor = {
    ...sensorToUpdate,
    lastReading: newReading,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    battery: Math.max(10, sensorToUpdate.battery - Math.floor(Math.random() * 5))
  };
  
  setIotData(prevData => {
    const newData = [...prevData];
    newData[randomIndex] = updatedSensor;
    return newData;
  });
};
