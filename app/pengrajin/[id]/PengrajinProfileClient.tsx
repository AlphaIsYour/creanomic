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

export default function PengrajinProfileClient({ pengrajin }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">(
    "products"
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
      <div className="bg-gradient-to-r from-[#8C1007] to-[#a01008] text-white">
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
              {pengrajin.user.image ? (
                <Image
                  src={pengrajin.user.image}
                  alt={pengrajin.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{pengrajin.user.name}</h1>
              <p className="text-white/90 mb-4">Pengrajin</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">
                      {pengrajin.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-300">★</span>
                    <span className="text-sm text-white/70">
                      ({pengrajin.totalReviews})
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Produk</p>
                  <p className="text-xl font-bold">{pengrajin.totalProducts}</p>
                </div>

                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm text-white/80">Terjual</p>
                  <p className="text-xl font-bold">{pengrajin.totalSales}</p>
                </div>

                {pengrajin.yearsOfExperience && (
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm text-white/80">Pengalaman</p>
                    <p className="text-xl font-bold">
                      {pengrajin.yearsOfExperience} tahun
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* <Link
                  href={`/chat?userId=${pengrajin.userId}`}
                  className="px-6 py-2 bg-white text-[#8C1007] font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  💬 Chat
                </Link> */}
                {pengrajin.whatsappNumber && (
                  <a
                    href={`https://wa.me/${pengrajin.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 border border-white/0 hover:border-white/50 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {pengrajin.instagramHandle && (
                  <a
                    href={`https://instagram.com/${pengrajin.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg border border-white/0 hover:border-white/50 hover:bg-pink-600 transition-colors"
                  >
                    Instagram
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
            {["products", "reviews", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "products" && `Produk (${pengrajin.products.length})`}
                {tab === "reviews" && `Review (${pengrajin.reviews.length})`}
                {tab === "about" && "Tentang"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            {pengrajin.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pengrajin.products.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/marketplace/products/${product.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-[#8C1007] font-bold text-lg">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>Stok: {product.stock}</span>
                        {product.customizable && <span>• Custom</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada produk</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {pengrajin.reviews.length > 0 ? (
              pengrajin.reviews.map((review: any) => (
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
                <h2 className="text-xl font-semibold mb-4">
                  Tentang Pengrajin
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {pengrajin.description || "Belum ada deskripsi"}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Jenis Kerajinan</h2>
                <div className="flex flex-wrap gap-2">
                  {pengrajin.craftTypes.map((type: string) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-[#F4E1D2] text-[#8C1007] rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Material Spesialisasi
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pengrajin.specializedMaterials.map((material: string) => (
                    <span
                      key={material}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {MATERIAL_LABELS[material] || material}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Lokasi Workshop</h2>
                {pengrajin.workshopAddress ? (
                  <>
                    <p className="text-gray-700 mb-4">
                      📍 {pengrajin.workshopAddress}
                    </p>
                    {pengrajin.workshopLatitude &&
                      pengrajin.workshopLongitude && (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard?lat=${pengrajin.workshopLatitude}&lng=${pengrajin.workshopLongitude}`
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          🗺️ Lihat di Peta
                        </button>
                      )}
                  </>
                ) : (
                  <p className="text-gray-500">Lokasi belum diatur</p>
                )}
              </div>

              {pengrajin.portfolio?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {pengrajin.portfolio.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt={`Portfolio ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
