import { motion } from "framer-motion";
import { MapPin, Building2, Trash2, Recycle } from "lucide-react";

interface WasteFacilityFilterProps {
  layers: Array<{
    id: string;
    name: string;
    isActive: boolean;
  }>;
  onToggle: (layerId: string) => void;
}

export function WasteFacilityFilter({
  layers,
  onToggle,
}: WasteFacilityFilterProps) {
  const getIcon = (layerId: string) => {
    switch (layerId) {
      case "bank-sampah":
        return <Recycle className="w-4 h-4" />;
      case "lembaga-tpa":
        return <Building2 className="w-4 h-4" />;
      case "tpa":
        return <Trash2 className="w-4 h-4" />;
      case "tpst3r":
        return <MapPin className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getColor = (layerId: string) => {
    switch (layerId) {
      case "bank-sampah":
        return "from-[#C1895D] to-[#763D18]"; // coklat muda ke coklat tua
      case "lembaga-tpa":
        return "from-[#A27AD8] to-[#3F1185]"; // ungu muda ke ungu tua
      case "tpa":
        return "from-[#9AA2A5] to-[#485356]"; // abu muda ke abu tua
      case "tpst3r":
        return "from-[#FFAD66] to-[#E15700]"; // oranye muda ke oranye tua
      default:
        return "from-gray-400 to-slate-600"; // soft gray ke slate
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[260px]"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Fasilitas Pengelolaan Sampah
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Pilih fasilitas untuk ditampilkan
        </p>
      </div>

      {/* Filter Items */}
      <div className="p-2 space-y-1">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              layer.isActive
                ? "bg-gradient-to-r " +
                  getColor(layer.id) +
                  " text-white shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-md ${
                  layer.isActive ? "bg-white/20" : "bg-white"
                }`}
              >
                {getIcon(layer.id)}
              </div>
              <span className="text-sm font-medium">{layer.name}</span>
            </div>

            {/* Toggle Indicator */}
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                layer.isActive ? "bg-white/30" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                  layer.isActive
                    ? "translate-x-5 bg-white"
                    : "translate-x-0.5 bg-white"
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {layers.filter((l) => l.isActive).length} dari {layers.length} aktif
        </p>
      </div>
    </motion.div>
  );
}
