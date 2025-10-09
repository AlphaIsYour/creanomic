/* eslint-disable @typescript-eslint/no-explicit-any */
// components/waste-offers/LocationPicker.tsx
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialPosition?: [number, number];
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  useMapEvents({
    locationfound(e) {
      if (!position) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
        map.flyTo([lat, lng], 15);
      }
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({
  onLocationSelect,
  initialPosition,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const defaultCenter: [number, number] = initialPosition || [
    -8.1319, 113.2254,
  ]; // Lumajang, East Java

  const handleLocationSelect = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      // Reverse geocoding using Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      const address =
        data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      onLocationSelect(lat, lng, address);
    } catch (error) {
      console.error("Error getting address:", error);
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
        className="border border-gray-300"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleLocationSelect} />
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8C1007]"></div>
            <span>Mendapatkan alamat...</span>
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4 inline mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Klik pada peta untuk memilih lokasi pengambilan sampah
      </p>
    </div>
  );
}
