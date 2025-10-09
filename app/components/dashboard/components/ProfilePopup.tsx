/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  User,
  Edit3,
  Bell,
  Shield,
  HelpCircle,
  Star,
  MapPin,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
  phone?: string | null;
  address?: string | null;
}

interface UserStats {
  wasteOffers: number;
  transactions: number;
  reviews: number;
  averageRating: number;
  totalProducts?: number;
  totalBookings?: number;
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export function ProfilePopup({ isOpen, onClose, user }: ProfilePopupProps) {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    wasteOffers: 0,
    transactions: 0,
    reviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserStats();
      fetchUnreadNotifications();
    }
  }, [isOpen, user?.id]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/user/stats/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/unread-count");
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMenuClick = (action: string) => {
    onClose();
    switch (action) {
      case "profile":
        router.push(
          `/profile/${
            user?.name?.toLowerCase().replace(/\s+/g, "-") || user?.id
          }`
        );
        break;
      case "edit-profile":
        router.push("/settings/profile");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "security":
        router.push("/settings/security");
        break;
      case "help":
        router.push("/help");
        break;
    }
  };

  const handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      USER: "Pengguna",
      PENGEPUL: "Pengepul",
      PENGRAJIN: "Pengrajin",
      ADMIN: "Administrator",
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      USER: "bg-gray-100 text-gray-700",
      PENGEPUL: "bg-gray-100 text-gray-700",
      PENGRAJIN: "bg-gray-100 text-gray-700",
      ADMIN: "bg-gray-900 text-white",
    };
    return colorMap[role] || "bg-gray-100 text-gray-700";
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
            className="fixed inset-0 z-30"
          />

          {/* Profile Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute top-20 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* User Header */}
            <div className="relative p-4 bg-gradient-to-br from-[#8C1007] via-[#B91C1C] to-[#8C1007] text-white overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/20">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  {/* Online Indicator */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#8C1007] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">
                    {user?.name || "Pengguna"}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium mt-0.5 ${getRoleBadgeColor(
                      user?.role || "USER"
                    )}`}
                  >
                    {getRoleDisplay(user?.role || "USER")}
                  </span>

                  {!loading && stats.averageRating > 0 && (
                    <div className="flex items-center space-x-1 mt-1.5">
                      <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                      <span className="text-xs font-medium text-white/90">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-white/70">
                        ({stats.reviews})
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleMenuClick("edit-profile")}
                  className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Info */}
              <div className="relative mt-3 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-white/90">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-2 text-xs text-white/90">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center space-x-2 text-xs text-white/90">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {loading ? "..." : stats.wasteOffers}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Postingan</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-lg font-bold text-gray-900">
                    {loading ? "..." : stats.transactions}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Transaksi</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {loading ? "..." : stats.reviews}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Ulasan</p>
                </div>
              </div>
            </div>

            {/* Menu Items - Quick Actions Only */}
            <div className="py-1 max-h-80 overflow-y-auto">
              <MenuItem
                icon={User}
                title="Lihat Profil Saya"
                subtitle="Profil publik & overview"
                onClick={() => handleMenuClick("profile")}
              />

              <MenuItem
                icon={Bell}
                title="Notifikasi"
                subtitle={
                  unreadNotifications > 0
                    ? `${unreadNotifications} notifikasi baru`
                    : "Tidak ada notifikasi"
                }
                badge={unreadNotifications}
                onClick={() => handleMenuClick("notifications")}
              />

              <MenuItem
                icon={Shield}
                title="Keamanan"
                subtitle="Password & autentikasi"
                onClick={() => handleMenuClick("security")}
              />

              <MenuItem
                icon={HelpCircle}
                title="Bantuan"
                subtitle="FAQ & dukungan"
                onClick={() => handleMenuClick("help")}
              />

              {/* Logout */}
              <div className="border-t mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <LogOut className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">Keluar</p>
                    <p className="text-[10px] text-gray-500">
                      Logout dari akun
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Menu Item Component
interface MenuItemProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge?: number;
  onClick: () => void;
}

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  badge,
  onClick,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center relative group-hover:bg-gray-200 transition-colors">
        <Icon className="w-4 h-4 text-gray-700" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 group-hover:text-[#8C1007] transition-colors">
          {title}
        </p>
        <p className="text-[10px] text-gray-500 truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#8C1007] group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
