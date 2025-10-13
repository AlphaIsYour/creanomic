import React from "react";
import { getDistrictColor } from "@/app/components/dashboard/utils/mapUtils";

interface DistrictLegendProps {
  districts: string[];
}

export const DistrictLegend: React.FC<DistrictLegendProps> = ({
  districts,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-[400px]">
      <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">
        Daftar Kecamatan
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[400px] overflow-y-auto pr-2">
        {districts.sort().map((name) => {
          const colors = getDistrictColor(name);
          return (
            <div key={name} className="flex items-center gap-2">
              <div
                style={{
                  background: colors.fillColor,
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span className="text-xs text-gray-700 truncate">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
