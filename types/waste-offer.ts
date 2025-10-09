// types/waste-offer.ts
export type MaterialType =
  | "PLASTIC"
  | "GLASS"
  | "METAL"
  | "PAPER"
  | "CARDBOARD"
  | "ELECTRONIC"
  | "TEXTILE"
  | "WOOD"
  | "RUBBER"
  | "ORGANIC"
  | "OTHER";

export type OfferType = "SELL" | "DONATE";

export type OfferStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "TAKEN"
  | "COMPLETED"
  | "CANCELLED";

export interface WasteOffer {
  id: string;
  title: string;
  description: string;
  materialType: MaterialType;
  weight?: number;
  images: string[];
  condition?: string;
  address: string;
  latitude: number;
  longitude: number;
  offerType: OfferType;
  suggestedPrice?: number;
  status: OfferStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  reservedAt?: Date | string | null;
  takenAt?: Date | string | null;
  completedAt?: Date | string | null;
  userId: string;
  pengepulId?: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    phone: string | null;
  };
  pengepul?: {
    id: string;
    companyName: string | null;
    user: {
      name: string | null;
      phone: string | null;
    };
  } | null;
}

export interface CreateWasteOfferInput {
  title: string;
  description: string;
  materialType: MaterialType;
  weight?: number;
  images: string[];
  condition?: string;
  address: string;
  latitude: number;
  longitude: number;
  offerType: OfferType;
  suggestedPrice?: number;
}

export interface UpdateWasteOfferInput extends Partial<CreateWasteOfferInput> {
  status?: OfferStatus;
}

export interface WasteOfferFilters {
  materialType?: MaterialType;
  offerType?: OfferType;
  status?: OfferStatus;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in km
}

export interface OfferStats {
  activeCount: number;
  availableSlots: number;
  totalCompleted: number;
  totalCancelled: number;
}

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  PLASTIC: "Plastik",
  GLASS: "Kaca",
  METAL: "Logam",
  PAPER: "Kertas",
  CARDBOARD: "Kardus",
  ELECTRONIC: "Elektronik",
  TEXTILE: "Tekstil",
  WOOD: "Kayu",
  RUBBER: "Karet",
  ORGANIC: "Organik",
  OTHER: "Lainnya",
};

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  SELL: "Jual",
  DONATE: "Donasi",
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  AVAILABLE: "Tersedia",
  RESERVED: "Direservasi",
  TAKEN: "Diambil",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const MAX_ACTIVE_OFFERS = 3;
export const MAX_IMAGES = 3;
