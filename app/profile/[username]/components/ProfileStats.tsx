"use client";

import { motion } from "framer-motion";
import { Package, TrendingUp, Star, Calendar } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    wasteOffers: number;
    completedTransactions: number;
    reviews: number;
  };
  joinDate: string;
}

export default function ProfileStats({ stats, joinDate }: ProfileStatsProps) {
  const statsData = [
    {
      icon: Package,
      label: "Postingan",
      value: stats.wasteOffers,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Transaksi",
      value: stats.completedTransactions,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      label: "Ulasan",
      value: stats.reviews,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: Calendar,
      label: "Bergabung",
      value: new Date(joinDate).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
      }),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center group"
            >
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
