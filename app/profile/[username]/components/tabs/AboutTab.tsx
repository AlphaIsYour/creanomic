/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  Award,
  Clock,
  MapPin,
  TrendingUp,
  Package as PackageIcon,
} from "lucide-react";
import Image from "next/image";

interface AboutTabProps {
  user: any;
  profileData: any;
}

export default function AboutTab({ user, profileData }: AboutTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Description */}
      {profileData?.description && (
        <div className="bg-white rounded-xl p-6 border border-[#2C2C2C] shadow-sm">
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">Deskripsi</h3>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
            {profileData.description}
          </p>
        </div>
      )}

      {/* Pengrajin Specific */}
      {user.role === "PENGRAJIN" && profileData && (
        <>
          {/* Craft Types */}
          {profileData.craftTypes?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
                Jenis Kerajinan
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.craftTypes.map((type: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold border-2 border-purple-200 hover:border-purple-400 transition-colors"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profileData.yearsOfExperience && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-300 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-amber-400">
                  <Award className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-900">
                    {profileData.yearsOfExperience} Tahun Pengalaman
                  </p>
                  <p className="text-sm text-amber-700">
                    Profesional di bidang kerajinan
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profileData.portfolio?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
                Portfolio
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.portfolio
                  .slice(0, 6)
                  .map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-square rounded-xl overflow-hidden border border-[#2C2C2C] shadow-md hover:shadow-xl transition-all group cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Portfolio ${i + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Specialized Materials */}
          {profileData.specializedMaterials?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
                Material Yang Digunakan
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.specializedMaterials.map(
                  (material: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border-2 border-green-200 hover:border-green-400 transition-colors"
                    >
                      {material}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pengepul Specific */}
      {user.role === "PENGEPUL" && profileData && (
        <>
          {/* Company Name */}
          {profileData.companyName && (
            <div className="bg-white rounded-xl p-6 border-2 border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">
                Nama Perusahaan
              </h3>
              <p className="text-[#8C1007] text-2xl font-bold">
                {profileData.companyName}
              </p>
            </div>
          )}

          {/* Specialized Materials */}
          {profileData.specializedMaterials?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border-2 border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
                Material Yang Diterima
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.specializedMaterials.map(
                  (material: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border-2 border-green-200 hover:border-green-400 transition-colors"
                    >
                      {material}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Operating Area */}
          {profileData.operatingArea?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border-2 border-[#2C2C2C] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">
                Area Operasional
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.operatingArea.map((area: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border-2 border-blue-200 hover:border-blue-400 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Working Hours */}
          {profileData.workingHours && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-blue-400">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Jam Operasional
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {profileData.workingHours}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Collection Stats */}
          {profileData.totalCollections > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-300 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <p className="text-xs text-emerald-700 font-semibold uppercase">
                    Total Pengambilan
                  </p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  {profileData.totalCollections}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-300 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <PackageIcon className="w-5 h-5 text-emerald-600" />
                  <p className="text-xs text-emerald-700 font-semibold uppercase">
                    Total Berat
                  </p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  {profileData.totalWeight.toFixed(1)} kg
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
