/* eslint-disable @typescript-eslint/no-unused-vars */
// maps/services/routingService.ts
import L from "leaflet";

export interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

class RoutingService {
  // Using OpenRouteService (free alternative)
  private readonly baseUrl =
    "https://api.openrouteservice.org/v2/directions/driving-car";
  private readonly apiKey =
    process.env.NEXT_PUBLIC_OPENROUTE_API_KEY || "demo-key";

  async getRoute(
    start: RouteCoordinates,
    end: RouteCoordinates
  ): Promise<RouteResponse> {
    try {
      const url = `${this.baseUrl}?api_key=${this.apiKey}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to get route");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates.map(
          (coord: [number, number]) => [
            coord[1], // lat
            coord[0], // lng
          ]
        );

        return {
          coordinates,
          distance: route.properties.segments[0].distance,
          duration: route.properties.segments[0].duration,
        };
      }

      throw new Error("No route found");
    } catch (error) {
      console.error("Routing error:", error);
      // Fallback: simple straight line
      return this.getStraightLineRoute(start, end);
    }
  }

  private getStraightLineRoute(
    start: RouteCoordinates,
    end: RouteCoordinates
  ): RouteResponse {
    const distance = this.calculateDistance(start, end);

    return {
      coordinates: [
        [start.latitude, start.longitude],
        [end.latitude, end.longitude],
      ],
      distance: distance * 1000, // convert to meters
      duration: (distance / 50) * 3600, // assume 50 km/h
    };
  }

  private calculateDistance(
    start: RouteCoordinates,
    end: RouteCoordinates
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(end.latitude - start.latitude);
    const dLon = this.toRad(end.longitude - start.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(start.latitude)) *
        Math.cos(this.toRad(end.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    }
    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }

  formatDuration(durationInSeconds: number): string {
    const minutes = Math.round(durationInSeconds / 60);
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  }
}

export const routingService = new RoutingService();
