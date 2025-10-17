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
      label: "Sampah Ditawarkan",
      value: stats.wasteOffers,
      color: "text-[#8C1007]",
      bgColor: "bg-[#F4E1D2]",
      borderColor: "border-[#8C1007]",
    },
    {
      icon: TrendingUp,
      label: "Transaksi Selesai",
      value: stats.completedTransactions,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-600",
    },
    {
      icon: Star,
      label: "Total Ulasan",
      value: stats.reviews,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
    },
    {
      icon: Calendar,
      label: "Bergabung",
      value: new Date(joinDate).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
      }),
      color: "text-[#2C2C2C]",
      bgColor: "bg-gray-100",
      borderColor: "border-[#2C2C2C]",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white border-1 border-[#2C2C2C] shadow-lg rounded-[12px]"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-gray-200">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 text-center group hover:bg-[#F4E1D2]/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8C1007]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon Box - Square Classic */}
                <div
                  className={`w-14 h-14 ${stat.bgColor} border-2 ${stat.borderColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:border-[#8C1007] transition-all duration-300 shadow-md`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${stat.color} group-hover:text-[#8C1007] transition-colors`}
                  />
                </div>

                {/* Value */}
                <p className="text-3xl font-black text-[#2C2C2C] mb-1 group-hover:text-[#8C1007] transition-colors">
                  {stat.value}
                </p>

                {/* Label */}
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>

              {/* Bottom Accent Line on Hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8C1007] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
