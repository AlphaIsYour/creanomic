/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Share2,
  MessageCircle,
  Heart,
  Star,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <>
      {/* Cover Section - Professional Gradient */}
      <div className="relative h-64 border-b-1 border-[#2c2c2c] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-[#8C1007] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 z-10"
        >
          ← Kembali
        </button>
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Soft Gradient Overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-3xl" />

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md rounded-lg border-1 border-[#2c2c2c]"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </motion.button>
          {isOwnProfile && (
            <Link href="/settings/profile">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md rounded-lg border-1 border-[#2c2c2c]"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* Profile Card - Modern & Clean */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border-1 border-[#2c2c2c] overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar - Modern Circular */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative flex-shrink-0 mt-16"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-white relative">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-4xl">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 min-w-0 mt-20">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {user.name || "User"}
                  </h1>

                  <div className="flex items-center gap-3 flex-wrap mb-6">
                    <span
                      className={`${roleBadge.color} text-white px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm`}
                    >
                      <roleBadge.icon className="w-3.5 h-3.5" />
                      {roleBadge.label}
                    </span>
                    {profileData?.averageRating > 0 && (
                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-gray-900 text-sm">
                          {profileData.averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600 text-xs">
                          ({profileData.totalReviews})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <div className="mb-6">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {user.email && (
                      <ContactItem icon={Mail} text={user.email} />
                    )}
                    {user.phone && (
                      <ContactItem icon={Phone} text={user.phone} />
                    )}
                    {user.address && (
                      <ContactItem icon={MapPin} text={user.address} />
                    )}
                    {profileData?.website && (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate font-medium">Website</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Action Buttons - Professional */}
                  {!isOwnProfile && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm rounded-lg shadow-sm hover:shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-lg shadow-sm"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function ContactItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <span className="truncate font-medium">{text}</span>
    </div>
  );
}
