"use client";

import Link from "next/link";
import {
  TruckIcon,
  MapPinIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function QuickActions() {
  const actions = [
    {
      title: "Lihat Penawaran Sampah",
      description: "Cari sampah yang tersedia di sekitar Anda",
      icon: MapPinIcon,
      href: "/waste-offers",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Riwayat Pengumpulan",
      description: "Lihat semua sampah yang telah Anda kumpulkan",
      icon: TruckIcon,
      href: "/pengepul/collections",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Lihat Statistik",
      description: "Analisis performa pengumpulan Anda",
      icon: ChartBarIcon,
      href: "/pengepul/statistics",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Kelola Profil",
      description: "Update informasi dan spesialisasi Anda",
      icon: Cog6ToothIcon,
      href: "/pengepul/settings",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            href={action.href}
            className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-[#8C1007] hover:shadow-md transition-all"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} border group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[#2C2C2C] group-hover:text-[#8C1007] transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
