/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/pengepul/[userId]/statistics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowPathIcon,
  ChartBarIcon,
  MapPinIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const COLORS = [
  "#8C1007",
  "#F4E1D2",
  "#2C2C2C",
  "#4B5563",
  "#9CA3AF",
  "#D1D5DB",
];

export default function StatisticsPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/pengepul/statistics/${userId}?period=${period}`
      );
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
            <p className="text-sm text-gray-500 mt-1">
              Analisis mendalam aktivitas pengumpulan Anda
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007]"
            >
              <option value="7">7 Hari</option>
              <option value="30">30 Hari</option>
              <option value="90">90 Hari</option>
              <option value="365">1 Tahun</option>
            </select>
            <button
              onClick={fetchStatistics}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata Waktu Respons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.performance.avgResponseTime.toFixed(1)} jam
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckBadgeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tingkat Penyelesaian</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.performance.completionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Distribution - Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Distribusi Material
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.materialDistribution}
                  dataKey="count"
                  nameKey="material"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.material}: ${entry.count}`}
                >
                  {data?.materialDistribution.map(
                    (entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Offer Type Stats - Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Jenis Penawaran
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.offerTypeStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8C1007" name="Jumlah" />
                <Bar dataKey="weight" fill="#F4E1D2" name="Berat (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends - Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tren Bulanan (12 Bulan Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data?.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="collections"
                stroke="#8C1007"
                name="Pengumpulan"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="#2C2C2C"
                name="Berat (kg)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="income"
                stroke="#F4E1D2"
                name="Pendapatan (Rp)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Areas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            Area Teratas
          </h2>
          <div className="space-y-3">
            {data?.topAreas.map((area: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8C1007] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{area.area}</p>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#8C1007] h-2 rounded-full"
                      style={{
                        width: `${
                          (area.count / data.topAreas[0].count) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {area.count} pengumpulan
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
