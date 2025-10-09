// app/waste-offers/completed/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { WasteOffer, MATERIAL_TYPE_LABELS } from "@/types/waste-offer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function CompletedWasteOffersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [offers, setOffers] = useState<WasteOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (
      session?.user.role !== "USER" &&
      session?.user.role !== "ADMIN"
    ) {
      router.push("/waste-offers");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session) {
      fetchCompletedOffers();
    }
  }, [session]);

  const fetchCompletedOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/waste-offers/my-offers?status=completed"
      );

      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Error fetching completed offers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/waste-offers/manage"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Riwayat Penawaran
              </h1>
              <p className="mt-1 text-gray-600">Penawaran yang telah selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                        {offer.images && offer.images.length > 0 ? (
                          <Image
                            src={offer.images[0]}
                            alt={offer.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg
                              className="w-12 h-12 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {offer.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full">
                              {MATERIAL_TYPE_LABELS[offer.materialType]}
                            </span>
                            {offer.weight && <span>{offer.weight} kg</span>}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Selesai
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {offer.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                          <p className="text-sm text-gray-900 flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-gray-400 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{offer.address}</span>
                          </p>
                        </div>

                        {offer.completedAt && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Tanggal Selesai
                            </p>
                            <p className="text-sm text-gray-900 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {format(
                                new Date(offer.completedAt),
                                "dd MMMM yyyy",
                                { locale: idLocale }
                              )}
                            </p>
                          </div>
                        )}

                        {offer.offerType === "SELL" && offer.suggestedPrice && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Harga</p>
                            <p className="text-sm font-semibold text-[#8C1007]">
                              Rp {offer.suggestedPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                        )}

                        {offer.pengepul && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Pengepul
                            </p>
                            <p className="text-sm text-gray-900 font-medium">
                              {offer.pengepul.companyName ||
                                offer.pengepul.user.name}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {offer.pengepul && (
                        <div className="flex gap-3">
                          <Link
                            href={`/reviews/create?pengepulId=${offer.pengepul.id}&offerId=${offer.id}`}
                            className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
                          >
                            Beri Review
                          </Link>
                          <Link
                            href={`/chat?pengepulId=${offer.pengepul.id}`}
                            className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Hubungi Pengepul
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Belum ada riwayat
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Penawaran yang telah selesai akan muncul di sini.
            </p>
            <Link
              href="/waste-offers/manage"
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
            >
              Kembali ke Kelola Penawaran
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
