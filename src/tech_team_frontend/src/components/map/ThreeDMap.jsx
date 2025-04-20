import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';

// Building component
const Building = ({ position, size, color, name, isSelected, onClick }) => {
  const meshRef = useRef();
  
  // Hover effect
  const [hovered, setHovered] = useState(false);
  
  // Pulse animation for selected buildings
  useFrame(() => {
    if (isSelected && meshRef.current) {
      meshRef.current.scale.y = 1 + Math.sin(Date.now() / 500) * 0.05;
    }
  });
  
  return (
    <group position={[position[0], 0, position[1]]} onClick={onClick}>
      <Box 
        ref={meshRef}
        args={[size.width, size.height, size.depth]} 
        position={[0, size.height / 2, 0]}
      >
        <meshStandardMaterial 
          color={isSelected ? '#aa0000' : (hovered ? '#555555' : color)} 
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      <Text
        position={[0, size.height + 0.5, 0]}
        color="black"
        fontSize={0.5}
        maxWidth={10}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Hover handlers */}
      <mesh
        visible={false}
        position={[0, size.height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[size.width + 0.2, size.height + 0.2, size.depth + 0.2]} />
      </mesh>
    </group>
  );
};

// IoT Sensor component
const IoTSensor = ({ position, data }) => {
  const meshRef = useRef();
  
  // Pulse animation based on sensor status
  useFrame(() => {
    if (meshRef.current) {
      if (data.status === 'active') {
        meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 
          1 + Math.sin(Date.now() / 300) * 0.1;
      }
    }
  });
  
  // Color based on sensor type
  const getColor = () => {
    switch (data.type) {
      case 'temperature': return 'red';
      case 'humidity': return 'blue';
      case 'motion': return 'green';
      case 'light': return 'yellow';
      default: return 'purple';
    }
  };
  
  return (
    <group position={[position[0], 1.5, position[1]]}>
      <Sphere ref={meshRef} args={[0.3, 16, 16]}>
        <meshStandardMaterial 
          color={getColor()} 
          emissive={getColor()}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      <Text
        position={[0, 0.5, 0]}
        color="white"
        fontSize={0.3}
        maxWidth={10}
        anchorX="center"
        anchorY="middle"
      >
        {data.name}
      </Text>
    </group>
  );
};

// Ground component
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#88aa88" roughness={1} />
    </mesh>
  );
};

// Main 3D Map component
const ThreeDMap = ({ 
  locations, 
  selectedBuildingId, 
  handleBuildingClick,
  iotData = []
}) => {
  // Convert location data to 3D coordinates and sizes
  const buildingData = locations.map(location => {
    // Calculate building size based on floors
    const height = location.floors * 1.5;
    const width = 3 + Math.random() * 2; // Random width between 3-5
    const depth = 3 + Math.random() * 2; // Random depth between 3-5
    
    // Convert GPS coordinates to relative 3D space
    // This is a simple conversion - in a real app, you'd use proper projection
    const baseLatLon = [30.352, 76.368]; // Base coordinates (Thapar University)
    const scale = 100; // Scale factor to make distances visible
    
    const x = (location.coordinates[1] - baseLatLon[1]) * scale;
    const z = (location.coordinates[0] - baseLatLon[0]) * scale;
    
    // Determine color based on building type
    let color;
    switch (location.type) {
      case 'academic': color = '#4b7bec'; break;
      case 'residence': color = '#26de81'; break;
      case 'facility': color = '#fd9644'; break;
      default: color = '#a5b1c2';
    }
    
    return {
      ...location,
      position: [x, z],
      size: { width, height, depth },
      color
    };
  });
  
  // Convert IoT sensor data to 3D coordinates
  const sensorData = iotData.map(sensor => {
    // Convert GPS coordinates to relative 3D space
    const baseLatLon = [30.352, 76.368]; // Base coordinates (Thapar University)
    const scale = 100; // Scale factor to make distances visible
    
    const x = (sensor.coordinates[1] - baseLatLon[1]) * scale;
    const z = (sensor.coordinates[0] - baseLatLon[0]) * scale;
    
    return {
      ...sensor,
      position: [x, z]
    };
  });
  
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden">
      <Canvas shadows camera={{ position: [0, 20, 20], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Buildings */}
        {buildingData.map(building => (
          <Building
            key={building.id}
            position={building.position}
            size={building.size}
            color={building.color}
            name={building.name}
            isSelected={building.id === selectedBuildingId}
            onClick={() => handleBuildingClick(building.id)}
          />
        ))}
        
        {/* IoT Sensors */}
        {sensorData.map(sensor => (
          <IoTSensor
            key={sensor.id}
            position={sensor.position}
            data={sensor}
          />
        ))}
        
        <Ground />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
        <gridHelper args={[100, 100, '#444444', '#444444']} />
      </Canvas>
    </div>
  );
};

export default ThreeDMap;
