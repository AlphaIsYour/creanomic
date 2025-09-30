/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Filter, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  onSearch: (query: string) => void;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { id: "waste_post", label: "Postingan Sampah", color: "bg-green-500" },
    { id: "craft_request", label: "Request Kerajinan", color: "bg-blue-500" },
    { id: "pengepul", label: "Pengepul", color: "bg-yellow-500" },
    { id: "pengrajin", label: "Pengrajin", color: "bg-purple-500" },
  ];

  // Close filter dropdown when clicking outside
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((f) => f !== filterId)
      : [...selectedFilters, filterId];

    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    searchRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-3 left-3 right-3 z-50"
    >
      <div className="backdrop-blur-[4px] rounded-xl shadow-md border border-white/20 p-3">
        <div className="flex items-center space-x-3">
          {/* Menu Button with Hover */}
          <div
            ref={menuRef}
            onMouseEnter={() => onMenuClick()}
            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            <Menu className="w-4 h-4 text-gray-700" />
          </div>

          {/* Search Bar - Smaller */}
          <div className="flex-1 relative">
            <div
              className={`flex items-center bg-white rounded-[13px] shadow-sm border-2 transition-all duration-200 ${
                isSearchFocused
                  ? "border-[#8C1007] shadow-md"
                  : "border-transparent"
              }`}
            >
              <div className="flex-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-gray-400 ml-3" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Cari lokasi, pengguna, atau postingan..."
                  className="w-full px-2 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search Button - Smaller */}
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="px-3 py-2 bg-[#8C1007] text-white rounded-r-lg hover:bg-[#8C1007]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:block text-sm">Cari</span>
              </button>
            </div>

            {/* Search suggestions dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 max-h-48 overflow-y-auto"
                >
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Saran pencarian akan muncul di sini...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Button with Hover */}
          <div className="relative" ref={filterRef}>
            <div
              onMouseEnter={() => setIsFilterOpen(true)}
              onMouseLeave={() => setIsFilterOpen(false)}
              className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative ${
                selectedFilters.length > 0
                  ? "bg-[#8C1007] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              {selectedFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {selectedFilters.length}
                </span>
              )}
            </div>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onMouseEnter={() => setIsFilterOpen(true)}
                  onMouseLeave={() => setIsFilterOpen(false)}
                  className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[180px]"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-700">
                      Filter Tampilan
                    </p>
                  </div>

                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterToggle(option.id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${option.color}`}
                      ></div>
                      <span className="text-xs text-gray-700">
                        {option.label}
                      </span>
                      {selectedFilters.includes(option.id) && (
                        <div className="ml-auto w-1.5 h-1.5 bg-[#8C1007] rounded-full"></div>
                      )}
                    </button>
                  ))}

                  {selectedFilters.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 mt-2"></div>
                      <button
                        onClick={() => {
                          setSelectedFilters([]);
                          onFilter([]);
                        }}
                        className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Hapus Semua Filter
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Button with Hover */}
          <div
            ref={profileRef}
            onMouseEnter={() => onProfileClick()}
            className={`p-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
              isProfileOpen
                ? "bg-[#8C1007] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 rounded-lg flex items-center justify-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
