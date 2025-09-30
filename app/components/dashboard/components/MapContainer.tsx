"use client";

import dynamic from "next/dynamic";

// Import leaflet hanya di client-side
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapContainerProps {
  searchQuery: string;
  activeFilters: string[];
}

export function MapContainer({
  searchQuery,
  activeFilters,
}: MapContainerProps) {
  return <LeafletMap searchQuery={searchQuery} activeFilters={activeFilters} />;
}
