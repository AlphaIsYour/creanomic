/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  CheckCircle,
  Upload,
  Calendar,
  TrendingUp,
  FileText,
  Search,
  ShoppingBag,
  Archive,
  AlertCircle,
  UserPlus,
  Megaphone,
  Filter,
  FolderOpen,
  MapPinned,
  Store,
  Palette,
  ClipboardList,
  BarChart2,
  Layers,
  MapPinIcon,
  Route,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  href?: string;
  onClick?: () => void;
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
  const [mapState, setMapState] = useState<any>({
    showStores: false,
    showPartners: false,
    loadingStores: false,
    loadingPartners: false,
    isLocating: false,
    layers: [],
    isRoutingEnabled: false,
  });

  // Update map state periodically
  useEffect(() => {
    const updateMapState = () => {
      if (typeof window !== "undefined" && (window as any).mapControls) {
        const state = (window as any).mapControls.getState();
        setMapState(state);
      }
    };

    updateMapState();
    const interval = setInterval(updateMapState, 500);
    return () => clearInterval(interval);
  }, []);

  // Map Control Menu Items
  const mapControlItems: MenuItem[] = [
    {
      id: "map-controls",
      label: "Kontrol Peta",
      icon: Map,
      description: "Kelola tampilan peta",
      submenu: [
        {
          id: "toggle-pengepul",
          label: mapState.loadingStores
            ? "Memuat Pengepul..."
            : mapState.showStores
            ? "Sembunyikan Pengepul"
            : "Tampilkan Pengepul",
          icon: Users,
          description: "Toggle marker pengepul sampah",
          onClick: () => {
            if (typeof window !== "undefined" && (window as any).mapControls) {
              (window as any).mapControls.toggleStore();
            }
          },
        },
        {
          id: "toggle-pengrajin",
          label: mapState.loadingPartners
            ? "Memuat Pengrajin..."
            : mapState.showPartners
            ? "Sembunyikan Pengrajin"
            : "Tampilkan Pengrajin",
          icon: Hammer,
          description: "Toggle marker pengrajin",
          onClick: () => {
            if (typeof window !== "undefined" && (window as any).mapControls) {
              (window as any).mapControls.togglePartner();
            }
          },
        },
        {
          id: "layers",
          label: "Layer Informasi",
          icon: Layers,
          description: "Bank Sampah, TPA, dll",
          onClick: () => setHoveredMenu("layer-details"),
        },
        {
          id: "my-location",
          label: mapState.isLocating ? "Mencari Lokasi..." : "Lokasi Saya",
          icon: MapPinIcon,
          description: "Temukan posisi Anda",
          onClick: () => {
            if (typeof window !== "undefined" && (window as any).mapControls) {
              (window as any).mapControls.getUserLocation();
            }
          },
        },
        {
          id: "clear-route",
          label: "Hapus Rute",
          icon: Route,
          description: "Hapus semua rute aktif",
          onClick: () => {
            if (typeof window !== "undefined" && (window as any).mapControls) {
              (window as any).mapControls.clearRoutes();
            }
          },
        },
        {
          id: "start-tour",
          label: "Mulai Tour",
          icon: Play,
          description: "Panduan fitur peta",
          onClick: () => {
            if (typeof window !== "undefined" && (window as any).mapControls) {
              (window as any).mapControls.startTour();
            }
          },
        },
      ],
    },
  ];

  // USER ROLE MENU
  const userMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Ringkasan aktivitas Anda",
      submenu: [
        {
          id: "dashboard-overview",
          label: "Ringkasan Aktivitas",
          icon: Eye,
          description: "Overview lengkap",
          href: "/dashboard",
        },
        {
          id: "dashboard-stats",
          label: "Statistik Sampah",
          icon: BarChart2,
          description: "Data sampah terkumpul",
          href: "/dashboard/statistics",
        },
        {
          id: "dashboard-notif",
          label: "Notifikasi Terbaru",
          icon: Bell,
          description: "Update terkini",
          href: "/dashboard/notifications",
        },
      ],
    },
    {
      id: "waste-offers",
      label: "Penawaran Sampah",
      icon: Package,
      description: "Kelola sampah Anda",
      submenu: [
        {
          id: "offers-create",
          label: "Tawarkan Sampah Baru",
          icon: Plus,
          description: "Jual atau hibahkan sampah",
          href: "/waste-offers/create",
        },
        {
          id: "offers-manage",
          label: "Kelola Penawaran",
          icon: Edit,
          description: "Edit & update status",
          href: "/waste-offers/manage",
        },
        {
          id: "offers-completed",
          label: "Riwayat Pengambilan",
          icon: CheckCircle,
          description: "Sampah yang sudah diambil",
          href: "/waste-offers/completed",
        },
        {
          id: "offers-archive",
          label: "Arsip Penawaran",
          icon: Archive,
          description: "Penawaran lama",
          href: "/waste-offers/archive",
        },
      ],
    },
    {
      id: "maps",
      label: "Jelajah Peta",
      icon: MapPin,
      description: "Cari pengepul & pengrajin",
      submenu: [
        {
          id: "maps-pengepul",
          label: "Cari Pengepul Terdekat",
          icon: Users,
          description: "Temukan pengepul sampah",
          href: "/maps/pengepul",
        },
        {
          id: "maps-pengrajin",
          label: "Cari Pengrajin",
          icon: Hammer,
          description: "Temukan pengrajin terampil",
          href: "/maps/pengrajin",
        },
        {
          id: "maps-waste-offers",
          label: "Lihat Penawaran Sampah",
          icon: MapPinned,
          description: "Explore sampah tersedia",
          href: "/maps/waste-offers",
        },
      ],
    },
    {
      id: "marketplace",
      label: "Marketplace Kerajinan",
      icon: ShoppingBag,
      description: "Belanja produk daur ulang",
      submenu: [
        {
          id: "marketplace-browse",
          label: "Jelajahi Produk",
          icon: Store,
          description: "Lihat semua kerajinan",
          href: "/marketplace/products",
        },
        {
          id: "marketplace-custom",
          label: "Booking Jasa Kerajinan",
          icon: Calendar,
          description: "Pesan jasa custom",
          href: "/marketplace/booking",
        },
        {
          id: "marketplace-cart",
          label: "Keranjang Belanja",
          icon: ShoppingBag,
          description: "Lihat keranjang",
          href: "/marketplace/cart",
        },
        {
          id: "marketplace-orders",
          label: "Riwayat Pesanan",
          icon: ClipboardList,
          description: "Track pesanan Anda",
          href: "/marketplace/my-orders",
        },
      ],
    },
    {
      id: "profile",
      label: "Profil Saya",
      icon: User,
      description: "Kelola akun Anda",
      submenu: [
        {
          id: "profile-edit",
          label: "Edit Profil",
          icon: Edit,
          description: "Update informasi",
          href: "/profile/edit",
        },
        {
          id: "profile-upgrade-pengepul",
          label: "Upgrade ke Pengepul ⭐",
          icon: Users,
          description: "Daftar jadi pengepul sampah",
          href: "/register/pengepul",
        },
        {
          id: "profile-upgrade-pengrajin",
          label: "Upgrade ke Pengrajin ⭐",
          icon: Hammer,
          description: "Daftar jadi pengrajin",
          href: "/register/pengrajin",
        },
      ],
    },
  ];

  // PENGEPUL, PENGRAJIN, ADMIN menus... (keep existing ones from original file)
  const pengepulMenuItems: MenuItem[] = [];
  const pengrajinMenuItems: MenuItem[] = [];
  const adminMenuItems: MenuItem[] = [];

  // Select menu based on role
  let menuItems: MenuItem[] = [];
  switch (user?.role) {
    case "PENGEPUL":
      menuItems = pengepulMenuItems;
      break;
    case "PENGRAJIN":
      menuItems = pengrajinMenuItems;
      break;
    case "ADMIN":
      menuItems = adminMenuItems;
      break;
    default:
      menuItems = userMenuItems;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleMenuClick = (item: SubMenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      console.log("Navigate to:", item.href);
    }
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
            className="fixed inset-0 bg-black/5 backdrop-blur-[0.5px] z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            className="fixed left-3 top-20 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col max-h-[calc(100vh-5rem)]"
          >
            {/* Role Badge */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.role === "PENGEPUL" && "Mode: Pengepul"}
                  {user?.role === "PENGRAJIN" && "Mode: Pengrajin"}
                  {user?.role === "ADMIN" && "Mode: Admin"}
                  {user?.role === "USER" && "Mode: User"}
                </span>
              </div>
            </div>

            {/* Menu Items - Scrollable */}
            <div className="flex-1  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <nav className="p-2 space-y-1">
                {/* Map Controls Section */}
                {mapControlItems.map((item) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => hasSubmenu && setHoveredMenu(item.id)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <button className="w-full group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                        <div className="w-8 h-8 text-[#8C1007] bg-gray-100 group-hover:bg-[#8C1007] group-hover:text-white rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800 group-hover:text-[#2C2C2C] text-sm truncate">
                              {item.label}
                            </p>
                            {hasSubmenu && (
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
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
                            className="absolute left-full top-0 ml-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-60"
                            onMouseEnter={() => setHoveredMenu(item.id)}
                            onMouseLeave={() => setHoveredMenu(null)}
                          >
                            {item.submenu?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleMenuClick(subItem)}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                                >
                                  <div className="w-7 h-7 bg-gray-100 group-hover:bg-[#8C1007]/10 rounded-md flex items-center justify-center transition-colors flex-shrink-0">
                                    <SubIcon className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#8C1007]" />
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

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Regular Menu Items */}
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
                      <button className="w-full group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                        <div className="w-8 h-8 text-[#8C1007] bg-gray-100 group-hover:bg-[#8C1007] group-hover:text-white rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800 group-hover:text-[#2C2C2C] text-sm truncate">
                              {item.label}
                            </p>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full flex-shrink-0">
                                {item.badge}
                              </span>
                            )}
                            {hasSubmenu && (
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
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
                            className="absolute left-full top-0 ml-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-60"
                            onMouseEnter={() => setHoveredMenu(item.id)}
                            onMouseLeave={() => setHoveredMenu(null)}
                          >
                            {item.submenu?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.id}
                                  href={subItem.href || "#"}
                                  onClick={() => onClose()}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                                >
                                  <div className="w-7 h-7 bg-gray-100 group-hover:bg-[#8C1007]/10 rounded-md flex items-center justify-center transition-colors flex-shrink-0">
                                    <SubIcon className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#8C1007]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm truncate">
                                      {subItem.label}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </Link>
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
            <div className="p-3 border-t border-gray-100 space-y-1 bg-gray-50/50">
              <button
                onClick={() =>
                  handleMenuClick({
                    id: "settings",
                    label: "Settings",
                    icon: Settings,
                    description: "",
                    href: "/settings",
                  })
                }
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-white transition-colors text-left group"
              >
                <Settings className="w-4 h-4 text-gray-600 group-hover:text-[#8C1007]" />
                <span className="text-gray-700 text-sm group-hover:text-gray-900">
                  Pengaturan
                </span>
              </button>

              <button
                onClick={() =>
                  handleMenuClick({
                    id: "help",
                    label: "Help",
                    icon: HelpCircle,
                    description: "",
                    href: "/help",
                  })
                }
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-white transition-colors text-left group"
              >
                <HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-[#8C1007]" />
                <span className="text-gray-700 text-sm group-hover:text-gray-900">
                  Bantuan
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
