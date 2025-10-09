/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: {
      name: string | null;
      image: string | null;
    };
    response: string | null;
    respondedAt: string | null;
  };
  onRespond?: (reviewId: string, response: string) => void;
  isResponding?: boolean;
  setIsResponding?: (value: boolean) => void;
}

export default function ReviewCard({
  review,
  onRespond,
  isResponding,
  setIsResponding,
}: ReviewCardProps) {
  const [responseText, setResponseText] = useState("");

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <StarIcon key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="w-4 h-4 text-gray-300" />
          )
        )}
      </div>
    );
  };

  const handleSubmitResponse = () => {
    if (responseText.trim() && onRespond) {
      onRespond(review.id, responseText);
      setResponseText("");
    }
  };

  const handleCancel = () => {
    setResponseText("");
    setIsResponding?.(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.reviewer.image ? (
            <img
              src={review.reviewer.image}
              alt={review.reviewer.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-[#F4E1D2] rounded-full flex items-center justify-center">
              <span className="text-[#8C1007] font-semibold text-sm">
                {review.reviewer.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#2C2C2C]">
                {review.reviewer.name || "Anonymous"}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
          )}

          {/* Response */}
          {review.response ? (
            <div className="mt-3 bg-[#F4E1D2] rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold text-[#8C1007]">
                  Balasan Anda
                </span>
                <span className="text-xs text-gray-500">
                  {review.respondedAt &&
                    new Date(review.respondedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.response}</p>
            </div>
          ) : isResponding ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim()}
                  className="px-4 py-2 bg-[#8C1007] text-white text-sm font-medium rounded-lg hover:bg-[#6D0C05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Kirim Balasan
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            onRespond && (
              <button
                onClick={() => setIsResponding?.(true)}
                className="mt-3 text-sm text-[#8C1007] hover:underline font-medium"
              >
                Balas Review
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
