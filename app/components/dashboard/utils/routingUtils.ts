/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/routingUtils.ts
import L from "leaflet";

// Declare global window interface extension
declare global {
  interface Window {
    showRoute?: (lat: number, lng: number, destinationName: string) => void;
    currentRouteLayer?: L.LayerGroup;
    mapInstance?: L.Map | null;
  }
}

export interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

export interface RouteOptions {
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export class RoutingManager {
  private map: L.Map;
  private routeLayer: L.LayerGroup;
  private userLocation: [number, number] | null = null;

  constructor(map: L.Map) {
    this.map = map;
    this.routeLayer = L.layerGroup().addTo(map);

    // Store references globally
    window.mapInstance = map;
    window.currentRouteLayer = this.routeLayer;

    // Bind the global showRoute function
    this.initializeGlobalRouteFunction();
  }

  private initializeGlobalRouteFunction() {
    window.showRoute = async (
      lat: number,
      lng: number,
      destinationName: string
    ) => {
      try {
        await this.showRoute(lat, lng, destinationName);
      } catch (error) {
        console.error("Error showing route:", error);
        this.showErrorNotification(
          "Gagal menampilkan rute. Silakan coba lagi."
        );
      }
    };
  }

  async showRoute(
    destinationLat: number,
    destinationLng: number,
    destinationName: string,
    options: RouteOptions = {}
  ): Promise<void> {
    // Clear existing routes SAFELY
    this.clearRoute();

    try {
      // Get user location first
      const userLocation = await this.getUserLocation();

      if (!userLocation) {
        throw new Error("Tidak dapat mendapatkan lokasi pengguna");
      }

      // Get route from routing service
      const routeData = await this.getRouteFromService(userLocation, [
        destinationLat,
        destinationLng,
      ]);

      if (!routeData) {
        throw new Error("Tidak dapat mendapatkan data rute");
      }

      // Display route on map
      this.displayRoute(routeData, destinationName, options);

      // Fit map to show both locations
      this.fitMapToRoute(userLocation, [destinationLat, destinationLng]);

      // Show success notification
      this.showSuccessNotification(
        `Rute ke ${destinationName} berhasil ditampilkan`
      );
    } catch (error) {
      console.error("Error in showRoute:", error);
      throw error;
    }
  }

  private async getUserLocation(): Promise<[number, number] | null> {
    return new Promise((resolve) => {
      if (this.userLocation) {
        resolve(this.userLocation);
        return;
      }

      if (!navigator.geolocation) {
        console.error("Geolocation tidak didukung browser ini");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          this.userLocation = location;
          resolve(location);
        },
        (error) => {
          console.error("Error getting user location:", error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  private async getRouteFromService(
    start: [number, number],
    end: [number, number]
  ): Promise<any> {
    try {
      // Using OpenRouteService or similar routing service
      // You can replace this with your preferred routing API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found");
      }

      return {
        coordinates: data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] // Flip lng,lat to lat,lng
        ),
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } catch (error) {
      console.error("Error fetching route from service:", error);

      // Fallback: create simple straight line
      return {
        coordinates: [start, end],
        distance: this.calculateDistance(start, end) * 1000, // Convert to meters
        duration: ((this.calculateDistance(start, end) * 1000) / 50) * 3.6, // Rough estimate
      };
    }
  }

  private displayRoute(
    routeData: any,
    destinationName: string,
    options: RouteOptions
  ): void {
    const defaultOptions = {
      color: "#3B82F6",
      weight: 4,
      opacity: 0.8,
      ...options,
    };

    // Create route polyline
    const routeLine = L.polyline(routeData.coordinates, defaultOptions);

    // Add route to layer
    this.routeLayer.addLayer(routeLine);

    // Add markers for start and end points
    if (routeData.coordinates.length >= 2) {
      const startPoint = routeData.coordinates[0];

      // Start marker (user location)
      const startMarker = L.marker(startPoint, {
        icon: L.icon({
          iconUrl: "/marker/user-location.svg",
          iconSize: [32, 32] as [number, number],
          iconAnchor: [16, 32] as [number, number],
          popupAnchor: [0, -32] as [number, number],
        }),
      }).bindPopup("Lokasi Anda");

      this.routeLayer.addLayer(startMarker);
    }

    // Add route info popup
    const routeInfo = this.createRouteInfoPopup(routeData, destinationName);
    const midPoint = this.getRouteMiddlePoint(routeData.coordinates);

    if (midPoint) {
      const infoMarker = L.marker(midPoint, {
        icon: L.divIcon({
          className: "route-info-marker",
          html: routeInfo,
          iconSize: [200, 50],
          iconAnchor: [100, 25],
        }),
      });

      this.routeLayer.addLayer(infoMarker);
    }
  }

  private createRouteInfoPopup(
    routeData: any,
    destinationName: string
  ): string {
    const distance = this.formatDistance(routeData.distance);
    const duration = this.formatDuration(routeData.duration);

    // Generate unique ID untuk popup ini
    const popupId = `route-info-${Date.now()}`;

    return `
    <div id="${popupId}" class="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-xs font-medium relative">
      <button 
        onclick="document.getElementById('${popupId}').style.display='none'"
        class="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-colors z-10"
        title="Tutup"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      
      <div class="text-center text-blue-600 font-semibold mb-1">
        Rute ke ${destinationName}
      </div>
      <div class="flex justify-between space-x-4 text-gray-600">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          ${distance}
        </div>
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          ${duration}
        </div>
      </div>
    </div>
  `;
  }

  private fitMapToRoute(start: [number, number], end: [number, number]): void {
    const bounds = L.latLngBounds([start, end]);
    this.map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }

  private getRouteMiddlePoint(
    coordinates: [number, number][]
  ): [number, number] | null {
    if (coordinates.length === 0) return null;

    const middleIndex = Math.floor(coordinates.length / 2);
    return coordinates[middleIndex];
  }

  private calculateDistance(
    start: [number, number],
    end: [number, number]
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(end[0] - start[0]);
    const dLon = this.degreesToRadians(end[1] - start[1]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(start[0])) *
        Math.cos(this.degreesToRadians(end[0])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} menit`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}j ${remainingMinutes}m`;
    }
  }

  clearRoute(): void {
    // Add safety checks
    if (this.routeLayer && this.routeLayer.clearLayers) {
      try {
        this.routeLayer.clearLayers();
      } catch (error) {
        console.warn("Error clearing route layers:", error);
        // Recreate layer if corrupted
        this.routeLayer = L.layerGroup().addTo(this.map);
      }
    }
  }

  private showSuccessNotification(message: string): void {
    // You can implement your notification system here
    // For now, we'll use a simple console log
    console.log("✅ " + message);

    // Optional: Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Rute Ditampilkan", {
        body: message,
        icon: "/favicon.ico",
      });
    }
  }

  private showErrorNotification(message: string): void {
    // You can implement your notification system here
    console.error("❌ " + message);

    // Optional: Show alert as fallback
    alert(message);
  }

  // Public method to update user location
  updateUserLocation(lat: number, lng: number): void {
    this.userLocation = [lat, lng];
  }

  // Public method to get current user location
  getCurrentUserLocation(): [number, number] | null {
    return this.userLocation;
  }

  // Cleanup method
  destroy(): void {
    this.clearRoute();
    this.map.removeLayer(this.routeLayer);

    // Clean up global references
    delete window.showRoute;
    delete window.currentRouteLayer;
    delete window.mapInstance;
  }
}

// CSS for route info marker
export const routeInfoStyles = `
  .route-info-marker {
    background: transparent !important;
    border: none !important;
  }
  
  .route-info-marker .leaflet-marker-icon {
    background: transparent !important;
    border: none !important;
  }
`;

export default RoutingManager;
