import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom marker icons for different building types
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: `marker-icon-${color}`
  });
};

// Icons for different building types
const icons = {
  academic: createCustomIcon('blue'),
  residence: createCustomIcon('green'),
  facility: createCustomIcon('orange'),
  default: createCustomIcon('red'),
  iot: createCustomIcon('purple')
};

// IoT sensor data component
const IoTSensor = ({ data }) => {
  return (
    <div className="iot-sensor-data">
      <h4 className="font-bold">{data.name}</h4>
      <p>Type: {data.type}</p>
      <p>Status: {data.status}</p>
      <p>Last Reading: {data.lastReading}</p>
      <p>Battery: {data.battery}%</p>
    </div>
  );
};

// Map center component to handle map view changes
const MapCenter = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const TwoDMap = ({ 
  locations, 
  selectedBuildingId, 
  handleBuildingClick, 
  iotData = [] 
}) => {
  // Default center is Thapar University
  const defaultCenter = [30.352, 76.368];
  const defaultZoom = 16;
  
  // Find the selected building to center the map on it
  const selectedBuilding = locations.find(loc => loc.id === selectedBuildingId);
  const mapCenter = selectedBuilding ? selectedBuilding.coordinates : defaultCenter;
  
  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden">
      <MapContainer 
        center={mapCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapCenter center={mapCenter} zoom={defaultZoom} />
        
        {/* Building Markers */}
        {locations.map(location => (
          <Marker 
            key={location.id}
            position={location.coordinates}
            icon={icons[location.type] || icons.default}
            eventHandlers={{
              click: () => handleBuildingClick(location.id)
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{location.name}</h3>
                <p className="capitalize">{location.type}</p>
                <p>{location.description}</p>
                <button 
                  className="mt-2 px-3 py-1 bg-thapar-maroon text-white rounded-md text-sm"
                  onClick={() => handleBuildingClick(location.id)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* IoT Sensor Markers */}
        {iotData.map(sensor => (
          <Marker 
            key={sensor.id}
            position={sensor.coordinates}
            icon={icons.iot}
          >
            <Popup>
              <IoTSensor data={sensor} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TwoDMap;
