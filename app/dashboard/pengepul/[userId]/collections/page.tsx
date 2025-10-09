/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/pengepul/[userId]/collections/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/pengepul/[userId]/components/DashboardLayout";
import CollectionsChart from "@/app/dashboard/pengepul/[userId]/components/CollectionsChart";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  MapPinIcon,
  ScaleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Collection {
  id: string;
  title: string;
  materialType: string;
  weight: number;
  offerType: string;
  suggestedPrice: number;
  status: string;
  address: string;
  takenAt: string;
  completedAt: string;
  user: {
    name: string;
    phone: string;
    image: string;
  };
}

export default function CollectionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId as string;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCollections();
  }, [period, currentPage]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/pengepul/collections/${userId}?period=${period}&page=${currentPage}&limit=6`
      );
      const data = await res.json();

      setCollections(data.collections);
      setChartData(data.chartData);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.materialType
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      collection.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMaterialColor = (type: string) => {
    const colors: { [key: string]: string } = {
      PLASTIC: "bg-blue-100 text-blue-800",
      GLASS: "bg-green-100 text-green-800",
      METAL: "bg-gray-100 text-gray-800",
      PAPER: "bg-yellow-100 text-yellow-800",
      CARDBOARD: "bg-orange-100 text-orange-800",
      ELECTRONIC: "bg-purple-100 text-purple-800",
      TEXTILE: "bg-pink-100 text-pink-800",
      WOOD: "bg-amber-100 text-amber-800",
      RUBBER: "bg-slate-100 text-slate-800",
      ORGANIC: "bg-lime-100 text-lime-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    if (status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-4 h-4" />
          Selesai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <ClockIcon className="w-4 h-4" />
        Diambil
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout userId={userId}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengumpulan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan pantau aktivitas pengumpulan sampah Anda
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
          >
            <option value="7">7 Hari Terakhir</option>
            <option value="30">30 Hari Terakhir</option>
            <option value="365">1 Tahun Terakhir</option>
          </select>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Grafik Pengumpulan
            </h2>
            <button
              onClick={fetchCollections}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
          <CollectionsChart data={chartData} />
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, material, atau pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FunnelIcon className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Tidak ada data pengumpulan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {collection.title}
                    </h3>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getMaterialColor(
                        collection.materialType
                      )}`}
                    >
                      {collection.materialType}
                    </span>
                  </div>
                  {getStatusBadge(collection.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ScaleIcon className="w-4 h-4" />
                    <span>{collection.weight} kg</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{collection.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(collection.takenAt)}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {collection.user.image ? (
                          <img
                            src={collection.user.image}
                            alt={collection.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {collection.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {collection.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {collection.user.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {collection.offerType === "SELL" &&
                    collection.suggestedPrice && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Harga Saran:</p>
                        <p className="text-lg font-bold text-[#8C1007]">
                          Rp {collection.suggestedPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
