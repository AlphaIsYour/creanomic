import React from "react";
import { FiPlay } from "react-icons/fi";

interface ActionButtonsProps {
  showStores: boolean;
  showPartners: boolean;
  loadingStores: boolean;
  loadingPartners: boolean;
  onToggleStore: () => void;
  onTogglePartner: () => void;
  onStartTour: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  showStores,
  showPartners,
  loadingStores,
  loadingPartners,
  onToggleStore,
  onTogglePartner,
  onStartTour,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-2">
      <button
        id="tombol-tampilkan-toko"
        onClick={onToggleStore}
        disabled={loadingStores}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[12px] font-semibold"
      >
        <span className="font-medium hidden sm:inline">
          {loadingStores
            ? "Memuat..."
            : showStores
              ? "SEMBUNYIKAN"
              : "TAMPILKAN"}
        </span>
        <span>TOKO</span>
      </button>

      <button
        id="tombol-tampilkan-mitra"
        onClick={onTogglePartner}
        disabled={loadingPartners}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-600 text-[12px] font-semibold"
      >
        <span className="font-medium hidden sm:inline">
          {loadingPartners
            ? "Memuat..."
            : showPartners
              ? "SEMBUNYIKAN"
              : "TAMPILKAN"}
        </span>
        <span>MITRA</span>
      </button>

      <button
        onClick={onStartTour}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-200"
      >
        <FiPlay className="w-5 h-5 fill-white" />
        <span className="font-medium text-[12px] hidden sm:inline">TUR</span>
      </button>

      <button
        disabled
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[12px]"
      >
        <span className="font-medium">KOLABORASI</span>
      </button>
    </div>
  );
};
