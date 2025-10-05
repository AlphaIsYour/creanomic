import axios from "axios";
import {
  StoreResponse,
  PartnerResponse,
  WasteFacilitiesResponse,
} from "@/app/components/dashboard/types/map.types";

export const mapServices = {
  async fetchStores(): Promise<StoreResponse> {
    const response = await axios.get<StoreResponse>("/api/stores");
    return response.data;
  },

  async fetchPartners(): Promise<PartnerResponse> {
    const response = await axios.get<PartnerResponse>("/api/partners");
    return response.data;
  },

  async fetchWasteFacilities(): Promise<WasteFacilitiesResponse> {
    const response = await axios.get<WasteFacilitiesResponse>(
      "/api/waste-facilities"
    );
    return response.data;
  },
};
