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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

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
  href: string;
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

  // MENU FOR USER ROLE
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
      id: "posts",
      label: "Postingan Sampah",
      icon: Package,
      description: "Kelola sampah Anda",
      submenu: [
        {
          id: "posts-create",
          label: "Buat Postingan Baru",
          icon: Plus,
          description: "Posting sampah baru",
          href: "/posts/create",
        },
        {
          id: "posts-manage",
          label: "Kelola Postingan",
          icon: Edit,
          description: "Edit & update status",
          href: "/posts/manage",
        },
        {
          id: "posts-completed",
          label: "Riwayat Selesai",
          icon: CheckCircle,
          description: "Pickup yang selesai",
          href: "/posts/completed",
        },
        {
          id: "posts-archive",
          label: "Draft & Arsip",
          icon: Archive,
          description: "Draft & postingan lama",
          href: "/posts/archive",
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
          icon: Map,
          description: "Temukan collector",
          href: "/maps/pengepul",
        },
        {
          id: "maps-pengrajin",
          label: "Cari Pengrajin",
          icon: Palette,
          description: "Temukan crafter",
          href: "/maps/pengrajin",
        },
        {
          id: "maps-posts",
          label: "Lihat Postingan Lain",
          icon: MapPinned,
          description: "Explore post lainnya",
          href: "/maps/posts",
        },
      ],
    },
    {
      id: "crafts",
      label: "Kerajinan",
      icon: ShoppingBag,
      description: "Belanja produk kerajinan",
      submenu: [
        {
          id: "crafts-browse",
          label: "Jelajahi Produk",
          icon: Store,
          description: "Lihat semua kerajinan",
          href: "/crafts",
        },
        {
          id: "crafts-custom",
          label: "Pesan Kerajinan Custom",
          icon: Plus,
          description: "Request custom order",
          href: "/crafts/custom-request",
        },
        {
          id: "crafts-orders",
          label: "Riwayat Pesanan",
          icon: ClipboardList,
          description: "Track pesanan Anda",
          href: "/crafts/my-orders",
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
          href: "/notifications",
        },
        {
          id: "notif-pickup",
          label: "Pickup Confirmation",
          icon: CheckCircle,
          description: "Konfirmasi pengambilan",
          href: "/notifications?type=pickup",
        },
        {
          id: "notif-requests",
          label: "Request Updates",
          icon: AlertCircle,
          description: "Update pesanan",
          href: "/notifications?type=request",
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
          icon: UserPlus,
          description: "Daftar jadi collector",
          href: "/register/pengepul",
        },
        {
          id: "profile-upgrade-pengrajin",
          label: "Upgrade ke Pengrajin ⭐",
          icon: Hammer,
          description: "Daftar jadi crafter",
          href: "/register/pengrajin",
        },
      ],
    },
  ];

  // MENU FOR PENGEPUL ROLE
  const pengepulMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard Pengepul",
      icon: Home,
      description: "Ringkasan pickup Anda",
      submenu: [
        {
          id: "dashboard-overview",
          label: "Ringkasan Pickup",
          icon: Eye,
          description: "Overview aktivitas",
          href: `/dashboard/pengepul/${user?.id}`,
        },
        {
          id: "dashboard-stats",
          label: "Statistik Pengambilan",
          icon: BarChart2,
          description: "Data performa",
          href: `/dashboard/pengepul/${user?.id}/statistics`,
        },
        {
          id: "dashboard-reviews",
          label: "Rating & Review",
          icon: Star,
          description: "Feedback pelanggan",
          href: `/dashboard/pengepul/${user?.id}/reviews`,
        },
      ],
    },
    {
      id: "search-posts",
      label: "Cari Sampah Tersedia",
      icon: Search,
      description: "Temukan post aktif",
      submenu: [
        {
          id: "search-map",
          label: "Peta Post Aktif",
          icon: Map,
          description: "Lihat di peta",
          href: "/pengepul/posts/map",
        },
        {
          id: "search-filter",
          label: "Filter by Material",
          icon: Filter,
          description: "Cari material spesifik",
          href: "/pengepul/posts?filter=material",
        },
        {
          id: "search-nearby",
          label: "Nearby Posts",
          icon: MapPinned,
          description: "Post terdekat",
          href: "/pengepul/posts/nearby",
        },
      ],
    },
    {
      id: "pickups",
      label: "Pickup Saya",
      icon: Package,
      description: "Kelola pengambilan",
      submenu: [
        {
          id: "pickups-pending",
          label: "Menunggu Konfirmasi",
          icon: Clock,
          description: "Belum dikonfirmasi",
          href: "/pengepul/pickups?status=pending",
        },
        {
          id: "pickups-today",
          label: "Dijadwalkan Hari Ini",
          icon: Calendar,
          description: "Pickup hari ini",
          href: "/pengepul/pickups/today",
        },
        {
          id: "pickups-completed",
          label: "Riwayat Selesai",
          icon: CheckCircle,
          description: "Pickup selesai",
          href: "/pengepul/pickups/completed",
        },
        {
          id: "pickups-upload",
          label: "Upload Bukti Pickup",
          icon: Upload,
          description: "Upload foto bukti",
          href: "/pengepul/pickups/upload",
        },
      ],
    },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      description: "Lihat update terbaru",
      badge: "3",
      submenu: [
        {
          id: "notif-new-posts",
          label: "Post Baru Terdekat",
          icon: MapPin,
          description: "Post baru di area",
          href: "/notifications?type=new_post",
        },
        {
          id: "notif-requests",
          label: "Request dari User",
          icon: AlertCircle,
          description: "Permintaan pickup",
          href: "/notifications?type=request",
        },
        {
          id: "notif-pengrajin",
          label: "Kontak dari Pengrajin",
          icon: Hammer,
          description: "Inquiry material",
          href: "/notifications?type=pengrajin",
        },
      ],
    },
    {
      id: "reports",
      label: "Laporan & Statistik",
      icon: BarChart3,
      description: "Analitik performa",
      submenu: [
        {
          id: "reports-total",
          label: "Total Berat Terkumpul",
          icon: TrendingUp,
          description: "Akumulasi berat",
          href: "/pengepul/reports/total-weight",
        },
        {
          id: "reports-material",
          label: "Material Breakdown",
          icon: BarChart2,
          description: "Breakdown per jenis",
          href: "/pengepul/reports/materials",
        },
        {
          id: "reports-monthly",
          label: "Monthly Reports",
          icon: FileText,
          description: "Laporan bulanan",
          href: "/pengepul/reports/monthly",
        },
      ],
    },
    {
      id: "profile",
      label: "Profil Bisnis",
      icon: User,
      description: "Kelola profil bisnis",
      submenu: [
        {
          id: "profile-edit",
          label: "Edit Company Info",
          icon: Edit,
          description: "Update info perusahaan",
          href: "/pengepul/profile/edit",
        },
        {
          id: "profile-docs",
          label: "Dokumen Verifikasi",
          icon: FileText,
          description: "Upload dokumen",
          href: "/pengepul/profile/documents",
        },
        {
          id: "profile-portfolio",
          label: "Portfolio & Review",
          icon: Star,
          description: "Showcase & rating",
          href: "/pengepul/profile/portfolio",
        },
      ],
    },
  ];

  // MENU FOR PENGRAJIN ROLE
  const pengrajinMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard Pengrajin",
      icon: Home,
      description: "Ringkasan bisnis Anda",
      submenu: [
        {
          id: "dashboard-overview",
          label: "Ringkasan Pesanan",
          icon: Eye,
          description: "Overview pesanan",
          href: `/dashboard/pengrajin/${user?.id}`,
        },
        {
          id: "dashboard-sales",
          label: "Statistik Penjualan",
          icon: TrendingUp,
          description: "Data penjualan",
          href: `/dashboard/pengrajin/${user?.id}/sales`,
        },
        {
          id: "dashboard-reviews",
          label: "Rating & Review",
          icon: Star,
          description: "Feedback customer",
          href: `/dashboard/pengrajin/${user?.id}/reviews`,
        },
      ],
    },
    {
      id: "products",
      label: "Produk Kerajinan",
      icon: Hammer,
      description: "Kelola produk Anda",
      submenu: [
        {
          id: "products-create",
          label: "Tambah Produk Baru",
          icon: Plus,
          description: "Buat produk baru",
          href: "/pengrajin/products/create",
        },
        {
          id: "products-manage",
          label: "Kelola Produk",
          icon: Edit,
          description: "Edit produk",
          href: "/pengrajin/products/manage",
        },
        {
          id: "products-gallery",
          label: "Portfolio Gallery",
          icon: Palette,
          description: "Showcase karya",
          href: "/pengrajin/products/gallery",
        },
        {
          id: "products-pricing",
          label: "Atur Harga & Stok",
          icon: BarChart2,
          description: "Manage pricing",
          href: "/pengrajin/products/pricing",
        },
      ],
    },
    {
      id: "orders",
      label: "Pesanan Masuk",
      icon: ClipboardList,
      description: "Kelola pesanan",
      submenu: [
        {
          id: "orders-custom",
          label: "Request Custom",
          icon: AlertCircle,
          description: "Custom order masuk",
          href: "/pengrajin/orders?type=custom",
        },
        {
          id: "orders-pending",
          label: "Order Pending",
          icon: Clock,
          description: "Belum dikonfirmasi",
          href: "/pengrajin/orders?status=pending",
        },
        {
          id: "orders-progress",
          label: "Dalam Proses",
          icon: TrendingUp,
          description: "Sedang dikerjakan",
          href: "/pengrajin/orders?status=in_progress",
        },
        {
          id: "orders-completed",
          label: "Selesai & Delivered",
          icon: CheckCircle,
          description: "Order selesai",
          href: "/pengrajin/orders?status=completed",
        },
      ],
    },
    {
      id: "materials",
      label: "Cari Bahan Baku",
      icon: Search,
      description: "Hubungi pengepul",
      submenu: [
        {
          id: "materials-contact",
          label: "Kontak Pengepul",
          icon: Users,
          description: "List pengepul",
          href: "/pengrajin/materials/pengepul",
        },
        {
          id: "materials-availability",
          label: "Ketersediaan Material",
          icon: Package,
          description: "Cek stok material",
          href: "/pengrajin/materials/availability",
        },
        {
          id: "materials-saved",
          label: "Saved Suppliers",
          icon: Heart,
          description: "Supplier favorit",
          href: "/pengrajin/materials/saved",
        },
      ],
    },
    {
      id: "notifications",
      label: "Notifikasi",
      icon: Bell,
      description: "Lihat update terbaru",
      badge: "4",
      submenu: [
        {
          id: "notif-orders",
          label: "Pesanan Baru",
          icon: ShoppingBag,
          description: "Order masuk",
          href: "/notifications?type=new_order",
        },
        {
          id: "notif-chat",
          label: "Chat dari Customer",
          icon: MessageCircle,
          description: "Pesan baru",
          href: "/notifications?type=chat",
        },
        {
          id: "notif-material",
          label: "Update Material",
          icon: Package,
          description: "Info material baru",
          href: "/notifications?type=material",
        },
      ],
    },
    {
      id: "reports",
      label: "Laporan & Analitik",
      icon: BarChart3,
      description: "Analisis bisnis",
      submenu: [
        {
          id: "reports-sales",
          label: "Penjualan Bulanan",
          icon: TrendingUp,
          description: "Laporan penjualan",
          href: "/pengrajin/reports/sales",
        },
        {
          id: "reports-products",
          label: "Produk Terlaris",
          icon: Star,
          description: "Top products",
          href: "/pengrajin/reports/top-products",
        },
        {
          id: "reports-feedback",
          label: "Customer Feedback",
          icon: MessageCircle,
          description: "Review & rating",
          href: "/pengrajin/reports/feedback",
        },
      ],
    },
    {
      id: "profile",
      label: "Profil Bisnis",
      icon: User,
      description: "Kelola profil bisnis",
      submenu: [
        {
          id: "profile-portfolio",
          label: "Edit Portfolio",
          icon: Palette,
          description: "Update showcase",
          href: "/pengrajin/profile/portfolio",
        },
        {
          id: "profile-docs",
          label: "Dokumen Verifikasi",
          icon: FileText,
          description: "Upload dokumen",
          href: "/pengrajin/profile/documents",
        },
        {
          id: "profile-social",
          label: "Social Media Links",
          icon: Share,
          description: "Link sosmed",
          href: "/pengrajin/profile/social",
        },
      ],
    },
  ];

  // MENU FOR ADMIN ROLE
  const adminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard Admin",
      icon: Home,
      description: "Overview sistem",
      submenu: [
        {
          id: "dashboard-overview",
          label: "Overview Sistem",
          icon: Eye,
          description: "Status platform",
          href: "/admin/dashboard",
        },
        {
          id: "dashboard-activity",
          label: "User Activity",
          icon: Users,
          description: "Aktivitas pengguna",
          href: "/admin/dashboard/activity",
        },
        {
          id: "dashboard-stats",
          label: "Platform Stats",
          icon: BarChart2,
          description: "Statistik lengkap",
          href: "/admin/dashboard/stats",
        },
      ],
    },
    {
      id: "approval",
      label: "Approval Management",
      icon: CheckCircle,
      description: "Review pendaftaran",
      badge: "12",
      submenu: [
        {
          id: "approval-pengepul",
          label: "Pending Pengepul",
          icon: Package,
          description: "Review collector",
          href: "/admin/approvals/pengepul",
        },
        {
          id: "approval-pengrajin",
          label: "Pending Pengrajin",
          icon: Hammer,
          description: "Review crafter",
          href: "/admin/approvals/pengrajin",
        },
        {
          id: "approval-docs",
          label: "Review Documents",
          icon: FileText,
          description: "Periksa dokumen",
          href: "/admin/approvals/documents",
        },
        {
          id: "approval-history",
          label: "Rejected History",
          icon: Archive,
          description: "Riwayat rejected",
          href: "/admin/approvals/rejected",
        },
      ],
    },
    {
      id: "users",
      label: "Manajemen User",
      icon: Users,
      description: "Kelola pengguna",
      submenu: [
        {
          id: "users-all",
          label: "Semua User",
          icon: Users,
          description: "List semua user",
          href: "/admin/users",
        },
        {
          id: "users-active",
          label: "User Aktif",
          icon: CheckCircle,
          description: "User yang aktif",
          href: "/admin/users?status=active",
        },
        {
          id: "users-banned",
          label: "Banned Users",
          icon: AlertCircle,
          description: "User yang dibanned",
          href: "/admin/users?status=banned",
        },
        {
          id: "users-reports",
          label: "User Reports",
          icon: Shield,
          description: "Laporan masalah",
          href: "/admin/users/reports",
        },
      ],
    },
    {
      id: "moderation",
      label: "Moderasi Konten",
      icon: Shield,
      description: "Review konten",
      submenu: [
        {
          id: "moderation-posts",
          label: "Review Posts",
          icon: Package,
          description: "Periksa postingan",
          href: "/admin/moderation/posts",
        },
        {
          id: "moderation-reported",
          label: "Reported Content",
          icon: AlertCircle,
          description: "Konten dilaporkan",
          href: "/admin/moderation/reported",
        },
        {
          id: "moderation-products",
          label: "Flagged Products",
          icon: Hammer,
          description: "Produk bermasalah",
          href: "/admin/moderation/products",
        },
        {
          id: "moderation-delete",
          label: "Delete/Archive",
          icon: Trash2,
          description: "Hapus konten",
          href: "/admin/moderation/delete",
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      description: "Laporan platform",
      submenu: [
        {
          id: "analytics-growth",
          label: "User Growth",
          icon: TrendingUp,
          description: "Pertumbuhan user",
          href: "/admin/analytics/growth",
        },
        {
          id: "analytics-transactions",
          label: "Transaction Volume",
          icon: BarChart2,
          description: "Volume transaksi",
          href: "/admin/analytics/transactions",
        },
        {
          id: "analytics-materials",
          label: "Material Statistics",
          icon: Package,
          description: "Stats material",
          href: "/admin/analytics/materials",
        },
        {
          id: "analytics-geo",
          label: "Geographic Distribution",
          icon: Map,
          description: "Distribusi geografis",
          href: "/admin/analytics/geographic",
        },
      ],
    },
    {
      id: "broadcast",
      label: "Broadcast Notifikasi",
      icon: Megaphone,
      description: "Kirim announcement",
      submenu: [
        {
          id: "broadcast-send",
          label: "Kirim Announcement",
          icon: Megaphone,
          description: "Broadcast pesan",
          href: "/admin/broadcast/send",
        },
        {
          id: "broadcast-updates",
          label: "System Updates",
          icon: Bell,
          description: "Update sistem",
          href: "/admin/broadcast/system",
        },
        {
          id: "broadcast-history",
          label: "Notifikasi History",
          icon: Clock,
          description: "Riwayat broadcast",
          href: "/admin/broadcast/history",
        },
      ],
    },
    {
      id: "settings",
      label: "Pengaturan Sistem",
      icon: Settings,
      description: "Konfigurasi platform",
      submenu: [
        {
          id: "settings-materials",
          label: "Material Types",
          icon: Package,
          description: "Kelola jenis material",
          href: "/admin/settings/materials",
        },
        {
          id: "settings-platform",
          label: "Platform Settings",
          icon: Settings,
          description: "Konfigurasi umum",
          href: "/admin/settings/platform",
        },
        {
          id: "settings-approval",
          label: "Approval Rules",
          icon: CheckCircle,
          description: "Atur aturan approval",
          href: "/admin/settings/approval-rules",
        },
      ],
    },
  ];

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

  const handleMenuClick = (href: string) => {
    console.log("Navigate to:", href);
    // TODO: Implement actual navigation with Next.js router
    // router.push(href);
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
                        onClick={() =>
                          !hasSubmenu &&
                          item.submenu?.[0] &&
                          handleMenuClick(item.submenu[0].href)
                        }
                        className="w-full group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                      >
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
                            className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-60"
                            onMouseEnter={() => setHoveredMenu(item.id)}
                            onMouseLeave={() => setHoveredMenu(null)}
                          >
                            {item.submenu?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.id}
                                  href={subItem.href}
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
              {/* Settings */}
              <button
                onClick={() => handleMenuClick("/settings")}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-white transition-colors text-left group"
              >
                <Settings className="w-4 h-4 text-gray-600 group-hover:text-[#8C1007]" />
                <span className="text-gray-700 text-sm group-hover:text-gray-900">
                  Pengaturan
                </span>
              </button>

              {/* Help */}
              <button
                onClick={() => handleMenuClick("/help")}
                className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-white transition-colors text-left group"
              >
                <HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-[#8C1007]" />
                <span className="text-gray-700 text-sm group-hover:text-gray-900">
                  Bantuan
                </span>
              </button>

              {/* Logout */}
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
