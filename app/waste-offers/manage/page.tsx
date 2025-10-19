/* eslint-disable react-hooks/exhaustive-deps */
// app/waste-offers/manage/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WasteOfferCard from "@/app/waste-offers/components/WasteOfferCard";
import OfferStatsCard from "@/app/waste-offers/components/OfferStatsCard";
import { WasteOffer, OfferStats, OfferStatus } from "@/types/waste-offer";

export default function ManageWasteOffersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [offers, setOffers] = useState<WasteOffer[]>([]);
  const [stats, setStats] = useState<OfferStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (
      session?.user.role !== "USER" &&
      session?.user.role !== "ADMIN"
    ) {
      router.push("/waste-offers");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session) {
      fetchOffers();
      fetchStats();
    }
  }, [session, activeTab]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab === "active") {
        params.append("status", "active");
      }

      const response = await fetch(
        `/api/waste-offers/my-offers?${params.toString()}`
      );

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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/waste-offers/my-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/waste-offers/edit/${id}`);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan penawaran ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/waste-offers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOffers();
        fetchStats();
      } else {
        alert("Gagal membatalkan penawaran");
      }
    } catch (error) {
      console.error("Error cancelling offer:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleComplete = async (id: string) => {
    if (!confirm("Tandai penawaran ini sebagai selesai?")) {
      return;
    }

    try {
      const response = await fetch(`/api/waste-offers/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (response.ok) {
        fetchOffers();
        fetchStats();
      } else {
        alert("Gagal menyelesaikan penawaran");
      }
    } catch (error) {
      console.error("Error completing offer:", error);
      alert("Terjadi kesalahan");
    }
  };

  const filterOffersByStatus = (status: OfferStatus | OfferStatus[]) => {
    if (Array.isArray(status)) {
      return offers.filter((offer) => status.includes(offer.status));
    }
    return offers.filter((offer) => offer.status === status);
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kelola Penawaran
              </h1>
              <p className="mt-1 text-gray-600">
                Kelola semua penawaran sampah Anda
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/waste-offers"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Lihat Semua Penawaran
              </Link>
              <Link
                href="/waste-offers/create"
                className="px-4 py-2 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
              >
                Buat Penawaran
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-[#8C1007] mb-4"
        >
          ← Kembali
        </button>
        {/* Stats */}
        {stats && <OfferStatsCard stats={stats} />}

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "text-[#8C1007] border-b-2 border-[#8C1007]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Penawaran Aktif
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-[#8C1007] border-b-2 border-[#8C1007]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Semua Penawaran
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${offers.length} penawaran`}
              </p>
              <div className="flex gap-2">
                <Link
                  href="/waste-offers/completed"
                  className="text-sm text-gray-600 hover:text-[#8C1007] transition-colors"
                >
                  Lihat Riwayat
                </Link>
                <span className="text-gray-300">•</span>
                <Link
                  href="/waste-offers/archive"
                  className="text-sm text-gray-600 hover:text-[#8C1007] transition-colors"
                >
                  Arsip
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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

        {/* Offers List */}
        {!loading && (
          <>
            {offers.length > 0 ? (
              <div className="space-y-8">
                {/* Available Offers */}
                {filterOffersByStatus("AVAILABLE").length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Tersedia ({filterOffersByStatus("AVAILABLE").length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterOffersByStatus("AVAILABLE").map((offer) => (
                        <WasteOfferCard
                          key={offer.id}
                          offer={offer}
                          showActions
                          onEdit={handleEdit}
                          onCancel={handleCancel}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Reserved/Taken Offers */}
                {filterOffersByStatus(["RESERVED", "TAKEN"]).length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Sedang Diproses (
                      {filterOffersByStatus(["RESERVED", "TAKEN"]).length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterOffersByStatus(["RESERVED", "TAKEN"]).map(
                        (offer) => (
                          <WasteOfferCard
                            key={offer.id}
                            offer={offer}
                            showActions
                            onComplete={handleComplete}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Other Status (for 'all' tab) */}
                {activeTab === "all" &&
                  filterOffersByStatus(["COMPLETED", "CANCELLED"]).length >
                    0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Selesai & Dibatalkan (
                        {
                          filterOffersByStatus(["COMPLETED", "CANCELLED"])
                            .length
                        }
                        )
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterOffersByStatus(["COMPLETED", "CANCELLED"]).map(
                          (offer) => (
                            <WasteOfferCard
                              key={offer.id}
                              offer={offer}
                              showActions
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
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
                  Belum ada penawaran
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Mulai tawarkan sampah Anda untuk didaur ulang.
                </p>
                <Link
                  href="/waste-offers/create"
                  className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
                >
                  Buat Penawaran Pertama
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
