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
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 rounded-xl p-5 border border-gray-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {review.reviewer.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {review.reviewer.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {review.reviewer.name || "Pengguna"}
                      </h4>
                      <p className="text-xs text-gray-500">
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
                    <div className="flex items-center gap-0.5">
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
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images */}
                  {review.images?.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={img}
                            alt={`Review image ${i + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Response */}
                  {review.response && (
                    <div className="mt-3 bg-white rounded-lg p-3 border-l-2 border-[#8C1007]">
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        Respon Penjual
                      </p>
                      <p className="text-sm text-gray-700">{review.response}</p>
                      {review.respondedAt && (
                        <p className="text-xs text-gray-500 mt-1">
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
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada ulasan</p>
        </div>
      )}
    </motion.div>
  );
}
