/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import {
  Store,
  Partner,
  WasteFacility,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

// Tambahkan tipe response yang hilang
interface StoreResponse {
  stores: Store[];
}

interface PartnerResponse {
  partners: Partner[];
}

export const useMapData = (mapRef: React.MutableRefObject<L.Map | null>) => {
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [wasteFacilities, setWasteFacilities] = useState<any>(null);

  const storeLayerRef = useRef<L.LayerGroup | null>(null);
  const partnerLayerRef = useRef<L.LayerGroup | null>(null);

  const fetchWasteFacilities = async () => {
    if (wasteFacilities || loadingFacilities) return;
    setLoadingFacilities(true);
    try {
      const response = await axios.get("/api/waste-facilities");
      setWasteFacilities(response.data);
    } catch (error) {
      console.error("Error loading waste facilities:", error);
    } finally {
      setLoadingFacilities(false);
    }
  };

  const loadStores = async () => {
    if (!mapRef.current || !storeLayerRef.current) {
      return;
    }

    setLoadingStores(true);

    try {
      const storeResponse = await axios.get<StoreResponse>("/api/stores");
      const { stores } = storeResponse.data;

      if (!stores || stores.length === 0) {
        return;
      }

      storeLayerRef.current.clearLayers();

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

          // Use the updated popup template
          const popupContent = createPopupContent.store(store);

          marker.bindPopup(popupContent, {
            minWidth: 256,
            className: "custom-popup",
          });
          marker.addTo(storeLayerRef.current!);
        }
      });
    } catch (error) {
      console.error("Error loading stores:", error);
      setShowStores(false);
    } finally {
      setLoadingStores(false);
    }
  };

  const loadPartners = async () => {
    if (!mapRef.current || !partnerLayerRef.current) {
      return;
    }

    setLoadingPartners(true);

    try {
      const partnerResponse = await axios.get<PartnerResponse>("/api/partners");
      const { partners } = partnerResponse.data;

      if (!partners || partners.length === 0) {
        return;
      }

      partnerLayerRef.current.clearLayers();

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

          // Use the updated popup template
          const popupContent = createPopupContent.partner(partner);

          marker.bindPopup(popupContent, {
            minWidth: 288,
            maxWidth: 320,
            className: "custom-popup",
          });
          marker.addTo(partnerLayerRef.current!);
        }
      });
    } catch (error) {
      console.error("Error loading partners:", error);
      setShowPartners(false);
    } finally {
      setLoadingPartners(false);
    }
  };

  return {
    loadingStores,
    loadingPartners,
    loadingFacilities,
    showStores,
    showPartners,
    wasteFacilities,
    storeLayerRef,
    partnerLayerRef,
    setShowStores,
    setShowPartners,
    fetchWasteFacilities,
    loadStores,
    loadPartners,
  };
};
