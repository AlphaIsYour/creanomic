"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  searchQuery: string;
  activeFilters: string[];
}

export default function LeafletMap({
  searchQuery,
  activeFilters,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([-7.2575, 112.7521], 13); // Surabaya coordinates

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom marker icons
    const createCustomIcon = (color: string) => {
      return L.divIcon({
        html: `
            <div style="
              background-color: ${color};
              width: 20px;
              height: 20px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
              "></div>
            </div>
          `,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        className: "custom-marker",
      });
    };

    // Sample markers data
    const sampleMarkers = [
      {
        id: 1,
        lat: -7.2575,
        lng: 112.7521,
        type: "waste_post",
        title: "Sampah Plastik",
        description: "5kg sampah plastik botol",
        user: "Ahmad S.",
        color: "#22c55e",
      },
      {
        id: 2,
        lat: -7.2505,
        lng: 112.7405,
        type: "craft_request",
        title: "Request Kerajinan",
        description: "Butuh tas dari bahan daur ulang",
        user: "Siti M.",
        color: "#3b82f6",
      },
      {
        id: 3,
        lat: -7.2645,
        lng: 112.7635,
        type: "pengepul",
        title: "Pengepul",
        description: "CV. Sumber Rejeki",
        user: "Budi P.",
        color: "#f59e0b",
      },
      {
        id: 4,
        lat: -7.2455,
        lng: 112.7355,
        type: "pengrajin",
        title: "Pengrajin",
        description: "Kerajinan Bambu Kreatif",
        user: "Dewi L.",
        color: "#8b5cf6",
      },
    ];

    // Add markers
    sampleMarkers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: createCustomIcon(marker.color),
      }).addTo(map);

      // Popup content
      const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-gray-800 mb-1">${marker.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${marker.description}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">oleh ${marker.user}</span>
              <button class="px-3 py-1 bg-[#8C1007] text-white text-xs rounded-full hover:bg-[#8C1007]/90 transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        `;

      leafletMarker.bindPopup(popupContent, {
        maxWidth: 250,
        className: "custom-popup",
      });
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle search and filter updates
  useEffect(() => {
    if (mapInstanceRef.current && (searchQuery || activeFilters.length > 0)) {
      // TODO: Implement search and filter logic
      console.log(
        "Updating map with search:",
        searchQuery,
        "filters:",
        activeFilters
      );
    }
  }, [searchQuery, activeFilters]);

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Custom CSS for map styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: none;
          padding: 0;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
          border: none;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .custom-marker {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8);
          font-size: 11px;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          border-radius: 8px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          margin: 2px !important;
        }

        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
        }
      `}</style>
    </>
  );
}
