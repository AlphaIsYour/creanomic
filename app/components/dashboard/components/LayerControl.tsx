import React, { useState } from "react";
import { LayerConfig } from "@/app/components/dashboard/types/map.types";
import Image from "next/image";

interface LayerControlProps {
  layers: LayerConfig[];
  onToggleLayer: (layerId: string) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onToggleLayer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block w-full" id="fitur-kontrol-layer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white px-12 py-2 border-2 border-[#097593] bg-gradient-to-tl from-[#096B68] to-[#129990] hover:from-[#00615e] hover:to-[#017d75] rounded-[12px] shadow-lg flex items-center w-full relative"
      >
        <span className="font-medium text-[12px] flex-1 text-center">
          INFORMASI PETA
        </span>
        <svg
          className={`w-4 h-4 transition-transform absolute right-4 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg w-full z-50">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-b-0 border-gray-100"
              onClick={() => onToggleLayer(layer.id)}
            >
              <input
                type="checkbox"
                checked={layer.isActive}
                readOnly
                className="w-4 h-4 text-blue-600"
              />
              <Image
                src={layer.icon}
                alt={layer.name}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm">{layer.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
