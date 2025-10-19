/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MATERIAL_LABELS: Record<string, string> = {
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

export default function PengepulProfileClient({ pengepul }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"activity" | "reviews" | "about">(
    "activity"
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            ← Kembali
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              {pengepul.user.image ? (
                <Image
                  src={pengepul.user.image}
                  alt={pengepul.companyName || pengepul.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-4xl">
                  🏢
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">
                {pengepul.companyName || pengepul.user.name}
              </h1>
              <p className="text-white/90 mb-4">Pengepul Sampah</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">
                      {pengepul.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-300">★</span>
                    <span className="text-sm text-white/70">
                      ({pengepul.totalReviews})
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Total Pengambilan</p>
                  <p className="text-xl font-bold">
                    {pengepul.totalCollections}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Total Berat</p>
                  <p className="text-xl font-bold">
                    {pengepul.totalWeight.toFixed(1)} kg
                  </p>
                </div>

                {pengepul.operatingRadius && (
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm text-white/80">Radius Operasi</p>
                    <p className="text-xl font-bold">
                      {pengepul.operatingRadius} km
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* <Link
                  href={`/chat?userId=${pengepul.userId}`}
                  className="px-6 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  💬 Chat
                </Link> */}
                {pengepul.whatsappNumber && (
                  <a
                    href={`https://wa.me/${pengepul.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 border border-white/0 hover:border-white/50 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {pengepul.website && (
                  <a
                    href={pengepul.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 border border-white/0 hover:border-white/50 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {["activity", "reviews", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "activity" &&
                  `Aktivitas (${pengepul.takenOffers.length})`}
                {tab === "reviews" && `Review (${pengepul.reviews.length})`}
                {tab === "about" && "Tentang"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            {pengepul.takenOffers.length > 0 ? (
              pengepul.takenOffers.map((offer: any) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {offer.images?.[0] ? (
                        <Image
                          src={offer.images[0]}
                          alt={offer.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {offer.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              🏷️ {MATERIAL_LABELS[offer.materialType]}
                            </span>
                            {offer.weight && <span>⚖️ {offer.weight} kg</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Selesai
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(offer.completedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {pengepul.reviews.length > 0 ? (
              pengepul.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      {review.reviewer.image ? (
                        <Image
                          src={review.reviewer.image}
                          alt={review.reviewer.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.reviewer.name}
                          </p>
                          <div className="flex items-center gap-1 text-sm">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((img: string, i: number) => (
                            <div
                              key={i}
                              className="relative w-20 h-20 rounded-md overflow-hidden"
                            >
                              <Image
                                src={img}
                                alt={`Review ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {review.response && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Balasan dari pengepul:
                          </p>
                          <p className="text-sm text-gray-700">
                            {review.response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">Belum ada review</p>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Tentang Pengepul</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {pengepul.description || "Belum ada deskripsi"}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Material yang Diterima
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pengepul.specializedMaterials.map((material: string) => (
                    <span
                      key={material}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {MATERIAL_LABELS[material] || material}
                    </span>
                  ))}
                </div>
              </div>

              {pengepul.operatingArea?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Area Operasi</h2>
                  <div className="flex flex-wrap gap-2">
                    {pengepul.operatingArea.map((area: string) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pengepul.workingHours && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    Jam Operasional
                  </h2>
                  <p className="text-gray-700">⏰ {pengepul.workingHours}</p>
                </div>
              )}

              {pengepul.priceList && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Daftar Harga</h2>
                  <div className="space-y-2">
                    {Object.entries(pengepul.priceList).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b"
                        >
                          <span className="text-gray-700">{key}</span>
                          <span className="font-semibold">
                            Rp {value?.toLocaleString("id-ID")}/kg
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
                <div className="space-y-3">
                  {pengepul.user.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Telepon</p>
                      <p className="font-medium">📞 {pengepul.user.phone}</p>
                    </div>
                  )}
                  {pengepul.user.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">✉️ {pengepul.user.email}</p>
                    </div>
                  )}
                  {pengepul.licenseNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Nomor Izin</p>
                      <p className="font-medium">📄 {pengepul.licenseNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Lokasi</h2>
                {pengepul.user.address ? (
                  <>
                    <p className="text-gray-700 mb-4">
                      📍 {pengepul.user.address}
                    </p>
                    {pengepul.user.latitude && pengepul.user.longitude && (
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard?lat=${pengepul.user.latitude}&lng=${pengepul.user.longitude}`
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        🗺️ Lihat di Peta
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Lokasi belum diatur</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
