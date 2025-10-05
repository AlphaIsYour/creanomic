/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/app/components/dashboard/components/SearchBar";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

interface FloatingHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onSearch: (query: string, searchType: "location" | "product") => void;
  onFilter: (filters: string[]) => void;
  isProfileOpen: boolean;
  user?: User;
}

export function FloatingHeader({
  onMenuClick,
  onProfileClick,
  onSearch,
  onFilter,
  isProfileOpen,
  user,
}: FloatingHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { id: "waste_post", label: "Postingan Sampah", color: "bg-green-500" },
    { id: "craft_request", label: "Request Kerajinan", color: "bg-blue-500" },
    { id: "pengepul", label: "Pengepul", color: "bg-yellow-500" },
    { id: "pengrajin", label: "Pengrajin", color: "bg-purple-500" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((f) => f !== filterId)
      : [...selectedFilters, filterId];

    setSelectedFilters(newFilters);
    onFilter(newFilters);
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

          {/* Filter Button */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative ${
                selectedFilters.length > 0
                  ? "bg-[#8C1007] text-white hover:bg-[#7a0d06]"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              aria-label="Filter"
            >
              <Filter className="w-5 h-5" />
              {selectedFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                  {selectedFilters.length}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px] overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Filter Tampilan
                    </p>
                  </div>

                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterToggle(option.id)}
                        className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${option.color} group-hover:scale-110 transition-transform flex-shrink-0`}
                        ></div>
                        <span className="text-sm text-gray-700 flex-1">
                          {option.label}
                        </span>
                        {selectedFilters.includes(option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-[#8C1007] rounded-full flex items-center justify-center flex-shrink-0"
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedFilters.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setSelectedFilters([]);
                          onFilter([]);
                        }}
                        className="w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        Hapus Semua Filter
                      </button>
                    </>
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
