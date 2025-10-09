/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import {
  BanknotesIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";

interface SalesData {
  chartData: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentBookings: Array<{
    id: string;
    title: string;
    customerName: string;
    budget: number | null;
    status: string;
    createdAt: string;
  }>;
}

type PeriodType = "6months" | "12months" | "all";
type ViewType = "chart" | "table";

export default function SalesPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>("6months");
  const [viewType, setViewType] = useState<ViewType>("chart");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      fetchSalesData();
    }
  }, [status, session, params.userId, period, router]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/pengrajin/sales/${params.userId}?period=${period}`
      );
      if (res.ok) {
        const data = await res.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!salesData) return;

    const ordersData = salesData.recentOrders.map((order) => ({
      "No. Order": order.orderNumber,
      Customer: order.customerName,
      Total: order.totalAmount,
      Status: order.status,
      Tanggal: new Date(order.createdAt).toLocaleDateString("id-ID"),
    }));

    const bookingsData = salesData.recentBookings.map((booking) => ({
      Judul: booking.title,
      Customer: booking.customerName,
      Budget: booking.budget || "Nego",
      Status: booking.status,
      Tanggal: new Date(booking.createdAt).toLocaleDateString("id-ID"),
    }));

    const wb = XLSX.utils.book_new();
    const wsOrders = XLSX.utils.json_to_sheet(ordersData);
    const wsBookings = XLSX.utils.json_to_sheet(bookingsData);

    XLSX.utils.book_append_sheet(wb, wsOrders, "Pesanan");
    XLSX.utils.book_append_sheet(wb, wsBookings, "Booking");

    XLSX.writeFile(
      wb,
      `Penjualan_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const totalRevenue =
    salesData?.chartData.reduce((acc, curr) => acc + curr.sales, 0) || 0;
  const totalOrders =
    salesData?.chartData.reduce((acc, curr) => acc + curr.orders, 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const filteredOrders =
    salesData?.recentOrders.filter((order) => {
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  if (status === "loading" || loading) {
    return (
      <DashboardLayout userId={params.userId}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg border"></div>
              ))}
            </div>
            <div className="h-96 bg-white rounded-lg border"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={params.userId}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">
              Laporan Penjualan
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Analisis performa penjualan Anda
            </p>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0a05] transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-[#8C1007]" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
            <h3 className="text-2xl font-bold text-[#2C2C2C]">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="w-6 h-6 text-[#8C1007]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
            <h3 className="text-2xl font-bold text-[#2C2C2C]">{totalOrders}</h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-[#8C1007]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Rata-rata Nilai Order</p>
            <h3 className="text-2xl font-bold text-[#2C2C2C]">
              Rp {Math.round(avgOrderValue).toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewType("chart")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "chart"
                    ? "bg-[#8C1007] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Grafik
              </button>
              <button
                onClick={() => setViewType("table")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewType === "table"
                    ? "bg-[#8C1007] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tabel
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodType)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              >
                <option value="6months">6 Bulan Terakhir</option>
                <option value="12months">12 Bulan Terakhir</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart/Table View */}
        {viewType === "chart" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-[#2C2C2C] mb-6">
              Tren Penjualan
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesData?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "sales") {
                      return [
                        `Rp ${value.toLocaleString("id-ID")}`,
                        "Penjualan",
                      ];
                    }
                    return [value, "Jumlah Order"];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="#8C1007"
                  name="Penjualan (Rp)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="orders"
                  fill="#F4E1D2"
                  name="Jumlah Order"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Cari order atau customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Dikonfirmasi</option>
                    <option value="PROCESSING">Diproses</option>
                    <option value="COMPLETED">Selesai</option>
                    <option value="CANCELLED">Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      No. Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#8C1007]">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2C2C2C]">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2C2C2C]">
                          Rp {order.totalAmount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
