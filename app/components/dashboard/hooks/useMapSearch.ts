/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback } from "react";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import {
  Pengepul,
  Pengrajin,
  WasteOffer,
  CraftProduct,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

interface SearchResults {
  wasteOffers: WasteOffer[];
  pengepuls: Pengepul[];
  pengrajins: Pengrajin[];
  products: CraftProduct[];
  districts: string[];
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
      const response = await fetch(
        `/api/waste-offers/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) return [];
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
      const response = await fetch(
        `/api/pengepuls/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) return [];
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
      const response = await fetch(
        `/api/pengrajins/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.pengrajins || [];
    } catch (error) {
      console.error("Error searching pengrajins:", error);
      return [];
    }
  };

  // Search products
  const searchProducts = async (query: string): Promise<CraftProduct[]> => {
    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  // Search districts
  const searchDistricts = (query: string): string[] => {
    const normalizeQuery = (text: string) =>
      text.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedQuery = normalizeQuery(query);

    return districts.filter((d) => {
      const normalizedDistrict = normalizeQuery(d);
      return (
        normalizedDistrict.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedDistrict) ||
        d.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  // UNIFIED SEARCH - cari semua sekaligus!
  const searchAll = async (query: string): Promise<SearchResults> => {
    try {
      const [wasteOffers, pengepuls, pengrajins, products] = await Promise.all([
        searchWasteOffers(query),
        searchPengepuls(query),
        searchPengrajins(query),
        searchProducts(query),
      ]);

      const matchedDistricts = searchDistricts(query);

      return {
        wasteOffers,
        pengepuls,
        pengrajins,
        products,
        districts: matchedDistricts,
      };
    } catch (error) {
      console.error("Error in searchAll:", error);
      return {
        wasteOffers: [],
        pengepuls: [],
        pengrajins: [],
        products: [],
        districts: [],
      };
    }
  };

  const handleSearch = useCallback(
    async (query: string) => {
      console.log("=== UNIFIED SEARCH START ===");
      console.log("Search query:", query);

      if (!query || !mapRef.current) {
        console.log("Early return: no query or map");
        return;
      }

      if (!query.trim()) {
        console.log("Early return: empty query");
        return;
      }

      try {
        const results = await searchAll(query);
        console.log("Search results:", results);

        const totalEntities =
          results.wasteOffers.length +
          results.pengepuls.length +
          results.pengrajins.length +
          results.products.length;

        const totalDistricts = results.districts.length;

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
                iconUrl: "/marker/products.svg",
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
                { icon: markerIcon }
              );

              const popupContent = createPopupContent.pengepul(pengepul);
              marker.bindPopup(popupContent, {
                minWidth: 280,
                maxWidth: 320,
                className: "custom-popup",
              });

              marker.addTo(pengepulLayerRef.current!);
              allBounds.push([pengepul.user.latitude, pengepul.user.longitude]);
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
                { icon: markerIcon }
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

        // Render products
        if (results.products.length > 0 && pengrajinLayerRef.current) {
          console.log(`Rendering ${results.products.length} products`);
          results.products.forEach((product) => {
            const workshop = product.pengrajin;
            if (workshop.workshopLatitude && workshop.workshopLongitude) {
              const markerIcon = L.icon({
                iconUrl: "/marker/product.svg",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
              });

              const marker = L.marker(
                [workshop.workshopLatitude, workshop.workshopLongitude],
                { icon: markerIcon }
              );

              const popupContent = createPopupContent.product(product);
              marker.bindPopup(popupContent, {
                minWidth: 288,
                maxWidth: 320,
                className: "custom-popup",
              });

              marker.addTo(pengrajinLayerRef.current!);
              allBounds.push([
                workshop.workshopLatitude,
                workshop.workshopLongitude,
              ]);
            }
          });
        }

        // Handle districts (zoom to district if found)
        if (totalDistricts > 0 && totalEntities === 0) {
          const firstDistrict = results.districts[0];
          const feature = malangBoundaries.features.find(
            (f) => f.properties?.wadmkc === firstDistrict
          );
          if (feature && mapRef.current) {
            const bounds = L.geoJSON(feature).getBounds();
            mapRef.current.fitBounds(bounds);
            console.log(`Zoomed to district: ${firstDistrict}`);
            return;
          }
        }

        // Fit map to show all entity results
        if (allBounds.length > 0) {
          const bounds = L.latLngBounds(allBounds);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });

          const summary = `Ditemukan: ${results.wasteOffers.length} penawaran, ${results.pengepuls.length} pengepul, ${results.pengrajins.length} pengrajin, ${results.products.length} produk`;
          console.log(summary);
          return;
        }

        // No results found
        if (totalEntities === 0 && totalDistricts === 0) {
          throw new Error(
            `Tidak ditemukan hasil untuk "${query}".\n\nSaran:\n• Coba kata kunci yang lebih umum\n• Periksa ejaan\n• Gunakan kata kunci dalam bahasa Indonesia`
          );
        }
      } catch (error) {
        console.error("Search error:", error);
        throw error;
      }
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

  return {
    handleSearch,
    searchWasteOffers,
    searchPengepuls,
    searchPengrajins,
    searchProducts,
  };
};
