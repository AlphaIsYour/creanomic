"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { MapContainer } from "@/app/components/dashboard/components/MapContainer";
import { FloatingHeader } from "@/app/components/dashboard/components/FloatingHeader";
import { SidebarPopup } from "@/app/components/dashboard/components/SidebarPopup";
import { ProfilePopup } from "@/app/components/dashboard/components/ProfilePopup";

export function DashboardLayout() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
    // TODO: Implement filter logic
    console.log("Active filters:", filters);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* Full Screen Map */}
      <MapContainer searchQuery={searchQuery} activeFilters={activeFilters} />

      {/* Floating Header */}
      <FloatingHeader
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onSearch={handleSearch}
        onFilter={handleFilter}
        isProfileOpen={isProfileOpen}
        user={session?.user}
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
    </div>
  );
}
