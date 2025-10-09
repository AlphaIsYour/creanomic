/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

interface CollectionsChartProps {
  data: Array<{
    month: string;
    weight: number;
    collections: number;
  }>;
  loading?: boolean;
}

export default function CollectionsChart({
  data,
  loading = false,
}: CollectionsChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#2C2C2C]">Tren Pengumpulan</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#8C1007] rounded-full"></div>
            <span className="text-gray-600">Berat (kg)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#F4E1D2] border-2 border-[#8C1007] rounded-full"></div>
            <span className="text-gray-600">Jumlah Pengumpulan</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8C1007" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#8C1007" stopOpacity={0} />
            </linearGradient>
          </defs>
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
              fontSize: "14px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "weight") {
                return [`${value} kg`, "Berat Sampah"];
              }
              return [value, "Jumlah Pengumpulan"];
            }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#8C1007"
            strokeWidth={2}
            fill="url(#weightGradient)"
          />
          <Line
            type="monotone"
            dataKey="collections"
            stroke="#2C2C2C"
            strokeWidth={2}
            dot={{ fill: "#8C1007", r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
