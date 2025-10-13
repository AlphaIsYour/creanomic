/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet.css";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import toast from "react-hot-toast";
import { CustomToast } from "@/app/components/dashboard/components/CustomToast";

import { SearchBar } from "@/app/components/dashboard/components/SearchBar";
import { MapSkeleton } from "@/app/components/dashboard/components/MapSkeleton";
import { useMapData } from "@/app/components/dashboard/hooks/useMapData";
import { useMapSearch } from "@/app/components/dashboard/hooks/useMapSearch";
import { useUserLocation } from "@/app/components/dashboard/hooks/useUserLocation";
import { useRouting } from "@/app/components/dashboard/hooks/useRouting";
import {
  layerConfigs,
  typedMalangBoundaries,
} from "@/app/components/dashboard/constants/mapConfig";
import { tourSteps } from "@/app/components/dashboard/constants/tourSteps";
import {
  getDistrictColor,
  defaultColors,
} from "@/app/components/dashboard/utils/mapUtils";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

interface MapComponentProps {
  onDistrictsLoaded?: (districts: string[]) => void;
}

export default function MapComponent({ onDistrictsLoaded }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [layers, setLayers] = useState(layerConfigs);
  const [districts, setDistricts] = useState<string[]>([]);

  // UPDATE 1 & 2: Destructure useMapData dengan props baru + hapus duplicate refs
  const {
    loading,
    showPengepuls,
    showPengrajins,
    showWasteOffers,
    wasteFacilities,
    pengepulLayerRef,
    pengrajinLayerRef,
    wasteOfferLayerRef,
    setShowPengepuls,
    setShowPengrajins,
    setShowWasteOffers,
    fetchWasteFacilities,
    loadPengepuls,
    loadPengrajins,
    loadWasteOffers,
    initializeLayers,
  } = useMapData(mapRef);

  const { userLocation, isLocating, locationError, getUserLocation } =
    useUserLocation(mapRef);

  const routing = useRouting({
    map: mapRef.current,
    enabled: true,
  });

  const { handleSearch } = useMapSearch(
    mapRef,
    districts,
    typedMalangBoundaries,
    wasteOfferLayerRef,
    pengepulLayerRef,
    pengrajinLayerRef
  );

  const showCustomToast = useCallback(
    (message: string, type: "success" | "error" | "loading") => {
      toast.custom((t) => <CustomToast t={t} message={message} type={type} />);
    },
    []
  );

  const handleGetUserLocation = async () => {
    try {
      await getUserLocation();
      showCustomToast("Lokasi ditemukan!", "success");
    } catch (error) {
      showCustomToast(locationError || "Gagal mendapatkan lokasi", "error");
    }
  };

  const displayWasteFacilityMarkers = (layerId: string) => {
    if (!wasteFacilities || !mapRef.current) return;

    const layerGroup = layerGroupsRef.current[layerId];
    if (!layerGroup) return;

    layerGroup.clearLayers();

    const layerKeyMap: { [key: string]: string } = {
      "bank-sampah": "bankSampah",
      "lembaga-tpa": "lembagaTpa",
      tpa: "tpa",
      tpst3r: "tpst3r",
    };

    const facilityKey = layerKeyMap[layerId] as keyof typeof wasteFacilities;
    if (wasteFacilities && wasteFacilities[facilityKey]) {
      wasteFacilities[facilityKey].forEach((facility: any) => {
        if (facility.latitude && facility.longitude) {
          const layerConfig = layerConfigs.find((l) => l.id === layerId);
          const markerIcon = L.icon({
            iconUrl: layerConfig?.icon || "/marker/default.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const marker = L.marker([facility.latitude, facility.longitude], {
            icon: markerIcon,
          });

          const popupContent = createPopupContent.wasteFacility({
            id: facility.id || "unknown",
            name: facility.name,
            address: facility.address,
            type: facility.type,
            latitude: facility.latitude,
            longitude: facility.longitude,
          });

          marker.bindPopup(popupContent);
          marker.addTo(layerGroup);
        }
      });
    }
  };

  useEffect(() => {
    const initializeMap = () => {
      if (typeof window === "undefined") return;

      const mapElement = document.getElementById("map");
      if (!mapElement || mapRef.current) return;

      const map = L.map("map", {
        zoomControl: false,
        attributionControl: false,
      }).setView([-7.9666, 112.6326], 10);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          ' <a href="https://www.openstreetmap.org/copyright">Bekasin</a> contributors',
      }).addTo(map);

      const geoJSONLayer = L.geoJSON(typedMalangBoundaries, {
        style: (feature: any) => {
          const districtName = feature?.properties?.wadmkc;
          const colors = districtName
            ? getDistrictColor(districtName)
            : defaultColors;
          return {
            fillColor: colors.fillColor,
            color: colors.color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.3,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          layer.on({
            mouseover: (e: any) => {
              const targetLayer = e.target;
              targetLayer.setStyle({
                fillOpacity: 0.8,
                weight: 3,
                color: "#2563eb",
              });

              if (targetLayer.bringToFront) {
                targetLayer.bringToFront();
              }
            },
            mouseout: (e: any) => {
              const targetLayer = e.target;
              if (
                geoJSONLayer &&
                typeof geoJSONLayer.options.style === "function"
              ) {
                const originalStyle = geoJSONLayer.options.style(feature);
                targetLayer.setStyle(originalStyle);
              } else {
                targetLayer.setStyle({
                  fillOpacity: 0.3,
                  weight: 2,
                });
              }
            },
            click: (e: any) => {
              if (mapRef.current && e.target.getBounds) {
                mapRef.current.fitBounds(e.target.getBounds());
              }
            },
          });

          if (feature.properties) {
            const props = feature.properties;
            const districtName = props.wadmkc;
            const jumlahKelurahan = props["jumlah kel"] || 0;
            const jumlahDesa = props["jumlah k_1"] || 0;
            const luasArea = props.luas_ha;

            const normalizedDistrictName = districtName
              ? districtName.toLowerCase().replace(/\s+/g, "_")
              : "default";

            const districtImagePath = `/kecamatan/${normalizedDistrictName}.jpg`;
            const districtIdForLink = districtName
              ? encodeURIComponent(districtName)
              : "tidak-diketahui";
            const detailLink = `/kecamatan/${districtIdForLink}`;

            const popupContent = `
              <div class="w-64 sm:w-72 overflow-hidden rounded-xl shadow-2xl bg-white font-sans antialiased text-gray-800 transform transition-all duration-300">
                <div class="relative h-36 w-full overflow-hidden">
                  <img
                    src="${districtImagePath}"
                    alt="Kecamatan ${districtName}"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 hidden items-center justify-center"
                    style="display: none;"
                  >
                    <div class="text-white text-center">
                      <svg class="w-12 h-12 mx-auto mb-2 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                      </svg>
                      <p class="text-sm font-medium">No Image</p>
                    </div>
                  </div>
  
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="font-bold text-xl text-white drop-shadow-lg leading-tight">
                      Kec. ${districtName || "Tidak Diketahui"}
                    </h3>
                  </div>
                </div>
  
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-[#8c10072e] p-3 rounded-lg border border-blue-200">
                      <div class="text-xs font-medium text-white uppercase tracking-wide mb-1">Kelurahan</div>
                      <div class="text-lg font-bold text-white">${jumlahKelurahan}</div>
                    </div>
                    <div class="bg-[#8c10072e] p-3 rounded-lg border border-green-200">
                      <div class="text-xs font-medium text-white uppercase tracking-wide mb-1">Desa</div>
                      <div class="text-lg font-bold text-white">${jumlahDesa}</div>
                    </div>
                  </div>
  
                  ${
                    luasArea
                      ? `
                    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                      <div class="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Luas Wilayah</div>
                      <div class="text-sm font-semibold text-purple-800">
                        ${parseFloat(luasArea).toLocaleString("id-ID")} hectare
                      </div>
                    </div>
                  `
                      : ""
                  }
  
                  <button
                    onclick="window.open('${detailLink}', '_blank')"
                    class="group w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300"
                  >
                    <div class="flex items-center justify-center space-x-2">
                      <span class="text-sm">Lihat Detail Kecamatan</span>
                      <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            `;

            layer.bindPopup(popupContent, {
              minWidth: 280,
              maxWidth: 320,
              className: "district-popup-enhanced",
              closeButton: true,
              autoPan: true,
              autoPanPadding: L.point(20, 20),
              offset: L.point(0, -10),
            });
          }
        },
      }).addTo(map);

      layerConfigs.forEach((layerConfig) => {
        const layerGroup = L.layerGroup().addTo(map);
        layerGroupsRef.current[layerConfig.id] = layerGroup;
      });

      // UPDATE 3 & 4: Panggil initializeLayers() dan hapus manual initialization
      initializeLayers();

      const uniqueDistricts = Array.from(
        new Set(
          typedMalangBoundaries.features
            .map((feature: GeoJSON.Feature) => feature.properties?.wadmkc)
            .filter(Boolean) as string[]
        )
      );
      setDistricts(uniqueDistricts);

      if (onDistrictsLoaded && uniqueDistricts.length > 0) {
        onDistrictsLoaded(uniqueDistricts);
      }

      if (geoJSONLayer.getBounds().isValid()) {
        map.fitBounds(geoJSONLayer.getBounds(), {
          padding: [20, 20],
        });
      }
    };

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(initializeMap, 100);
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (typeof window !== "undefined") {
        delete (window as any).showRoute;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).showRoute = async (
        destLat: number,
        destLng: number,
        destName: string
      ) => {
        try {
          await routing.showRoute(destLat, destLng, destName);
          showCustomToast(`Rute ke ${destName} berhasil dibuat!`, "success");
        } catch (error) {
          console.error("Route error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Gagal membuat rute";
          showCustomToast(errorMessage, "error");
        }
      };
    }
  }, [routing, showCustomToast]);

  // UPDATE 5 & 6: Tambah toggleWasteOffers dan update getState
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).mapControls = {
        toggleWasteOffers: async () => {
          console.log("Toggle Waste Offers!", showWasteOffers);
          setShowWasteOffers((prev) => !prev);
          if (!showWasteOffers) {
            await loadWasteOffers();
          } else {
            if (wasteOfferLayerRef.current) {
              wasteOfferLayerRef.current.clearLayers();
            }
          }
        },
        togglePengepul: async () => {
          console.log("Toggle Pengepul!", showPengepuls);
          setShowPengepuls((prev) => !prev);
          if (!showPengepuls) {
            await loadPengepuls();
          } else {
            if (pengepulLayerRef.current) {
              pengepulLayerRef.current.clearLayers();
            }
          }
        },
        togglePengrajin: async () => {
          console.log("Toggle Pengrajin!", showPengrajins);
          setShowPengrajins((prev) => !prev);
          if (!showPengrajins) {
            await loadPengrajins();
          } else {
            if (pengrajinLayerRef.current) {
              pengrajinLayerRef.current.clearLayers();
            }
          }
        },
        toggleLayer: async (layerId: string) => {
          setLayers((prevLayers) =>
            prevLayers.map((layer) =>
              layer.id === layerId
                ? { ...layer, isActive: !layer.isActive }
                : layer
            )
          );
          const layer = layers.find((l) => l.id === layerId);
          if (!layer) return;
          if (!layer.isActive) {
            if (!wasteFacilities) {
              await fetchWasteFacilities();
            }
            displayWasteFacilityMarkers(layerId);
          } else {
            const layerGroup = layerGroupsRef.current[layerId];
            if (layerGroup) {
              layerGroup.clearLayers();
            }
          }
        },
        getUserLocation: handleGetUserLocation,
        clearRoutes: () => {
          routing.clearRoute();
          showCustomToast("Semua rute telah dihapus", "success");
        },
        startTour: () => {
          const driverObj = driver({
            showProgress: true,
            steps: tourSteps,
          });
          driverObj.drive();
          showCustomToast("Memulai tour panduan!", "success");
        },
        getState: () => ({
          showPengepuls,
          showPengrajins,
          showWasteOffers,
          loadingPengepuls: loading.pengepuls,
          loadingPengrajins: loading.pengrajins,
          loadingWasteOffers: loading.wasteOffers,
          isLocating,
          layers,
          isRoutingEnabled: routing.isRoutingEnabled,
        }),
      };
    }
  }, [
    showPengepuls,
    showPengrajins,
    showWasteOffers,
    loading.pengepuls,
    loading.pengrajins,
    loading.wasteOffers,
    isLocating,
    layers,
    routing,
  ]);

  const handleSearchWithToast = async (
    query: string,
    searchType: "location" | "entity"
  ) => {
    if (!query?.trim()) {
      showCustomToast("Masukkan kata kunci pencarian", "error");
      return;
    }

    try {
      showCustomToast("Mencari...", "loading");
      await handleSearch(query.trim(), searchType);

      if (searchType === "entity") {
        showCustomToast(`Hasil pencarian "${query}" ditemukan!`, "success");
      } else {
        showCustomToast(`Lokasi "${query}" ditemukan!`, "success");
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Pencarian gagal, silakan coba lagi";
      showCustomToast(errorMessage, "error");
    }
  };

  return (
    <div className="relative h-screen w-full">
      {isLoading ? (
        <MapSkeleton />
      ) : (
        <>
          <div id="map" className="absolute inset-0" style={{ zIndex: 0 }} />

          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 z-[1000]">
            <div className="flex items-center text-xs text-gray-600">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  routing.isRoutingEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              Routing: {routing.isRoutingEnabled ? "Aktif" : "Tidak Aktif"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
