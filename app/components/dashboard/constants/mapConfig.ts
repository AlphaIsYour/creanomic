/* eslint-disable @typescript-eslint/no-explicit-any */
import malangBoundaries from "../json/malang.json";
import bankSampah from "../json/bank-sampah.json";
import lembagaTpa from "../json/lembaga-tpa.json";
import tpa from "../json/tpa.json";
import tpst3r from "../json/tpst3r.json";

export const typedMalangBoundaries = malangBoundaries as any;
export const typedBankSampah = bankSampah as any;
export const typedLembagaTpa = lembagaTpa as any;
export const typedTpa = tpa as any;
export const typedTpst3r = tpst3r as any;

export const layerConfigs = [
  {
    id: "bank-sampah",
    name: "Bank Sampah",
    data: typedBankSampah,
    icon: "/marker/bank-sampah.svg",
    isActive: false,
  },
  {
    id: "lembaga-tpa",
    name: "Lembaga TPA",
    data: typedLembagaTpa,
    icon: "/marker/lembaga-tpa.svg",
    isActive: false,
  },
  {
    id: "tpa",
    name: "TPA",
    data: typedTpa,
    icon: "/marker/tpa.svg",
    isActive: false,
  },
  {
    id: "tpst3r",
    name: "TPST3R",
    data: typedTpst3r,
    icon: "/marker/tpst3r.svg",
    isActive: false,
  },
];

// NEW: Product marker configuration
export const entityMarkerConfigs = {
  wasteOffer: {
    icon: "/marker/products.svg",
    iconSize: [32, 32] as [number, number],
    iconAnchor: [16, 32] as [number, number],
    popupAnchor: [0, -32] as [number, number],
  },
  pengepul: {
    icon: "/marker/pengepul.svg",
    iconSize: [32, 32] as [number, number],
    iconAnchor: [16, 32] as [number, number],
    popupAnchor: [0, -32] as [number, number],
  },
  pengrajin: {
    icon: "/marker/pengrajin.svg",
    iconSize: [32, 32] as [number, number],
    iconAnchor: [16, 32] as [number, number],
    popupAnchor: [0, -32] as [number, number],
  },
};
