/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut } from "next-auth/react";
import {
  User,
  Settings,
  LogOut,
  Edit3,
  Bell,
  Shield,
  HelpCircle,
  Star,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export function ProfilePopup({ isOpen, onClose, user }: ProfilePopupProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleMenuClick = (action: string) => {
    // TODO: Implement navigation logic
    console.log("Profile action:", action);
    onClose();
  };

  // Mock user stats - in real app, this would come from props or API
  const userStats = {
    posts: 12,
    transactions: 8,
    rating: 4.8,
    reviews: 15,
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
            className="fixed inset-0 bg-transparent z-30"
          />

          {/* Profile Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* User Header */}
            <div className="p-6 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 text-white">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {user?.name || "Pengguna"}
                  </h3>
                  <p className="text-white/80 capitalize text-sm mb-1">
                    {user?.role?.toLowerCase() || "user"}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm text-white/90">
                      {userStats.rating} ({userStats.reviews} ulasan)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleMenuClick("edit-profile")}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <Phone className="w-4 h-4" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span>Surabaya, Jawa Timur</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-[#2C2C2C]">
                    {userStats.posts}
                  </p>
                  <p className="text-xs text-gray-600">Postingan</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2C2C2C]">
                    {userStats.transactions}
                  </p>
                  <p className="text-xs text-gray-600">Transaksi</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2C2C2C]">
                    {userStats.reviews}
                  </p>
                  <p className="text-xs text-gray-600">Ulasan</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => handleMenuClick("profile")}
                className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Profil Saya</p>
                  <p className="text-sm text-gray-500">
                    Kelola informasi profil
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMenuClick("notifications")}
                className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center relative">
                  <Bell className="w-4 h-4 text-green-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Notifikasi</p>
                  <p className="text-sm text-gray-500">5 notifikasi baru</p>
                </div>
              </button>

              <button
                onClick={() => handleMenuClick("settings")}
                className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Pengaturan</p>
                  <p className="text-sm text-gray-500">Preferensi & privasi</p>
                </div>
              </button>

              <button
                onClick={() => handleMenuClick("security")}
                className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Keamanan</p>
                  <p className="text-sm text-gray-500">
                    Password & autentikasi
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMenuClick("help")}
                className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Bantuan</p>
                  <p className="text-sm text-gray-500">FAQ & dukungan</p>
                </div>
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
