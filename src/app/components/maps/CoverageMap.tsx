import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para el icono por defecto en entornos empaquetados como el nuestro
const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="color: #2563eb; position: relative;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translate(-50%, -100%); drop-shadow: 0px 4px 6px rgba(0,0,0,0.3);">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface CoverageMapProps {
  lat: number;
  lng: number;
  radiusKm: number;
  locationName: string;
}

export function CoverageMap({ lat, lng, radiusKm, locationName }: CoverageMapProps) {
  const radiusInMeters = radiusKm * 1000;
  
  return (
    <div className="w-full h-64 md:h-80 z-0 relative rounded-b-2xl overflow-hidden">
      <MapContainer 
        center={[lat, lng]} 
        zoom={11} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador del centro de operaciones */}
        <Marker position={[lat, lng]} icon={customIcon}>
          <Tooltip direction="top" offset={[0, -32]} opacity={1}>
            Sede Principal: <b>{locationName}</b>
          </Tooltip>
        </Marker>
        
        {/* Círculo que representa el área de cobertura */}
        <Circle 
          center={[lat, lng]} 
          radius={radiusInMeters} 
          pathOptions={{ fillColor: '#2563eb', color: '#1d4ed8', fillOpacity: 0.2 }} 
        />
      </MapContainer>
    </div>
  );
}
