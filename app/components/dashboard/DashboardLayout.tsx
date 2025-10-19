/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { FloatingHeader } from "@/app/components/dashboard/components/FloatingHeader";
import { SidebarPopup } from "@/app/components/dashboard/components/SidebarPopup";
import { ProfilePopup } from "@/app/components/dashboard/components/ProfilePopup";
import ChatbotWrapper from "@/app/components/ChatbotWrapper";

// Dynamic import MapDisplay with SSR disabled
const MapDisplay = dynamic(
  () => import("@/app/components/dashboard/components/MapDisplay"),
  { ssr: false }
) as any;

export function DashboardLayout() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [layers, setLayers] = useState([
    { id: "bank-sampah", name: "Bank Sampah", isActive: false },
    { id: "lembaga-tpa", name: "Lembaga TPA", isActive: false },
    { id: "tpa", name: "TPA", isActive: false },
    { id: "tpst3r", name: "TPST3R", isActive: false },
  ]);

  // Ref untuk akses function search dari MapDisplay
  const mapSearchRef = useRef<((query: string) => Promise<void>) | null>(null);

  const handleSearch = async (query: string) => {
    console.log("DashboardLayout - handleSearch called with:", query);
    if (mapSearchRef.current) {
      await mapSearchRef.current(query);
    } else {
      console.error("Map search function not initialized yet!");
    }
  };

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
    console.log("Active filters:", filters);
  };

  const handleLayerToggle = async (layerId: string) => {
    console.log("Toggle layer:", layerId);
    if ((window as any).mapControls?.toggleLayer) {
      await (window as any).mapControls.toggleLayer(layerId);
    }
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  // Callback untuk menerima districts dari MapDisplay
  const handleDistrictsLoaded = (districtNames: string[]) => {
    setDistricts(districtNames);
  };

  // Callback untuk menerima search function dari MapDisplay
  const handleSearchFunctionReady = (
    searchFn: (query: string) => Promise<void>
  ) => {
    console.log("Search function ready!");
    mapSearchRef.current = searchFn;
  };

  // Sync layer state dengan MapDisplay
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).mapControls?.getState) {
        const state = (window as any).mapControls.getState();
        if (state.layers) {
          setLayers(state.layers);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* Full Screen Map */}
      <MapDisplay
        onDistrictsLoaded={handleDistrictsLoaded}
        onSearchReady={handleSearchFunctionReady}
      />

      {/* Floating Header */}
      <FloatingHeader
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSearch={handleSearch}
        onFilter={handleFilter}
        isProfileOpen={isProfileOpen}
        user={session?.user}
        districts={districts}
        layers={layers}
        onLayerToggle={handleLayerToggle}
      />

      {/* Sidebar Popup */}
      <SidebarPopup
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={session?.user}
      />

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={session?.user}
      />
      <ChatbotWrapper />
    </div>
  );
}

// Default export untuk compatibility
export default DashboardLayout;
