// app/dashboard/pengepul/[userId]/components/StatsCard.tsx
"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  loading?: boolean;
  trend?: number; // Alias untuk change
  suffix?: string;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  loading = false,
  trend,
  suffix,
  color = "default",
}: StatsCardProps) {
  // Gunakan trend jika change tidak ada
  const changeValue = change !== undefined ? change : trend;
  const isPositive = changeValue && changeValue > 0;
  const isNegative = changeValue && changeValue < 0;

  // Color mapping untuk background icon
  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
    indigo: "bg-indigo-50 text-indigo-600",
    default: "bg-[#F4E1D2] text-[#8C1007]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold text-[#2C2C2C]">{value}</h3>
              {suffix && (
                <span className="text-sm text-gray-500">{suffix}</span>
              )}
            </div>
          )}
          {changeValue !== undefined && !loading && (
            <div className="flex items-center space-x-1 mt-2">
              {isPositive && (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
              {isNegative && (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? "text-green-600"
                    : isNegative
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {isPositive && "+"}
                {changeValue}%
              </span>
              <span className="text-xs text-gray-500">vs bulan lalu</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            colorClasses[color] || colorClasses.default
          }`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
