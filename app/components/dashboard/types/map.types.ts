/* eslint-disable @typescript-eslint/no-explicit-any */
// types/map.types.ts

export interface Pengepul {
  id: string;
  userId: string;
  companyName: string | null;
  licenseNumber: string | null;
  specializedMaterials: string[];
  operatingArea: string[];
  operatingRadius: number | null;
  description: string | null;
  website: string | null;
  workingHours: string | null;
  priceList: any;
  totalCollections: number;
  totalWeight: number;
  averageRating: number;
  totalReviews: number;
  whatsappNumber: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    phone: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}

export interface Pengrajin {
  id: string;
  userId: string;
  craftTypes: string[];
  specializedMaterials: string[];
  portfolio: string[];
  workshopAddress: string | null;
  workshopLatitude: number | null;
  workshopLongitude: number | null;
  averageRating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  description: string | null;
  instagramHandle: string | null;
  whatsappNumber: string | null;
  yearsOfExperience: number | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    phone: string | null;
  };
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
  nama: string;
  desa?: string;
  kecamatan?: string;
  lat_1?: string;
  long_1?: string;
  lat_2?: string;
  long_2?: string;
  kapasitas_?: string;
}

export interface Product {
  name: string;
  description?: string;
  image?: string;
}

export interface WasteOffer {
  id: string;
  title: string;
  description: string;
  materialType: string;
  weight: number | null;
  images: string[];
  address: string;
  latitude: number;
  longitude: number;
  offerType: "SELL" | "DONATE";
  status: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface LayerConfig {
  id: string;
  name: string;
  data: any;
  icon: string;
  isActive: boolean;
}

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

export interface SearchMode {
  type: "pengepul" | "pengrajin" | "waste-offers";
  label: string;
}