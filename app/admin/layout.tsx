/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  ShoppingBag,
  MessageSquare,
  Settings,
  Bell,
  TrendingUp,
  Shield,
  FileText,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Redirect if not admin
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      description: "Overview & statistik",
    },
    {
      label: "Approval",
      icon: UserCheck,
      href: "/admin/approval",
      description: "Kelola pendaftaran",
    },
    {
      label: "Pengguna",
      icon: Users,
      href: "/admin/users",
      description: "Kelola semua user",
    },
    {
      label: "Penawaran Sampah",
      icon: Package,
      href: "/admin/waste-offers",
      description: "Monitor penawaran",
    },
    {
      label: "Produk Kerajinan",
      icon: ShoppingBag,
      href: "/admin/products",
      description: "Monitor produk",
    },
    {
      label: "Transaksi",
      icon: TrendingUp,
      href: "/admin/transactions",
      description: "Riwayat transaksi",
    },
    {
      label: "Laporan",
      icon: FileText,
      href: "/admin/reports",
      description: "Laporan & analitik",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/admin/settings",
      description: "Konfigurasi sistem",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-[#8C1007]" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Creanomic Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition group ${
                    isActive
                      ? "bg-[#8C1007] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#8C1007]"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive
                          ? "text-white/80"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
