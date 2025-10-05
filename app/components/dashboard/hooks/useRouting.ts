// hooks/useRouting.ts
import { useEffect, useRef } from "react";
import L from "leaflet";
import RoutingManager, {
  routeInfoStyles,
} from "@/app/components/dashboard/utils/routingUtils";

export interface UseRoutingProps {
  map: L.Map | null;
  enabled?: boolean;
}

export interface UseRoutingReturn {
  showRoute: (
    lat: number,
    lng: number,
    destinationName: string
  ) => Promise<void>;
  clearRoute: () => void;
  updateUserLocation: (lat: number, lng: number) => void;
  getCurrentUserLocation: () => [number, number] | null;
  isRoutingEnabled: boolean;
}

export const useRouting = ({
  map,
  enabled = true,
}: UseRoutingProps): UseRoutingReturn => {
  const routingManagerRef = useRef<RoutingManager | null>(null);
  const stylesInjectedRef = useRef<boolean>(false);

  // Initialize routing manager when map is available
  useEffect(() => {
    if (!map || !enabled) {
      return;
    }

    // Inject CSS styles for route info markers (only once)
    if (!stylesInjectedRef.current) {
      const styleElement = document.createElement("style");
      styleElement.textContent = routeInfoStyles;
      document.head.appendChild(styleElement);
      stylesInjectedRef.current = true;
    }

    // Create routing manager
    routingManagerRef.current = new RoutingManager(map);

    // Cleanup function
    return () => {
      if (routingManagerRef.current) {
        routingManagerRef.current.destroy();
        routingManagerRef.current = null;
      }
    };
  }, [map, enabled]);

  // Show route function
  const showRoute = async (
    lat: number,
    lng: number,
    destinationName: string
  ): Promise<void> => {
    if (!routingManagerRef.current) {
      throw new Error("Routing manager not initialized");
    }

    try {
      await routingManagerRef.current.showRoute(lat, lng, destinationName);
    } catch (error) {
      console.error("Error showing route:", error);
      throw error;
    }
  };

  // Clear route function
  const clearRoute = (): void => {
    if (routingManagerRef.current) {
      routingManagerRef.current.clearRoute();
    }
  };

  // Update user location function
  const updateUserLocation = (lat: number, lng: number): void => {
    if (routingManagerRef.current) {
      routingManagerRef.current.updateUserLocation(lat, lng);
    }
  };

  // Get current user location function
  const getCurrentUserLocation = (): [number, number] | null => {
    if (routingManagerRef.current) {
      return routingManagerRef.current.getCurrentUserLocation();
    }
    return null;
  };

  return {
    showRoute,
    clearRoute,
    updateUserLocation,
    getCurrentUserLocation,
    isRoutingEnabled: enabled && !!routingManagerRef.current,
  };
};
