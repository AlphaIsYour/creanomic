// components/waste-offers/WasteOfferFilter.tsx
"use client";

import {
  MaterialType,
  OfferType,
  MATERIAL_TYPE_LABELS,
  OFFER_TYPE_LABELS,
} from "@/types/waste-offer";

interface WasteOfferFilterProps {
  materialType?: MaterialType | "";
  offerType?: OfferType | "";
  search?: string;
  onMaterialTypeChange: (value: MaterialType | "") => void;
  onOfferTypeChange: (value: OfferType | "") => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function WasteOfferFilter({
  materialType,
  offerType,
  search,
  onMaterialTypeChange,
  onOfferTypeChange,
  onSearchChange,
  onReset,
}: WasteOfferFilterProps) {
  const hasActiveFilters = materialType || offerType || search;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filter & Pencarian</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-[#8C1007] hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Cari
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari penawaran..."
              value={search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Jenis Material
          </label>
          <select
            value={materialType || ""}
            onChange={(e) =>
              onMaterialTypeChange(e.target.value as MaterialType | "")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
          >
            <option value="">Semua Material</option>
            {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Offer Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tipe Penawaran
          </label>
          <select
            value={offerType || ""}
            onChange={(e) =>
              onOfferTypeChange(e.target.value as OfferType | "")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
          >
            <option value="">Semua Tipe</option>
            {Object.entries(OFFER_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
