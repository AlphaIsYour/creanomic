// app/dashboard/pengepul/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/pengepul/[userId]/components/DashboardLayout";
import StatsCard from "@/app/dashboard/pengepul/[userId]/components/StatsCard";
import CollectionsChart from "@/app/dashboard/pengepul/[userId]/components/CollectionsChart";
import RecentCollectionsTable from "@/app/dashboard/pengepul/[userId]/components/RecentCollectionsTable";
import QuickActions from "@/app/dashboard/pengepul/[userId]/components/QuickActions";
import {
  TruckIcon,
  ScaleIcon,
  StarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface Stats {
  totalCollections: number;
  totalWeight: number;
  totalIncome: number;
  averageRating: number;
  totalReviews: number;
  collectionsGrowth: number;
}

export default function PengepulDashboard() {
  const params = useParams();
  const userId = params.userId as string;

  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState([]);
  const [recentCollections, setRecentCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch(
        `/api/pengepul/stats/${userId}?period=${period}`
      );
      const statsData = await statsRes.json();

      // Fetch collections with chart data
      const collectionsRes = await fetch(
        `/api/pengepul/collections/${userId}?period=${period}&limit=6`
      );
      const collectionsData = await collectionsRes.json();

      setStats(statsData.stats);
      setChartData(collectionsData.chartData);
      setRecentCollections(collectionsData.collections);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <DashboardLayout userId={userId}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={userId}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Selamat datang kembali! Berikut ringkasan aktivitas Anda.
            </p>
          </div>

          {/* Period Filter */}
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

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Pengumpulan"
            value={stats?.totalCollections || 0}
            icon={<TruckIcon className="w-6 h-6" />}
            change={stats?.collectionsGrowth}
          />
          <StatsCard
            title="Total Berat"
            value={`${stats?.totalWeight || 0} kg`}
            icon={<ScaleIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Pendapatan"
            value={`Rp ${stats?.totalIncome.toLocaleString("id-ID") || 0}`}
            icon={<BanknotesIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Rating Rata-rata"
            value={stats?.averageRating.toFixed(1) || "0.0"}
            icon={<StarIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Review"
            value={stats?.totalReviews || 0}
            icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Pertumbuhan"
            value={`${stats?.collectionsGrowth.toFixed(1) || 0}%`}
            icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Statistik Pengumpulan
          </h2>
          <CollectionsChart data={chartData} />
        </div>

        {/* Recent Collections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pengumpulan Terbaru
            </h2>
            <a
              href={`/dashboard/pengepul/${userId}/collections`}
              className="text-sm text-[#8C1007] hover:text-[#6B0C05] font-medium"
            >
              Lihat Semua →
            </a>
          </div>
          <RecentCollectionsTable collections={recentCollections} />
        </div>
      </div>
    </DashboardLayout>
  );
}
