import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SearchBar submitting:", { query });
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-3 w-3 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lokasi, produk, pengepul, pengrajin, atau penawaran sampah..."
            className="block w-full text-[6px] pl-10 pr-3 py-3 bg-transparent text-[#2C2C2C] placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-4 py-3.5 bg-[#8C1007] text-white rounded-r-lg hover:bg-[#7a0d06] focus:outline-none transition-colors duration-200 flex items-center justify-center"
          aria-label="Search"
        >
          <FiSearch className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
};
