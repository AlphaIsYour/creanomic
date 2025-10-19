/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MATERIAL_TYPE_LABELS: Record<string, string> = {
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

const OFFER_TYPE_LABELS: Record<string, string> = {
  SELL: "Dijual",
  DONATE: "Donasi",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Tersedia",
  RESERVED: "Direservasi",
  TAKEN: "Diambil",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  return `${diffDays} hari yang lalu`;
}

export default function WasteOfferDetailClient({ offer }: any) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isReserving, setIsReserving] = useState(false);

  const getStatusBadge = () => {
    const badges: Record<string, { bg: string; text: string; border: string }> =
      {
        AVAILABLE: {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        },
        RESERVED: {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
        },
        TAKEN: {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        },
        COMPLETED: {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        },
        CANCELLED: {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        },
      };
    const badge = badges[offer.status] || badges.AVAILABLE;
    return `${badge.bg} ${badge.text} ${badge.border}`;
  };

  const handleViewOnMap = () => {
    // Buka Google Maps dengan koordinat
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${offer.latitude},${offer.longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="relative h-96 bg-gray-100">
                {offer.images?.[selectedImage] ? (
                  <Image
                    src={offer.images[selectedImage]}
                    alt={offer.title}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📦</div>
                      <p className="text-gray-400 text-sm">Tidak ada gambar</p>
                    </div>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                      offer.offerType === "SELL"
                        ? "bg-[#8C1007] text-white"
                        : "bg-[#F4E1D2] text-[#8C1007]"
                    }`}
                  >
                    {OFFER_TYPE_LABELS[offer.offerType]}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 shadow-lg ${getStatusBadge()}`}
                  >
                    {STATUS_LABELS[offer.status] || offer.status}
                  </span>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {offer.images?.length > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {offer.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === i
                            ? "border-[#8C1007] shadow-md scale-105"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Gambar ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {offer.title}
              </h1>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Jenis Material
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {MATERIAL_TYPE_LABELS[offer.materialType]}
                  </p>
                </div>
                {offer.weight && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Berat
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {offer.weight} kg
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Diposting
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatTimeAgo(new Date(offer.createdAt))}
                  </p>
                </div>
              </div>

              {/* Price Section */}
              {offer.offerType === "SELL" && offer.suggestedPrice && (
                <div className="bg-gradient-to-br from-[#8C1007] to-[#6d0c05] rounded-lg p-6 mb-8">
                  <p className="text-sm font-medium text-white/80 mb-1">
                    Harga Penawaran
                  </p>
                  <p className="text-4xl font-bold text-white">
                    Rp {offer.suggestedPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Deskripsi
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {offer.description}
                </p>
              </div>

              {/* Condition */}
              {offer.condition && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Kondisi
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {offer.condition}
                  </p>
                </div>
              )}
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Lokasi Pengambilan
              </h2>
              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-700 leading-relaxed">{offer.address}</p>
              </div>
              <button
                onClick={handleViewOnMap}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Lihat di Google Maps
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pemilik</h3>
              <div className="flex items-center gap-3 mb-5">
                {offer.user.image ? (
                  <Image
                    src={offer.user.image}
                    alt={offer.user.name}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {offer.user.name}
                  </p>
                  <p className="text-sm text-gray-600">{offer.user.email}</p>
                  {offer.user.phone && (
                    <p className="text-xs text-gray-500 mt-1">
                      {offer.user.phone}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  const phone = offer.user.phone?.replace(/[^0-9]/g, "") || "";
                  const message = encodeURIComponent(
                    `Halo, saya tertarik dengan penawaran sampah Anda:\n${offer.title}\n\nApakah masih tersedia?`
                  );
                  const whatsappUrl = `https://wa.me/${
                    phone.startsWith("0") ? "62" + phone.slice(1) : phone
                  }?text=${message}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="w-full text-center px-4 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20BA5A] transition-all shadow-sm hover:shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Hubungi via WhatsApp
                </span>
              </button>
            </div>

            {/* Collector Card */}
            {offer.pengepul && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Diambil Oleh
                </h3>
                <div className="flex items-center gap-3">
                  {offer.pengepul.user.image ? (
                    <Image
                      src={offer.pengepul.user.image}
                      alt={offer.pengepul.user.name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {offer.pengepul.companyName || offer.pengepul.user.name}
                    </p>
                    <p className="text-sm text-gray-600">Pengepul</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
