/* eslint-disable @typescript-eslint/no-explicit-any */
import { Step } from "react-joyride";

export interface Store {
  userId: string;
  id: string;
  storeName: string;
  location: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  bannerUrl?: string | null;
  slug: string;
}

export interface Partner {
  id: string;
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  expertise: string[];
}

export interface WasteFacility {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface TPST3RProperties {
  no?: number;
  nama?: string;
  alamat?: string;
  desa?: string;
  kecamatan?: string;
  kapasitas_?: number;
  lat_1?: string;
  long_1?: string;
  lat_2?: string;
  long_2?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  slug: string;
  category: string;
  subcategory?: string;
}

export interface ProductSearchResult {
  product: Product;
  stores: Store[];
}

export interface SearchMode {
  type: "location" | "product";
  label: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  data: any;
  icon: string;
  isActive: boolean;
}

// NEW: Routing interfaces
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  coordinates: [number, number][];
}

export interface StoreResponse {
  stores: Store[];
  message: string;
}

export interface PartnerResponse {
  partners: Partner[];
  message: string;
}

export interface WasteFacilitiesResponse {
  facilities: {
    bankSampah: WasteFacility[];
    lembagaTpa: WasteFacility[];
    tpa: WasteFacility[];
    tpst3r: WasteFacility[];
  };
  message: string;
}

export interface ProductSearchResponse {
  products: Product[];
  message: string;
}

export interface StoresByProductResponse {
  stores: Store[];
  product: Product;
  message: string;
}

export interface StoryStep extends Step {
  mapAction?: {
    center: L.LatLngExpression;
    zoom: number;
  };
}
