import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export default function ThaparMap({ center = [75.7873, 30.3528], zoom = 15 }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const [mapZoom, setZoom] = useState(zoom);

  useEffect(() => {
    if (map.current) return; // already initialized
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: mapZoom
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    }
    
    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  return (
    <div className="map-container">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {mapZoom}
      </div>
      <div ref={mapContainer} className="map" style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
