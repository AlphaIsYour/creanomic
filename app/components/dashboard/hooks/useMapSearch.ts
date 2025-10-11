/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import {
  Pengepul,
  Pengrajin,
  WasteOffer,
  WasteFacility,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

interface SearchResults {
  wasteOffers: WasteOffer[];
  pengepuls: Pengepul[];
  pengrajins: Pengrajin[];
}

export const useMapSearch = (
  mapRef: React.MutableRefObject<L.Map | null>,
  districts: string[],
  malangBoundaries: FeatureCollection,
  wasteOfferLayerRef: React.MutableRefObject<L.LayerGroup | null>,
  pengepulLayerRef: React.MutableRefObject<L.LayerGroup | null>,
  pengrajinLayerRef: React.MutableRefObject<L.LayerGroup | null>
) => {
  // Search waste offers
  const searchWasteOffers = async (query: string): Promise<WasteOffer[]> => {
    try {
      console.log("Searching waste offers with query:", query);
      const response = await fetch(
        `/api/waste-offers/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.wasteOffers || [];
    } catch (error) {
      console.error("Error searching waste offers:", error);
      return [];
    }
  };

  // Search pengepuls
  const searchPengepuls = async (query: string): Promise<Pengepul[]> => {
    try {
      console.log("Searching pengepuls with query:", query);
      const response = await fetch(
        `/api/pengepuls/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.pengepuls || [];
    } catch (error) {
      console.error("Error searching pengepuls:", error);
      return [];
    }
  };

  // Search pengrajins
  const searchPengrajins = async (query: string): Promise<Pengrajin[]> => {
    try {
      console.log("Searching pengrajins with query:", query);
      const response = await fetch(
        `/api/pengrajins/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.pengrajins || [];
    } catch (error) {
      console.error("Error searching pengrajins:", error);
      return [];
    }
  };

  // Search all entities
  const searchAll = async (query: string): Promise<SearchResults> => {
    try {
      const [wasteOffers, pengepuls, pengrajins] = await Promise.all([
        searchWasteOffers(query),
        searchPengepuls(query),
        searchPengrajins(query),
      ]);

      return { wasteOffers, pengepuls, pengrajins };
    } catch (error) {
      console.error("Error in searchAll:", error);
      return { wasteOffers: [], pengepuls: [], pengrajins: [] };
    }
  };

  const handleSearch = useCallback(
    async (query: string, searchType: "location" | "entity" = "location") => {
      console.log("=== SEARCH DEBUG START ===");
      console.log("handleSearch called with:", {
        query,
        searchType,
        mapExists: !!mapRef.current,
      });

      if (!query || !mapRef.current) {
        console.log("Early return: no query or map");
        return;
      }

      if (!query.trim()) {
        console.log("Early return: empty query after trim");
        return;
      }

      // ENTITY SEARCH LOGIC (waste offers, pengepuls, pengrajins)
      if (searchType === "entity") {
        console.log("Executing entity search...");

        try {
          const results = await searchAll(query);
          console.log("Search results:", results);

          const totalResults =
            results.wasteOffers.length +
            results.pengepuls.length +
            results.pengrajins.length;

          if (totalResults === 0) {
            const suggestions = [
              "Coba gunakan kata kunci yang lebih umum (misal: 'plastik' bukan 'botol plastik')",
              "Periksa ejaan kata kunci",
              "Coba kata kunci dalam bahasa Indonesia",
              "Gunakan kategori material (misal: 'organik', 'plastik', 'kertas')",
            ];

            throw new Error(
              `Tidak ditemukan hasil untuk "${query}".\n\nSaran pencarian:\n${suggestions
                .map((s) => `• ${s}`)
                .join("\n")}`
            );
          }

          // Clear existing markers
          wasteOfferLayerRef.current?.clearLayers();
          pengepulLayerRef.current?.clearLayers();
          pengrajinLayerRef.current?.clearLayers();

          const allBounds: [number, number][] = [];

          // Render waste offers
          if (results.wasteOffers.length > 0 && wasteOfferLayerRef.current) {
            console.log(`Rendering ${results.wasteOffers.length} waste offers`);
            results.wasteOffers.forEach((offer) => {
              if (offer.latitude && offer.longitude) {
                const markerIcon = L.icon({
                  iconUrl: "/marker/waste-offer.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                });

                const marker = L.marker([offer.latitude, offer.longitude], {
                  icon: markerIcon,
                });

                const popupContent = createPopupContent.wasteOffer(offer);

                marker.bindPopup(popupContent, {
                  minWidth: 280,
                  maxWidth: 320,
                  className: "custom-popup",
                });

                marker.addTo(wasteOfferLayerRef.current!);
                allBounds.push([offer.latitude, offer.longitude]);
              }
            });
          }

          // Render pengepuls
          if (results.pengepuls.length > 0 && pengepulLayerRef.current) {
            console.log(`Rendering ${results.pengepuls.length} pengepuls`);
            results.pengepuls.forEach((pengepul) => {
              if (pengepul.user.latitude && pengepul.user.longitude) {
                const markerIcon = L.icon({
                  iconUrl: "/marker/pengepul.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                });

                const marker = L.marker(
                  [pengepul.user.latitude, pengepul.user.longitude],
                  {
                    icon: markerIcon,
                  }
                );

                const popupContent = createPopupContent.pengepul(pengepul);

                marker.bindPopup(popupContent, {
                  minWidth: 280,
                  maxWidth: 320,
                  className: "custom-popup",
                });

                marker.addTo(pengepulLayerRef.current!);
                allBounds.push([
                  pengepul.user.latitude,
                  pengepul.user.longitude,
                ]);
              }
            });
          }

          // Render pengrajins
          if (results.pengrajins.length > 0 && pengrajinLayerRef.current) {
            console.log(`Rendering ${results.pengrajins.length} pengrajins`);
            results.pengrajins.forEach((pengrajin) => {
              if (pengrajin.workshopLatitude && pengrajin.workshopLongitude) {
                const markerIcon = L.icon({
                  iconUrl: "/marker/pengrajin.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                });

                const marker = L.marker(
                  [pengrajin.workshopLatitude, pengrajin.workshopLongitude],
                  {
                    icon: markerIcon,
                  }
                );

                const popupContent = createPopupContent.pengrajin(pengrajin);

                marker.bindPopup(popupContent, {
                  minWidth: 288,
                  maxWidth: 320,
                  className: "custom-popup",
                });

                marker.addTo(pengrajinLayerRef.current!);
                allBounds.push([
                  pengrajin.workshopLatitude,
                  pengrajin.workshopLongitude,
                ]);
              }
            });
          }

          // Fit map to show all results
          if (allBounds.length > 0) {
            const bounds = L.latLngBounds(allBounds);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            console.log(
              `Map fitted to bounds for ${totalResults} results (${results.wasteOffers.length} offers, ${results.pengepuls.length} pengepuls, ${results.pengrajins.length} pengrajins)`
            );
          }

          console.log("Entity search completed successfully");
          return;
        } catch (error) {
          console.error("Entity search error:", error);
          throw error;
        }
      }

      // LOCATION SEARCH LOGIC
      console.log("Executing location search...");

      const normalizeQuery = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]/g, "");
      const normalizedQuery = normalizeQuery(query);

      // Search in districts
      const foundDistrict = districts.find((d) => {
        const normalizedDistrict = normalizeQuery(d);
        return (
          normalizedDistrict.includes(normalizedQuery) ||
          normalizedQuery.includes(normalizedDistrict) ||
          d.toLowerCase().includes(query.toLowerCase())
        );
      });

      if (foundDistrict) {
        console.log("Found district:", foundDistrict);
        const feature = malangBoundaries.features.find(
          (f) => f.properties?.wadmkc === foundDistrict
        );
        if (feature && mapRef.current) {
          const bounds = L.geoJSON(feature).getBounds();
          mapRef.current.fitBounds(bounds);
          console.log("Map fitted to district bounds");
        }
        return;
      }

      // If location not found, suggest entity search
      throw new Error(
        `Lokasi "${query}" tidak ditemukan.\n\nSaran:\n• Coba nama kecamatan yang lebih lengkap\n• Atau gunakan pencarian entitas untuk mencari penawaran sampah, pengepul, atau pengrajin`
      );
    },
    [
      mapRef,
      districts,
      malangBoundaries,
      wasteOfferLayerRef,
      pengepulLayerRef,
      pengrajinLayerRef,
    ]
  );

  return { handleSearch, searchWasteOffers, searchPengepuls, searchPengrajins };
};
