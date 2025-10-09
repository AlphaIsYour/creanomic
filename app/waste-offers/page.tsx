/* eslint-disable react-hooks/exhaustive-deps */
// app/waste-offers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import WasteOfferCard from "@/app/waste-offers/components/WasteOfferCard";
import WasteOfferFilter from "@/app/waste-offers/components/WasteOfferFilter";
import { WasteOffer, MaterialType, OfferType } from "@/types/waste-offer";

const MapView = dynamic(() => import("@/app/waste-offers/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

export default function WasteOffersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [offers, setOffers] = useState<WasteOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Filters
  const [materialType, setMaterialType] = useState<MaterialType | "">("");
  const [offerType, setOfferType] = useState<OfferType | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchOffers();
  }, [materialType, offerType, search]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (materialType) params.append("materialType", materialType);
      if (offerType) params.append("offerType", offerType);
      if (search) params.append("search", search);

      const response = await fetch(`/api/waste-offers?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMaterialType("");
    setOfferType("");
    setSearch("");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Penawaran Sampah
              </h1>
              <p className="mt-1 text-gray-600">
                Temukan penawaran sampah yang dapat didaur ulang
              </p>
            </div>

            <div className="flex gap-3">
              {session.user.role === "USER" && (
                <>
                  <Link
                    href="/waste-offers/manage"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Kelola Penawaran
                  </Link>
                  <Link
                    href="/waste-offers/create"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
                  >
                    Buat Penawaran
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <WasteOfferFilter
          materialType={materialType}
          offerType={offerType}
          search={search}
          onMaterialTypeChange={setMaterialType}
          onOfferTypeChange={setOfferType}
          onSearchChange={setSearch}
          onReset={handleReset}
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {loading ? "Memuat..." : `${offers.length} penawaran ditemukan`}
          </p>

          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-[#8C1007] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                viewMode === "map"
                  ? "bg-[#8C1007] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Peta
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === "grid" && (
          <>
            {offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <WasteOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Tidak ada penawaran
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Belum ada penawaran sampah yang tersedia saat ini.
                </p>
              </div>
            )}
          </>
        )}

        {/* Map View */}
        {!loading && viewMode === "map" && <MapView offers={offers} />}
      </div>
    </div>
  );
}
