/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewsTabProps {
  reviews: any[];
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 border-2 border-[#2C2C2C] shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2C2C2C] flex-shrink-0 shadow-sm">
                  {review.reviewer.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name || "User"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#8C1007] to-[#B91C1C] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {review.reviewer.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#2C2C2C] text-base">
                        {review.reviewer.name || "Pengguna"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images */}
                  {review.images?.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      {review.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#2C2C2C] shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Image
                            src={img}
                            alt={`Review image ${i + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Response */}
                  {review.response && (
                    <div className="mt-4 bg-gradient-to-r from-[#FFF5F5] to-[#FEE2E2] rounded-lg p-4 border-l-4 border-[#8C1007]">
                      <p className="text-xs font-bold text-[#8C1007] mb-2 uppercase tracking-wide">
                        Respon Penjual
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {review.response}
                      </p>
                      {review.respondedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.respondedAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F4E1D2] border-2 border-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-[#8C1007]" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">
            Belum Ada Ulasan
          </h3>
          <p className="text-sm text-gray-600">
            Ulasan dari pembeli akan ditampilkan di sini
          </p>
        </div>
      )}
    </motion.div>
  );
}
