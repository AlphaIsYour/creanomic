/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Share2,
  MessageCircle,
  Heart,
  CheckCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfileHeaderProps {
  user: any;
  profileData: any;
  roleBadge: any;
  isOwnProfile: boolean;
  isAuthenticated: boolean;
  onShare: () => void;
}

export default function ProfileHeader({
  user,
  profileData,
  roleBadge,
  isOwnProfile,
  isAuthenticated,
  onShare,
}: ProfileHeaderProps) {
  return (
    <>
      {/* Minimalist Cover */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-white border-b border-gray-200">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#8C1007] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="p-2.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm border border-gray-200"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </motion.button>
          {isOwnProfile && (
            <Link href="/settings/profile">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-200 flex items-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 pt-12 pl-6  pb-6 pr-6 md:pt-16 md:pl-8 md:pb-8 md:pr-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative flex-shrink-0"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-4xl">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              {user.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full ring-2 ring-white"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name || "Pengguna"}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span
                    className={`${roleBadge.color} text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5`}
                  >
                    <roleBadge.icon className="w-3.5 h-3.5" />
                    {roleBadge.label}
                  </span>
                  {profileData?.averageRating > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-amber-900 text-sm">
                        {profileData.averageRating.toFixed(1)}
                      </span>
                      <span className="text-amber-700 text-xs">
                        ({profileData.totalReviews})
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {user.email && (
                    <ContactItem
                      icon={Mail}
                      text={user.email}
                      iconColor="text-blue-600"
                    />
                  )}
                  {user.phone && (
                    <ContactItem
                      icon={Phone}
                      text={user.phone}
                      iconColor="text-green-600"
                    />
                  )}
                  {user.address && (
                    <ContactItem
                      icon={MapPin}
                      text={user.address}
                      iconColor="text-red-600"
                    />
                  )}
                  {profileData?.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#8C1007] transition-colors">
                        <Globe className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="truncate group-hover:underline">
                          Website
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-[#8C1007] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#6d0c05] transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Kirim Pesan
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function ContactItem({ icon: Icon, text, iconColor }: any) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
      <span className="truncate">{text}</span>
    </div>
  );
}
