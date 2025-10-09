"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Action {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function QuickActions() {
  const actions: Action[] = [
    {
      title: "Tambah Produk",
      description: "Buat produk kerajinan baru",
      href: "/pengrajin/products/create",
      color: "bg-[#8C1007]",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      title: "Kelola Produk",
      description: "Edit & update produk",
      href: "/pengrajin/products/manage",
      color: "bg-[#2C2C2C]",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      title: "Pesanan Masuk",
      description: "Lihat pesanan baru",
      href: "/pengrajin/orders?status=pending",
      color: "bg-blue-600",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Booking Custom",
      description: "Request custom masuk",
      href: "/pengrajin/bookings?status=pending",
      color: "bg-purple-600",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={action.href}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`${action.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#2C2C2C] text-sm mb-1 group-hover:text-[#8C1007] transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-[#8C1007] group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
