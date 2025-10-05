/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import {
  Store,
  Partner,
  Product,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

export const markerCreators = {
  createStoreMarkers: (stores: Store[], layerGroup: L.LayerGroup) => {
    layerGroup.clearLayers();

    stores.forEach((store: Store) => {
      if (store.latitude && store.longitude) {
        const markerIcon = L.icon({
          iconUrl: "/marker/store.svg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([store.latitude, store.longitude], {
          icon: markerIcon,
        });

        const popupContent = createPopupContent.store(store);
        marker.bindPopup(popupContent, { minWidth: 256 });
        marker.addTo(layerGroup);
      }
    });
  },

  createPartnerMarkers: (partners: Partner[], layerGroup: L.LayerGroup) => {
    layerGroup.clearLayers();

    partners.forEach((partner: Partner) => {
      if (partner.latitude && partner.longitude) {
        const markerIcon = L.icon({
          iconUrl: "/marker/mitra.svg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([partner.latitude, partner.longitude], {
          icon: markerIcon,
        });

        const popupContent = createPopupContent.partner(partner);
        marker.bindPopup(popupContent, {
          minWidth: 288,
          maxWidth: 320,
          className: "custom-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },

  // NEW: Create product markers for stores selling specific products
  createProductMarkers: (
    stores: Store[],
    product: Product,
    layerGroup: L.LayerGroup
  ) => {
    layerGroup.clearLayers();

    stores.forEach((store: Store) => {
      if (store.latitude && store.longitude) {
        const markerIcon = L.icon({
          iconUrl: "/marker/products.svg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([store.latitude, store.longitude], {
          icon: markerIcon,
        });

        const popupContent = createPopupContent.productStore(store, product);
        marker.bindPopup(popupContent, {
          minWidth: 256,
          className: "product-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },

  createWasteFacilityMarkers: (
    facilities: any[],
    layerGroup: L.LayerGroup,
    iconPath: string
  ) => {
    layerGroup.clearLayers();

    facilities.forEach((facility) => {
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
  },
};
