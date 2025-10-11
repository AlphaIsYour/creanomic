/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
    console.log("Active filters:", filters);
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

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* Full Screen Map */}
      <MapDisplay onDistrictsLoaded={handleDistrictsLoaded} />

      {/* Floating Header */}
      <FloatingHeader
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSearch={handleSearch}
        onFilter={handleFilter}
        isProfileOpen={isProfileOpen}
        user={session?.user}
        districts={districts}
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
