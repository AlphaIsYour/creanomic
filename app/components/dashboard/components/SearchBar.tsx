/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiSearch, FiMapPin, FiPackage } from "react-icons/fi";
import { SearchMode } from "@/app/components/dashboard/types/map.types";

interface SearchBarProps {
  onSearch: (query: string, searchType: "location" | "product") => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"location" | "product">(
    "location"
  );

  const searchModes: { type: "location" | "product"; label: string }[] = [
    { type: "location", label: "Lokasi" },
    { type: "product", label: "Produk" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SearchBar submitting:", { query, searchMode });
    onSearch(query, searchMode);
  };

  const getPlaceholder = () => {
    return searchMode === "location"
      ? "Cari pengepul, pengrajin, atau wilayah..."
      : "Cari produk kerajinan yang tersedia...";
  };

  const getIcon = () => {
    return searchMode === "location" ? (
      <FiMapPin className="h-4 w-4" />
    ) : (
      <FiPackage className="h-4 w-4" />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg shadow-sm  overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Search Mode Toggle */}
        <div className="flex bg-[#F4E1D2]/30 ">
          {searchModes.map((mode, index) => (
            <button
              key={mode.type}
              type="button"
              onClick={() => {
                console.log("Switching to search mode:", mode.type);
                setSearchMode(mode.type);
              }}
              className={`px-2 py-2 text-xs font-medium transition-all duration-200 relative ${
                searchMode === mode.type
                  ? "bg-[#8C1007] text-white"
                  : "text-[#2C2C2C] hover:bg-[#F4E1D2]/50"
              } ${index === 0 ? "rounded-l-lg" : ""}`}
            >
              <div className="flex items-center gap-1.5">
                {mode.type === "location" ? (
                  <FiMapPin className="h-3 w-3" />
                ) : (
                  <FiPackage className="h-3 w-3" />
                )}
                <span className="hidden sm:inline whitespace-nowrap">
                  {mode.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-3 w-3 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="block w-full text-sm pl-9 pr-3 py-2 bg-transparent text-[#2C2C2C] placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-3 py-3 bg-[#8C1007] text-white rounded-r-lg hover:bg-[#7a0d06] focus:outline-none transition-colors duration-200 flex items-center justify-center"
          aria-label="Search"
        >
          {getIcon()}
        </button>
      </div>
    </form>
  );
};
