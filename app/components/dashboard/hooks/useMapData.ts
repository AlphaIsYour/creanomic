/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback, useEffect } from "react";
import L from "leaflet";
import axios from "axios";
import { toast } from "sonner";
import {
  Pengepul,
  Pengrajin,
  WasteOffer,
  WasteFacility,
  WasteFacilitiesResponse,
} from "@/app/components/dashboard/types/map.types";
import { createPopupContent } from "@/app/components/dashboard/utils/popupTemplates";

// Response types
interface PengepulResponse {
  pengepuls: Pengepul[];
}

interface PengrajinResponse {
  pengrajins: Pengrajin[];
}

interface WasteOfferResponse {
  wasteOffers: WasteOffer[];
}

interface LoadingState {
  pengepuls: boolean;
  pengrajins: boolean;
  wasteOffers: boolean;
  facilities: boolean;
}

export const useMapData = (mapRef: React.MutableRefObject<L.Map | null>) => {
  const [loading, setLoading] = useState<LoadingState>({
    pengepuls: false,
    pengrajins: false,
    wasteOffers: false,
    facilities: false,
  });
  const [showPengepuls, setShowPengepuls] = useState(false);
  const [showPengrajins, setShowPengrajins] = useState(false);
  const [showWasteOffers, setShowWasteOffers] = useState(false);

  const [wasteFacilities, setWasteFacilities] = useState<
    WasteFacilitiesResponse["facilities"] | null
  >(null);

  // Cache untuk data yang sudah di-fetch
  const pengepulsCacheRef = useRef<Pengepul[] | null>(null);
  const pengrajinsCacheRef = useRef<Pengrajin[] | null>(null);
  const wasteOffersCacheRef = useRef<WasteOffer[] | null>(null);

  // Layer refs - INI YANG DIPAKE, bukan di MapDisplay.tsx
  const pengepulLayerRef = useRef<L.LayerGroup | null>(null);
  const pengrajinLayerRef = useRef<L.LayerGroup | null>(null);
  const wasteOfferLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize layers (dipanggil dari MapDisplay setelah map ready)
  const initializeLayers = useCallback(() => {
    if (!mapRef.current) return;

    if (!pengepulLayerRef.current) {
      pengepulLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
    if (!pengrajinLayerRef.current) {
      pengrajinLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
    if (!wasteOfferLayerRef.current) {
      wasteOfferLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, [mapRef]);

  const fetchWasteFacilities = async () => {
    if (wasteFacilities || loading.facilities) return;

    setLoading((prev) => ({ ...prev, facilities: true }));
    try {
      const response = await axios.get<WasteFacilitiesResponse>(
        "/api/waste-facilities"
      );
      setWasteFacilities(response.data.facilities);

      const total =
        response.data.facilities.bankSampah.length +
        response.data.facilities.lembagaTpa.length +
        response.data.facilities.tpa.length +
        response.data.facilities.tpst3r.length;

      toast.success(`${total} waste facilities loaded successfully`);
    } catch (error) {
      console.error("Error loading waste facilities:", error);
      toast.error("Failed to load waste facilities");
    } finally {
      setLoading((prev) => ({ ...prev, facilities: false }));
    }
  };

  const loadPengepuls = useCallback(async () => {
    if (!mapRef.current || !pengepulLayerRef.current) {
      console.log("Map or layer not ready");
      return;
    }

    // Gunakan cache jika ada
    if (pengepulsCacheRef.current) {
      renderPengepuls(pengepulsCacheRef.current);
      return;
    }

    setLoading((prev) => ({ ...prev, pengepuls: true }));

    try {
      const response = await axios.get<PengepulResponse>("/api/pengepuls");
      const { pengepuls } = response.data;

      if (!pengepuls || pengepuls.length === 0) {
        toast.info("No pengepuls found");
        return;
      }

      pengepulsCacheRef.current = pengepuls;
      renderPengepuls(pengepuls);
      toast.success(`Loaded ${pengepuls.length} pengepuls`);
    } catch (error) {
      console.error("Error loading pengepuls:", error);
      toast.error("Failed to load pengepuls");
      setShowPengepuls(false);
    } finally {
      setLoading((prev) => ({ ...prev, pengepuls: false }));
    }
  }, [mapRef]);

  const renderPengepuls = (pengepuls: Pengepul[]) => {
    if (!pengepulLayerRef.current) return;

    pengepulLayerRef.current.clearLayers();

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
          minWidth: 280,
          maxWidth: 320,
          className: "custom-popup",
        });
        marker.addTo(pengepulLayerRef.current!);
      }
    });
  };

  const loadPengrajins = useCallback(async () => {
    if (!mapRef.current || !pengrajinLayerRef.current) {
      console.log("Map or layer not ready");
      return;
    }

    if (pengrajinsCacheRef.current) {
      renderPengrajins(pengrajinsCacheRef.current);
      return;
    }

    setLoading((prev) => ({ ...prev, pengrajins: true }));

    try {
      const response = await axios.get<PengrajinResponse>("/api/pengrajins");
      const { pengrajins } = response.data;

      if (!pengrajins || pengrajins.length === 0) {
        toast.info("No pengrajins found");
        return;
      }

      pengrajinsCacheRef.current = pengrajins;
      renderPengrajins(pengrajins);
      toast.success(`Loaded ${pengrajins.length} pengrajins`);
    } catch (error) {
      console.error("Error loading pengrajins:", error);
      toast.error("Failed to load pengrajins");
      setShowPengrajins(false);
    } finally {
      setLoading((prev) => ({ ...prev, pengrajins: false }));
    }
  }, [mapRef]);

  const renderPengrajins = (pengrajins: Pengrajin[]) => {
    if (!pengrajinLayerRef.current) return;

    pengrajinLayerRef.current.clearLayers();

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
          className: "custom-popup",
        });
        marker.addTo(pengrajinLayerRef.current!);
      }
    });
  };

  // NEW: Load Waste Offers
  const loadWasteOffers = useCallback(async () => {
    if (!mapRef.current || !wasteOfferLayerRef.current) {
      console.log("Map or layer not ready");
      return;
    }

    if (wasteOffersCacheRef.current) {
      renderWasteOffers(wasteOffersCacheRef.current);
      return;
    }

    setLoading((prev) => ({ ...prev, wasteOffers: true }));

    try {
      const response = await axios.get<WasteOfferResponse | WasteOffer[]>(
        "/api/waste-offers"
      );

      // Handle different response structures
      let wasteOffers: WasteOffer[];

      if (Array.isArray(response.data)) {
        // Response is direct array: [...]
        wasteOffers = response.data;
      } else if ((response.data as WasteOfferResponse).wasteOffers) {
        // Response has wasteOffers property: { wasteOffers: [...] }
        wasteOffers = (response.data as WasteOfferResponse).wasteOffers;
      } else {
        console.error("Unexpected response structure:", response.data);
        toast.error("Failed to parse waste offers data");
        return;
      }

      if (!wasteOffers || wasteOffers.length === 0) {
        toast.info("No waste offers found");
        return;
      }

      wasteOffersCacheRef.current = wasteOffers;
      renderWasteOffers(wasteOffers);
      toast.success(`Loaded ${wasteOffers.length} waste offers`);
    } catch (error) {
      console.error("Error loading waste offers:", error);
      toast.error("Failed to load waste offers");
      setShowWasteOffers(false);
    } finally {
      setLoading((prev) => ({ ...prev, wasteOffers: false }));
    }
  }, [mapRef]);

  const renderWasteOffers = (wasteOffers: WasteOffer[]) => {
    if (!wasteOfferLayerRef.current) return;

    wasteOfferLayerRef.current.clearLayers();

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
          className: "custom-popup",
        });
        marker.addTo(wasteOfferLayerRef.current!);
      }
    });
  };

  const cleanup = useCallback(() => {
    pengepulLayerRef.current?.clearLayers();
    pengrajinLayerRef.current?.clearLayers();
    wasteOfferLayerRef.current?.clearLayers();
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
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
    cleanup,
  };
};
