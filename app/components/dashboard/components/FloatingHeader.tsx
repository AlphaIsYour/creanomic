/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Filter, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { SearchBar } from "@/app/components/dashboard/components/SearchBar";
import { WasteFacilityFilter } from "@/app/components/dashboard/components/WasteFacilityFilter";

// Dynamic import DistrictLegend to avoid SSR issues with Leaflet
const DistrictLegend = dynamic(
  () =>
    import("@/app/components/dashboard/components/DistrictLegend").then(
      (mod) => ({ default: mod.DistrictLegend })
    ),
  { ssr: false }
);

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

interface LayerConfig {
  id: string;
  name: string;
  isActive: boolean;
}

interface FloatingHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onSearch: (query: string) => void;
  onFilter: (filters: string[]) => void;
  isProfileOpen: boolean;
  user?: User;
  districts?: string[];
  layers?: LayerConfig[]; // Tambah prop layers untuk waste facilities
  onLayerToggle?: (layerId: string) => void; // Tambah handler toggle
}

export function FloatingHeader({
  onMenuClick,
  onProfileClick,
  onSearch,
  onFilter,
  isProfileOpen,
  user,
  districts = [],
  layers = [],
  onLayerToggle,
}: FloatingHeaderProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isLegendHovered, setIsLegendHovered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (
        legendRef.current &&
        !legendRef.current.contains(event.target as Node)
      ) {
        setIsLegendOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLayerToggle = (layerId: string) => {
    if (onLayerToggle) {
      onLayerToggle(layerId);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-4 right-4 z-[1001] flex items-center justify-between gap-185"
    >
      {/* Left Section - Menu, Search, Filter */}
      <div className="backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-2.5 flex-1">
        <div className="flex items-center gap-2">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2.5 bg-white/80 rounded-lg shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 flex-shrink-0"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 min-w-0" id="fitur-pencarian">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Filter Button - Waste Facilities */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              onMouseEnter={() => setIsFilterHovered(true)}
              onMouseLeave={() => setIsFilterHovered(false)}
              className={`p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative ${
                isFilterOpen
                  ? "bg-[#8C1007] text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              aria-label="Filter Waste Facilities"
            >
              <Filter className="w-5 h-5" />
              {layers.filter((l) => l.isActive).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {layers.filter((l) => l.isActive).length}
                </span>
              )}
            </button>

            {/* Waste Facility Filter Dropdown */}
            <AnimatePresence>
              {(isFilterHovered || isFilterOpen) && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setIsFilterHovered(true)}
                  onMouseLeave={() => setIsFilterHovered(false)}
                  className="absolute top-full right-0 mt-2 z-[1002]"
                >
                  <WasteFacilityFilter
                    layers={layers}
                    onToggle={handleLayerToggle}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Layers Button - District Legend */}
          <div className="relative flex-shrink-0" ref={legendRef}>
            <button
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              onMouseEnter={() => setIsLegendHovered(true)}
              onMouseLeave={() => setIsLegendHovered(false)}
              className={`p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative ${
                isLegendOpen
                  ? "bg-[#8C1007] text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              aria-label="District Layers"
            >
              <Layers className="w-5 h-5" />
            </button>

            {/* District Legend on Hover or Click */}
            <AnimatePresence>
              {(isLegendHovered || isLegendOpen) && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setIsLegendHovered(true)}
                  onMouseLeave={() => setIsLegendHovered(false)}
                  className="absolute top-full right-0 mt-2 z-[1002]"
                >
                  {districts.length > 0 ? (
                    <DistrictLegend districts={districts} />
                  ) : (
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[220px]">
                      <p className="text-sm text-gray-500">
                        Tidak ada data kecamatan
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Section - Profile */}
      <div className="">
        <button
          onClick={onProfileClick}
          className={` rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0 ${
            isProfileOpen
              ? "ring-2 ring-[#8C1007] ring-offset-2 bg-white/80"
              : "bg-white/80 hover:bg-white"
          }`}
          aria-label="Profile"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#8C1007] to-[#a01008] rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
        </button>
      </div>
    </motion.div>
  );
}
