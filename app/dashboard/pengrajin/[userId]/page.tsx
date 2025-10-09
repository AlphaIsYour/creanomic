/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import StatsCard from "@/app/dashboard/pengrajin/[userId]/components/StatsCard";
import SalesChart from "@/app/dashboard/pengrajin/[userId]/components/SalesChart";
import RecentOrdersTable from "@/app/dashboard/pengrajin/[userId]/components/RecentOrdersTable";
import RecentBookingsTable from "@/app/dashboard/pengrajin/[userId]/components/RecentBookingsTable";
import QuickActions from "@/app/dashboard/pengrajin/[userId]/components/QuickActions";
import {
  CubeIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalBookings: number;
  bookingsChange: number;
  averageRating: number;
  totalReviews: number;
}

interface ChartData {
  month: string;
  sales: number;
  orders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Booking {
  id: string;
  title: string;
  customerName: string;
  budget: number | null;
  status: string;
  createdAt: string;
}

export default function PengrajinDashboard({
  params,
}: {
  params: { userId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      if (session.user.id !== params.userId) {
        router.push("/");
        return;
      }
      fetchDashboardData();
    }
  }, [status, session, params.userId, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, salesRes] = await Promise.all([
        fetch(`/api/pengrajin/stats/${params.userId}`),
        fetch(`/api/pengrajin/sales/${params.userId}?period=6months`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.overview);
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setChartData(salesData.chartData);
        setRecentOrders(salesData.recentOrders.slice(0, 5));
        setRecentBookings(salesData.recentBookings.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout userId={params.userId}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-white border border-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
            <div className="h-96 bg-white rounded-lg border border-gray-200"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={params.userId}>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#8C1007] to-[#6d0a05] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Selamat datang kembali, {session?.user?.name}! 👋
              </h1>
              <p className="text-white/90">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CubeIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">
            Aksi Cepat
          </h2>
          <QuickActions />
        </div>

        {/* Stats Cards */}
        <div>
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">
            Ringkasan Performa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Produk"
              value={stats?.totalProducts || 0}
              icon={<CubeIcon className="w-6 h-6" />}
              loading={loading}
            />
            <StatsCard
              title="Pendapatan Bulan Ini"
              value={`Rp ${(stats?.totalRevenue || 0).toLocaleString("id-ID")}`}
              change={stats?.revenueChange}
              icon={<BanknotesIcon className="w-6 h-6" />}
              loading={loading}
            />
            <StatsCard
              title="Pesanan Bulan Ini"
              value={stats?.totalOrders || 0}
              change={stats?.ordersChange}
              icon={<ShoppingBagIcon className="w-6 h-6" />}
              loading={loading}
            />
            <StatsCard
              title="Booking Bulan Ini"
              value={stats?.totalBookings || 0}
              change={stats?.bookingsChange}
              icon={<CalendarIcon className="w-6 h-6" />}
              loading={loading}
            />
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating & Review</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-[#2C2C2C]">
                    {stats?.averageRating.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  dari {stats?.totalReviews || 0} review
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                router.push(`/dashboard/pengrajin/${params.userId}/reviews`)
              }
              className="px-4 py-2 text-sm font-medium text-[#8C1007] hover:bg-[#F4E1D2] rounded-lg transition-colors"
            >
              Lihat Semua
            </button>
          </div>
        </div>

        {/* Sales Chart */}
        <div>
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">
            Analisis Penjualan
          </h2>
          <SalesChart data={chartData} loading={loading} />
        </div>

        {/* Recent Orders & Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">
              Pesanan Terbaru
            </h2>
            <RecentOrdersTable orders={recentOrders} loading={loading} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">
              Booking Terbaru
            </h2>
            <RecentBookingsTable bookings={recentBookings} loading={loading} />
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-[#F4E1D2] rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-[#8C1007] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#2C2C2C] mb-2">
                Tips Meningkatkan Penjualan
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Upload foto produk berkualitas tinggi</li>
                <li>• Balas review pelanggan dengan cepat</li>
                <li>• Update stok produk secara berkala</li>
                <li>• Proses pesanan dengan cepat untuk rating lebih baik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
