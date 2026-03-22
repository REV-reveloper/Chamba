import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="color: #16a34a; position: relative;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translate(-50%, -100%); drop-shadow: 0px 4px 6px rgba(0,0,0,0.3);">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface LocationPickerMapProps {
  initialLat: number;
  initialLng: number;
  radiusKm: number;
  onChangeLocation: (lat: number, lng: number) => void;
}

// Sub-componente para capturar los clics del usuario en el mapa
function ClickHandler({ onChangeLocation }: { onChangeLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChangeLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPickerMap({ initialLat, initialLng, radiusKm, onChangeLocation }: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const radiusInMeters = (radiusKm || 1) * 1000;

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChangeLocation(lat, lng);
  };

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden border border-neutral-300 relative z-0">
      <MapContainer 
        center={position} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ClickHandler onChangeLocation={handleLocationChange} />
        
        <Marker position={position} icon={customIcon} />
        
        {radiusKm > 0 && (
          <Circle 
            center={position} 
            radius={radiusInMeters} 
            pathOptions={{ fillColor: '#16a34a', color: '#15803d', fillOpacity: 0.2 }} 
          />
        )}
      </MapContainer>
      
      <div className="absolute top-2 left-2 z-[1000] bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold text-neutral-700 border border-neutral-200 pointer-events-none">
        Haz clic en el mapa para ajustar tu ubicación
      </div>
    </div>
  );
}
