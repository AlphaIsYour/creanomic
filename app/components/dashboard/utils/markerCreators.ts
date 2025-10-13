import L from "leaflet";
import {
  Pengepul,
  Pengrajin,
  WasteOffer,
  WasteFacility,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

export const markerCreators = {
  createPengepulMarkers: (pengepuls: Pengepul[], layerGroup: L.LayerGroup) => {
    layerGroup.clearLayers();

    pengepuls.forEach((pengepul: Pengepul) => {
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
          minWidth: 288,
          maxWidth: 320,
          className: "pengepul-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },

  createPengrajinMarkers: (
    pengrajins: Pengrajin[],
    layerGroup: L.LayerGroup
  ) => {
    layerGroup.clearLayers();

    pengrajins.forEach((pengrajin: Pengrajin) => {
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
          className: "pengrajin-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },

  createWasteOfferMarkers: (
    wasteOffers: WasteOffer[],
    layerGroup: L.LayerGroup
  ) => {
    layerGroup.clearLayers();

    wasteOffers.forEach((offer: WasteOffer) => {
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
          minWidth: 288,
          maxWidth: 320,
          className: "waste-offer-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },

  createWasteFacilityMarkers: (
    facilities: WasteFacility[],
    layerGroup: L.LayerGroup,
    iconPath: string
  ) => {
    layerGroup.clearLayers();

    facilities.forEach((facility: WasteFacility) => {
      if (facility.latitude && facility.longitude) {
        const marker = L.marker([facility.latitude, facility.longitude], {
          icon: L.icon({
            iconUrl: iconPath,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          }),
        });

        const popupContent = createPopupContent.wasteFacility(facility);
        marker.bindPopup(popupContent, {
          minWidth: 280,
          maxWidth: 320,
          className: "waste-facility-popup",
        });
        marker.addTo(layerGroup);
      }
    });
  },
};
