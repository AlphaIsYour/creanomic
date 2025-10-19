// maps/hooks/useUserLocation.ts
import { useState, useCallback } from "react";
import L from "leaflet";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useUserLocation = (mapRef: React.RefObject<L.Map | null>) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung browser");
      return Promise.reject(new Error("Geolocation not supported"));
    }

    setIsLocating(true);
    setLocationError(null);

    return new Promise<UserLocation>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setUserLocation(location);
          setIsLocating(false);

          // Add marker to map
          if (mapRef.current) {
            // Remove existing marker
            if (userMarker) {
              mapRef.current.removeLayer(userMarker);
            }

            const userIcon = L.icon({
              iconUrl: "/marker/user-location.svg",
              iconSize: [32, 32] as [number, number],
              iconAnchor: [16, 32] as [number, number],
              popupAnchor: [0, -32] as [number, number],
            });

            const marker = L.marker([location.latitude, location.longitude], {
              icon: userIcon,
            }).addTo(mapRef.current);

            marker.bindPopup(`
              <div class="text-center p-2">
                <div class="text-sm font-semibold text-blue-600">Lokasi Anda</div>
                <div class="text-xs text-gray-500 mt-1">
                  Lat: ${location.latitude.toFixed(6)}<br>
                  Lng: ${location.longitude.toFixed(6)}
                </div>
              </div>
            `);

            setUserMarker(marker);
            mapRef.current.setView([location.latitude, location.longitude], 16);
          }

          resolve(location);
        },
        (error) => {
          let errorMessage = "Gagal mendapatkan lokasi";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Izin lokasi ditolak";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Lokasi tidak tersedia";
              break;
            case error.TIMEOUT:
              errorMessage = "Timeout mendapatkan lokasi";
              break;
          }

          setLocationError(errorMessage);
          setIsLocating(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, [mapRef, userMarker]);

  return {
    userLocation,
    isLocating,
    locationError,
    getUserLocation,
    userMarker,
  };
};
