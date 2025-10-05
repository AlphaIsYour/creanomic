import React from "react";
import { getDistrictColor } from "@/app/components/dashboard/utils/mapUtils";

interface DistrictLegendProps {
  districts: string[];
}

export const DistrictLegend: React.FC<DistrictLegendProps> = ({
  districts,
}) => {
  return (
    <div className="p-[12px] -mt-4 rounded-xl ">
      <div className="h-[40vh] sm:h-[72vh] w-full rounded-lg bg-white shadow-lg p-4">
        <h4 className="font-medium mb-3 ">Daftar Kecamatan : </h4>
        <div className="space-y-2 max-h-[210px] sm:max-h-[62vh] overflow-y-auto">
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
                  }}
                />
                <span className="text-sm ">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
