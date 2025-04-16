import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface MapboxMapProps {
  accessToken: string;
  onMarkerClick: (id: string) => void;
  selectedLocationId: string | null;
  locations: Location[];
  center?: [number, number]; // [longitude, latitude] - optional
}

const MapboxMap: React.FC<MapboxMapProps> = ({ 
  accessToken, 
  onMarkerClick, 
  selectedLocationId,
  locations,
  center = [0, 0] // Default center if not provided
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const [markerElements, setMarkerElements] = useState<{ [id: string]: HTMLDivElement }>({});

  // Initialize the map
  useEffect(() => {
    if (!accessToken || !mapContainer.current) return;

    mapboxgl.accessToken = accessToken;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 16,
      pitch: 60, // Tilt the map for 3D effect
      bearing: 0,
    });

    map.current = newMap;

    // Add 3D buildings layer
    newMap.on('load', () => {
      // Add 3D buildings
      newMap.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.8
        }
      });

      // Add navigation controls
      newMap.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add fullscreen control
      newMap.addControl(
        new mapboxgl.FullscreenControl(),
        'top-right'
      );
    });

    // Create marker elements
    const elements: { [id: string]: HTMLDivElement } = {};
    
    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'marker cursor-pointer';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.background = getColorForLocationType(location.type);
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '12px';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.transition = 'all 0.3s ease';
      el.style.cursor = 'pointer';
      el.textContent = location.name.substring(0, 1);
      el.title = location.name;
      
      elements[location.id] = el;
    });
    
    setMarkerElements(elements);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      // Clear markers
      Object.values(markers.current).forEach(marker => marker.remove());
      markers.current = {};
    };
  }, [accessToken, center]);

  // Add markers once we have both the map and marker elements
  useEffect(() => {
    if (!map.current || Object.keys(markerElements).length === 0) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Add markers for each location
    locations.forEach(location => {
      const el = markerElements[location.id];
      if (!el) return;
      
      // Set up click handler
      el.onclick = () => {
        onMarkerClick(location.id);
      };
      
      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(location.coordinates)
        .addTo(map.current!);
      
      markers.current[location.id] = marker;
    });
  }, [locations, markerElements, onMarkerClick, map.current]);

  // Update marker styles when selected location changes
  useEffect(() => {
    if (Object.keys(markerElements).length === 0) return;

    // Reset all markers to default style
    Object.entries(markerElements).forEach(([id, el]) => {
      const location = locations.find(loc => loc.id === id);
      if (!location) return;

      el.style.background = getColorForLocationType(location.type);
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.zIndex = '1';
    });
    
    // Highlight selected marker
    if (selectedLocationId && markerElements[selectedLocationId]) {
      const el = markerElements[selectedLocationId];
      el.style.background = '#f59e0b'; // Amber color for selected
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.zIndex = '10';
      
      // Fly to the selected location
      const location = locations.find(loc => loc.id === selectedLocationId);
      if (location && map.current) {
        map.current.flyTo({
          center: location.coordinates,
          zoom: 18,
          pitch: 60,
          bearing: 30,
          duration: 1500
        });
      }
    }
  }, [selectedLocationId, markerElements, locations]);

  // Helper function to get color based on location type
  const getColorForLocationType = (type: string): string => {
    switch (type) {
      case 'Academic':
        return '#3B82F6'; // Blue
      case 'Residence':
        return '#10B981'; // Green
      case 'Dining':
        return '#F97316'; // Orange
      case 'Facility':
        return '#6366F1'; // Indigo
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapboxMap;
