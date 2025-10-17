import React from "react";
import { FiPlay } from "react-icons/fi";

interface ActionButtonsProps {
  showPengepuls: boolean;
  showPengrajins: boolean;
  showWasteOffers: boolean;
  loadingPengepuls: boolean;
  loadingPengrajins: boolean;
  loadingWasteOffers: boolean;
  onTogglePengepul: () => void;
  onTogglePengrajin: () => void;
  onToggleWasteOffer: () => void;
  onStartTour: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  showPengepuls,
  showPengrajins,
  showWasteOffers,
  loadingPengepuls,
  loadingPengrajins,
  loadingWasteOffers,
  onTogglePengepul,
  onTogglePengrajin,
  onToggleWasteOffer,
  onStartTour,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-2">
      <button
        id="tombol-tampilkan-waste-offers"
        onClick={onToggleWasteOffer}
        disabled={loadingWasteOffers}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[12px] font-semibold"
      >
        <span className="font-medium hidden sm:inline">
          {loadingWasteOffers
            ? "Loading..."
            : showWasteOffers
            ? "SEMBUNYIKAN"
            : "TAMPILKAN"}
        </span>
        <span>WASTE OFFERS</span>
      </button>

      <button
        id="tombol-tampilkan-pengepul"
        onClick={onTogglePengepul}
        disabled={loadingPengepuls}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[12px] font-semibold"
      >
        <span className="font-medium hidden sm:inline">
          {loadingPengepuls
            ? "Loading..."
            : showPengepuls
            ? "SEMBUNYIKAN"
            : "TAMPILKAN"}
        </span>
        <span>PENGEPUL</span>
      </button>

      <button
        id="tombol-tampilkan-pengrajin"
        onClick={onTogglePengrajin}
        disabled={loadingPengrajins}
        className="px-4 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] text-white rounded-[12px] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-600 text-[12px] font-semibold"
      >
        <span className="font-medium hidden sm:inline">
          {loadingPengrajins
            ? "Loading..."
            : showPengrajins
            ? "SEMBUNYIKAN"
            : "TAMPILKAN"}
        </span>
        <span>PENGRAJIN</span>
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
