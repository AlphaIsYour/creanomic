import axios from "axios";
import {
  Pengepul,
  Pengrajin,
  WasteOffer,
  WasteFacilitiesResponse,
} from "@/app/components/dashboard/types/map.types";

// Response interfaces
export interface PengepulResponse {
  pengepuls: Pengepul[];
  message: string;
}

export interface PengrajinResponse {
  pengrajins: Pengrajin[];
  message: string;
}

export interface WasteOfferResponse {
  wasteOffers: WasteOffer[];
  message: string;
}

export const mapServices = {
  async fetchPengepuls(): Promise<PengepulResponse> {
    const response = await axios.get<PengepulResponse>("/api/pengepuls");
    return response.data;
  },

  async fetchPengrajins(): Promise<PengrajinResponse> {
    const response = await axios.get<PengrajinResponse>("/api/pengrajins");
    return response.data;
  },

  async fetchWasteOffers(): Promise<WasteOfferResponse> {
    const response = await axios.get<WasteOfferResponse>("/api/waste-offers");
    return response.data;
  },

  async fetchWasteFacilities(): Promise<WasteFacilitiesResponse> {
    const response = await axios.get<WasteFacilitiesResponse>(
      "/api/waste-facilities"
    );
    return response.data;
  },
};
