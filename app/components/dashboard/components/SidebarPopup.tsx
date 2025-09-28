"use client";

import { signOut } from "next-auth/react";
import {
  X,
  Home,
  Package,
  MapPin,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Hammer,
  BarChart3,
  Bell,
  HelpCircle,
  ChevronRight,
  Plus,
  List,
  Edit,
  Trash2,
  Eye,
  Map,
  Navigation,
  Share,
  Clock,
  Users,
  Heart,
  Star,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  submenu?: SubMenuItem[];
}

interface SidebarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export function SidebarPopup({ isOpen, onClose, user }: SidebarPopupProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Lihat ringkasan aktivitas",
      submenu: [
        {
          id: "dashboard-overview",
          label: "Ringkasan",
          icon: Eye,
          description: "Overview statistik",
        },
        {
          id: "dashboard-analytics",
          label: "Analitik",
          icon: BarChart3,
          description: "Data mendalam",
        },
        {
          id: "dashboard-recent",
          label: "Aktivitas Terbaru",
          icon: Clock,
          description: "Update terkini",
        },
      ],
    },
    {
      id: "posts",
      label: "Postingan Saya",
      icon: Package,
      description: "Kelola postingan sampah",
      submenu: [
        {
          id: "posts-create",
          label: "Buat Postingan",
          icon: Plus,
          description: "Posting sampah baru",
        },
        {
          id: "posts-list",
          label: "Daftar Postingan",
          icon: List,
          description: "Lihat semua posting",
        },
        {
          id: "posts-edit",
          label: "Edit Postingan",
          icon: Edit,
          description: "Ubah posting lama",
        },
        {
          id: "posts-manage",
          label: "Kelola Status",
          icon: Settings,
          description: "Update status posting",
        },
      ],
    },
    {
      id: "maps",
      label: "Peta Lengkap",
      icon: MapPin,
      description: "Jelajahi peta interaktif",
      submenu: [
        {
          id: "maps-explore",
          label: "Jelajahi",
          icon: Map,
          description: "Lihat peta lengkap",
        },
        {
          id: "maps-navigate",
          label: "Navigasi",
          icon: Navigation,
          description: "Rute ke lokasi",
        },
        {
          id: "maps-share",
          label: "Bagikan Lokasi",
          icon: Share,
          description: "Share titik koordinat",
        },
      ],
    },
    {
      id: "chats",
      label: "Percakapan",
      icon: MessageCircle,
      description: "Chat dengan pengguna lain",
      badge: "3",
      submenu: [
        {
          id: "chats-all",
          label: "Semua Chat",
          icon: MessageCircle,
          description: "Daftar percakapan",
        },
        {
          id: "chats-unread",
          label: "Belum Dibaca",
          icon: Bell,
          description: "Chat baru masuk",
        },
        {
          id: "chats-groups",
          label: "Grup Chat",
          icon: Users,
          description: "Diskusi kelompok",
        },
      ],
    },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      description: "Lihat update terbaru",
      badge: "5",
      submenu: [
        {
          id: "notif-all",
          label: "Semua Notifikasi",
          icon: Bell,
          description: "Update lengkap",
        },
        {
          id: "notif-important",
          label: "Penting",
          icon: Star,
          description: "Notifikasi prioritas",
        },
        {
          id: "notif-likes",
          label: "Suka & Komentar",
          icon: Heart,
          description: "Interaksi posting",
        },
      ],
    },
  ];

  // Add role-specific menu items
  if (user?.role === "PENGRAJIN") {
    const craftMenu: MenuItem = {
      id: "crafts",
      label: "Kerajinan",
      icon: Hammer,
      description: "Kelola produk kerajinan",
      submenu: [
        {
          id: "crafts-create",
          label: "Buat Kerajinan",
          icon: Plus,
          description: "Tambah produk baru",
        },
        {
          id: "crafts-manage",
          label: "Kelola Produk",
          icon: Edit,
          description: "Edit kerajinan",
        },
        {
          id: "crafts-orders",
          label: "Pesanan",
          icon: List,
          description: "Daftar order masuk",
        },
        {
          id: "crafts-gallery",
          label: "Galeri",
          icon: Eye,
          description: "Showcase karya",
        },
      ],
    };
    menuItems.splice(2, 0, craftMenu);
  }

  if (user?.role === "ADMIN") {
    const analyticsMenu: MenuItem = {
      id: "analytics",
      label: "Analitik",
      icon: BarChart3,
      description: "Dashboard admin & statistik",
      submenu: [
        {
          id: "analytics-users",
          label: "Manajemen User",
          icon: Users,
          description: "Kelola pengguna",
        },
        {
          id: "analytics-reports",
          label: "Laporan",
          icon: BarChart3,
          description: "Data statistik",
        },
        {
          id: "analytics-system",
          label: "Sistem",
          icon: Settings,
          description: "Monitor sistem",
        },
        {
          id: "analytics-moderation",
          label: "Moderasi",
          icon: Shield,
          description: "Review konten",
        },
      ],
    };
    menuItems.splice(-1, 0, analyticsMenu);
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleMenuClick = (menuId: string) => {
    console.log("Navigate to:", menuId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            className="fixed left-3 top-16 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col max-h-[calc(100vh-5rem)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 rounded-lg flex items-center justify-center shadow-md">
                    <div className="w-4 h-4 bg-[#F4E1D2] rounded-sm"></div>
                  </div>
                  <span className="text-lg font-bold text-[#2C2C2C]">
                    Daurin
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 p-2.5 bg-gradient-to-r from-[#F4E1D2]/30 to-transparent rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 rounded-lg flex items-center justify-center shadow-sm">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2C2C2C] text-sm truncate">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.role?.toLowerCase() || "user"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-3 overflow-y-auto">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => hasSubmenu && setHoveredMenu(item.id)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <button
                        onClick={() => !hasSubmenu && handleMenuClick(item.id)}
                        className="w-full group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#8C1007] group-hover:text-white rounded-md flex items-center justify-center transition-all duration-200">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800 group-hover:text-[#2C2C2C] text-sm truncate">
                              {item.label}
                            </p>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {item.badge}
                              </span>
                            )}
                            {hasSubmenu && (
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                            {item.description}
                          </p>
                        </div>
                      </button>

                      {/* Submenu Popup */}
                      <AnimatePresence>
                        {hasSubmenu && hoveredMenu === item.id && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-full top-0 ml-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-60"
                            onMouseEnter={() => setHoveredMenu(item.id)}
                            onMouseLeave={() => setHoveredMenu(null)}
                          >
                            {item.submenu?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleMenuClick(subItem.id)}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                                    <SubIcon className="w-3.5 h-3.5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm truncate">
                                      {subItem.label}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 space-y-1">
              {/* Settings */}
              <button
                onClick={() => handleMenuClick("settings")}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-gray-50 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm">Pengaturan</span>
              </button>

              {/* Help */}
              <button
                onClick={() => handleMenuClick("help")}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-gray-50 transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm">Bantuan</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Keluar</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
