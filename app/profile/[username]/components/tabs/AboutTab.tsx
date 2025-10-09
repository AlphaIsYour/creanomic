/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion } from "framer-motion";
import { Award, Clock, MapPin, TrendingUp } from "lucide-react";
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
      className="space-y-8"
    >
      {/* Description */}
      {profileData?.description && (
        <Section title="Deskripsi">
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
            {profileData.description}
          </p>
        </Section>
      )}

      {/* Pengrajin Specific */}
      {user.role === "PENGRAJIN" && profileData && (
        <>
          {/* Craft Types */}
          {profileData.craftTypes?.length > 0 && (
            <Section title="Jenis Kerajinan">
              <div className="flex flex-wrap gap-2">
                {profileData.craftTypes.map((type: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {profileData.yearsOfExperience && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-900 font-semibold">
                  {profileData.yearsOfExperience} Tahun Pengalaman
                </p>
                <p className="text-xs text-amber-700">
                  Profesional di bidang kerajinan
                </p>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profileData.portfolio?.length > 0 && (
            <Section title="Portfolio">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profileData.portfolio
                  .slice(0, 6)
                  .map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Portfolio ${i + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
              </div>
            </Section>
          )}

          {/* Specialized Materials */}
          {profileData.specializedMaterials?.length > 0 && (
            <Section title="Material Yang Digunakan">
              <div className="flex flex-wrap gap-2">
                {profileData.specializedMaterials.map(
                  (material: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                    >
                      {material}
                    </span>
                  )
                )}
              </div>
            </Section>
          )}
        </>
      )}

      {/* Pengepul Specific */}
      {user.role === "PENGEPUL" && profileData && (
        <>
          {/* Company Name */}
          {profileData.companyName && (
            <Section title="Nama Perusahaan">
              <p className="text-gray-900 text-lg font-medium">
                {profileData.companyName}
              </p>
            </Section>
          )}

          {/* Specialized Materials */}
          {profileData.specializedMaterials?.length > 0 && (
            <Section title="Material Yang Diterima">
              <div className="flex flex-wrap gap-2">
                {profileData.specializedMaterials.map(
                  (material: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                    >
                      {material}
                    </span>
                  )
                )}
              </div>
            </Section>
          )}

          {/* Operating Area */}
          {profileData.operatingArea?.length > 0 && (
            <Section title="Area Operasional">
              <div className="flex flex-wrap gap-2">
                {profileData.operatingArea.map((area: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {area}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Working Hours */}
          {profileData.workingHours && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-900 font-semibold">
                  Jam Operasional
                </p>
                <p className="text-sm text-blue-700">
                  {profileData.workingHours}
                </p>
              </div>
            </div>
          )}

          {/* Collection Stats */}
          {profileData.totalCollections > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700 font-medium">
                    Total Pengambilan
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {profileData.totalCollections}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700 font-medium">
                    Total Berat
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-900">
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
