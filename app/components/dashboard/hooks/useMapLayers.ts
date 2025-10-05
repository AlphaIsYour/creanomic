/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback } from "react";
import L from "leaflet";
import { FeatureCollection, Feature, Point } from "geojson";
import {
  LayerConfig,
  TPST3RProperties,
} from "@/app/components/dashboard/types/map.types";
import { createCustomIcon } from "@/app/components/dashboard/utils/mapUtils";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

export const useMapLayers = (mapRef: React.MutableRefObject<L.Map | null>) => {
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const initializeLayers = useCallback(
    (layerConfigs: LayerConfig[]) => {
      if (!mapRef.current) return;

      layerConfigs.forEach((layerConfig) => {
        const layerGroup = L.layerGroup().addTo(mapRef.current!);
        layerGroupsRef.current[layerConfig.id] = layerGroup;
      });
    },
    [mapRef]
  );

  const updateLayers = useCallback(
    (layers: LayerConfig[]) => {
      if (!mapRef.current) return;

      layers.forEach((layer) => {
        console.log(`Layer ${layer.id}:`, {
          isActive: layer.isActive,
          hasData: !!layer.data,
          dataLength: layer.data?.features?.length,
        });

        const layerGroup = layerGroupsRef.current[layer.id];
        if (!layerGroup) return;

        layerGroup.clearLayers();

        if (layer.isActive && layer.data) {
          const customIcon = createCustomIcon(layer.icon);

          L.geoJSON(layer.data, {
            pointToLayer: (
              feature: Feature<Point, TPST3RProperties>,
              latlng: L.LatLng
            ): L.Layer => {
              let markerLatLng = latlng;

              // Handle different coordinate systems
              if (
                layer.id === "bank-sampah" &&
                feature.properties?.lat_1 &&
                feature.properties?.long_1
              ) {
                const lat = parseFloat(String(feature.properties.lat_1));
                const lng = parseFloat(String(feature.properties.long_1));
                if (!isNaN(lat) && !isNaN(lng)) {
                  markerLatLng = L.latLng(lat, lng);
                }
              }

              if (layer.id === "lembaga-tpa" && feature.properties) {
                if (
                  (feature.properties as any)?.lintang &&
                  (feature.properties as any)?.bujur
                ) {
                  const lat = parseFloat(
                    String((feature.properties as any).lintang)
                  );
                  const lng = parseFloat(
                    String((feature.properties as any).bujur)
                  );
                  if (!isNaN(lat) && !isNaN(lng)) {
                    markerLatLng = L.latLng(lat, lng);
                  }
                }
              }

              if (
                layer.id === "tpa" &&
                feature.properties?.lat_2 &&
                feature.properties?.long_2
              ) {
                const lat = parseFloat(String(feature.properties.lat_2));
                const lng = parseFloat(String(feature.properties.long_2));
                if (!isNaN(lat) && !isNaN(lng)) {
                  markerLatLng = L.latLng(lat, lng);
                }
              }

              if (layer.id === "tpst3r" && feature.properties) {
                if (
                  feature.geometry &&
                  Array.isArray(feature.geometry.coordinates) &&
                  feature.geometry.coordinates.length >= 2
                ) {
                  const lng = feature.geometry.coordinates[0];
                  const lat = feature.geometry.coordinates[1];
                  if (
                    lat >= -8.3 &&
                    lat <= -7.8 &&
                    lng >= 112.3 &&
                    lng <= 112.8
                  ) {
                    markerLatLng = L.latLng(lat, lng);
                  }
                } else if (
                  feature.properties.lat_1 &&
                  feature.properties.long_1
                ) {
                  const lat = parseFloat(String(feature.properties.lat_1));
                  const lng = parseFloat(String(feature.properties.long_1));
                  if (!isNaN(lat) && !isNaN(lng)) {
                    markerLatLng = L.latLng(lat, lng);
                  }
                }
              }

              return L.marker(markerLatLng, { icon: customIcon });
            },
            onEachFeature: (
              feature: Feature<Point, TPST3RProperties>,
              layer: L.Layer
            ) => {
              if (feature.properties) {
                const popupContent = createPopupContent.facility(
                  feature.properties
                );
                layer.bindPopup(popupContent);
              }
            },
          }).addTo(layerGroup);

          // Fit bounds
          if (layer.id === "tpst3r") {
            mapRef.current?.setView([-7.9666, 112.6326], 10);
          } else {
            const group = L.featureGroup(Array.from(layerGroup.getLayers()));
            if (group.getBounds().isValid()) {
              mapRef.current?.fitBounds(group.getBounds(), {
                padding: [50, 50],
                maxZoom: 13,
              });
            }
          }
        }
      });
    },
    [mapRef]
  );

  const displayWasteFacilityMarkers = useCallback(
    (type: string, wasteFacilities: any) => {
      if (!mapRef.current || !wasteFacilities) return;

      const layerGroup = layerGroupsRef.current[type];
      if (!layerGroup) return;

      let facilityData: any[] = [];
      let iconPath: string;

      switch (type) {
        case "bank-sampah":
          facilityData = wasteFacilities.facilities.bankSampah;
          iconPath = "/marker/bank-sampah.svg";
          break;
        case "lembaga-tpa":
          facilityData = wasteFacilities.facilities.lembagaTpa;
          iconPath = "/marker/lembaga-tpa.svg";
          break;
        case "tpa":
          facilityData = wasteFacilities.facilities.tpa;
          iconPath = "/marker/tpa.svg";
          break;
        case "tpst3r":
          facilityData = wasteFacilities.facilities.tpst3r;
          iconPath = "/marker/tpst3r.svg";
          break;
        default:
          return;
      }

      layerGroup.clearLayers();
      facilityData.forEach((facility) => {
        const marker = L.marker([facility.latitude, facility.longitude], {
          icon: L.icon({
            iconUrl: iconPath,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          }),
        });

        const popupContent = createPopupContent.wasteFacility(facility);
        marker.bindPopup(popupContent);
        marker.addTo(layerGroup);
      });

      if (facilityData.length > 0) {
        const group = L.featureGroup(Array.from(layerGroup.getLayers()));
        mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    },
    [mapRef]
  );

  return {
    layerGroupsRef,
    initializeLayers,
    updateLayers,
    displayWasteFacilityMarkers,
  };
};
