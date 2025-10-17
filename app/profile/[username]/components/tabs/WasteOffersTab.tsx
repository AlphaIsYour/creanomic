/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Calendar,
  Weight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WasteOffersTabProps {
  wasteOffers: any[];
}

const materialLabels: Record<string, string> = {
  PLASTIC: "Plastik",
  GLASS: "Kaca",
  METAL: "Logam",
  PAPER: "Kertas",
  CARDBOARD: "Kardus",
  ELECTRONIC: "Elektronik",
  TEXTILE: "Tekstil",
  WOOD: "Kayu",
  RUBBER: "Karet",
  ORGANIC: "Organik",
  OTHER: "Lainnya",
};

const statusConfig = {
  AVAILABLE: {
    label: "Tersedia",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: CheckCircle2,
  },
  RESERVED: {
    label: "Dipesan",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Clock,
  },
  TAKEN: {
    label: "Diambil",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Package,
  },
  COMPLETED: {
    label: "Selesai",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
};

export default function WasteOffersTab({ wasteOffers }: WasteOffersTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {wasteOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wasteOffers.map((offer, index) => {
            const status =
              statusConfig[offer.status as keyof typeof statusConfig] ||
              statusConfig.AVAILABLE;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/waste-offers/${offer.id}`}
                  className="group block bg-white border-2 border-[#2C2C2C] overflow-hidden hover:border-[#8C1007] transition-all duration-300 hover:shadow-2xl relative"
                >
                  {/* Image with Progressive Blur Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {offer.images?.[0] ? (
                      <>
                        <Image
                          src={offer.images[0]}
                          alt={offer.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Progressive Blur Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[1px]" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F4E1D2]">
                        <Package className="w-16 h-16 text-[#8C1007] opacity-30" />
                      </div>
                    )}

                    {/* Status Badge - Top Right */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 ${status.bgColor} border border-${status.color}`}
                      >
                        <StatusIcon
                          className={`w-3.5 h-3.5 ${status.textColor}`}
                        />
                        <span
                          className={`text-xs font-semibold ${status.textColor}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Offer Type Badge - Top Left */}
                    <div className="absolute top-3 left-3">
                      <div
                        className={`px-3 py-1.5 text-xs font-bold border-2 ${
                          offer.offerType === "SELL"
                            ? "bg-[#8C1007] text-white border-[#8C1007]"
                            : "bg-emerald-600 text-white border-emerald-600"
                        }`}
                      >
                        {offer.offerType === "SELL" ? "JUAL" : "DONASI"}
                      </div>
                    </div>

                    {/* Material Type - Bottom Left on Image */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 border-2 border-[#2C2C2C]">
                        <span className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wide">
                          {materialLabels[offer.materialType] ||
                            offer.materialType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-base text-[#2C2C2C] mb-2 line-clamp-1 group-hover:text-[#8C1007] transition-colors">
                      {offer.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {offer.description}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-3">
                      {offer.weight && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Weight className="w-3.5 h-3.5 text-[#8C1007]" />
                          <span className="font-semibold">
                            {offer.weight} kg
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-[#8C1007] flex-shrink-0" />
                        <span className="line-clamp-1">{offer.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(offer.createdAt)}</span>
                      </div>
                    </div>

                    {/* Price / Donation */}
                    {offer.offerType === "SELL" && offer.suggestedPrice ? (
                      <div className="pt-3 border-t-2 border-[#F4E1D2]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-500 font-medium">
                            Est. Harga:
                          </span>
                          <span className="text-lg font-bold text-[#8C1007]">
                            Rp {offer.suggestedPrice.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t-2 border-[#F4E1D2]">
                        <span className="text-sm font-semibold text-emerald-600">
                          ✨ Gratis untuk Pengepul
                        </span>
                      </div>
                    )}

                    {/* Pengepul Info if taken/reserved */}
                    {(offer.status === "RESERVED" ||
                      offer.status === "TAKEN" ||
                      offer.status === "COMPLETED") &&
                      offer.pengepul && (
                        <div className="mt-3 pt-3 border-t-2 border-[#F4E1D2]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#8C1007] flex items-center justify-center text-white text-xs font-bold">
                              {offer.pengepul.user.name?.[0]?.toUpperCase() ||
                                "P"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">
                                Diambil oleh:
                              </p>
                              <p className="text-xs font-semibold text-[#2C2C2C] truncate">
                                {offer.pengepul.companyName ||
                                  offer.pengepul.user.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F4E1D2] border-2 border-[#2C2C2C] flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-[#8C1007]" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">
            Belum Ada Penawaran Sampah
          </h3>
          <p className="text-sm text-gray-600">
            Mulai tawarkan sampah yang bisa didaur ulang!
          </p>
        </div>
      )}
    </motion.div>
  );
}
