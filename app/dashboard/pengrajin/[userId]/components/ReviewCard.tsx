"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  reviewer: {
    name: string;
    image: string | null;
  };
  product?: {
    title: string;
  } | null;
}

interface ReviewCardProps {
  review: Review;
  onRespond: (reviewId: string, response: string) => Promise<void>;
}

export default function ReviewCard({ review, onRespond }: ReviewCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState(review.response || "");
  const [loading, setLoading] = useState(false);

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    try {
      await onRespond(review.id, responseText);
      setIsResponding(false);
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            {review.reviewer.image ? (
              <Image
                src={review.reviewer.image}
                alt={review.reviewer.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8C1007] font-semibold bg-[#F4E1D2]">
                {review.reviewer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-[#2C2C2C] text-sm">
              {review.reviewer.name}
            </h4>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        {renderStars(review.rating)}
      </div>

      {/* Product */}
      {review.product && (
        <p className="text-sm text-gray-600 mb-2">
          Produk: <span className="font-medium">{review.product.title}</span>
        </p>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-[#2C2C2C] mb-3">{review.comment}</p>
      )}

      {/* Images */}
      {review.images.length > 0 && (
        <div className="flex space-x-2 mb-3">
          {review.images.map((img, idx) => (
            <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`Review image ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Response Section */}
      {review.response ? (
        <div className="mt-4 pl-4 border-l-2 border-[#F4E1D2] bg-[#F4E1D2]/20 p-3 rounded-r-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-[#8C1007]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span className="text-xs font-medium text-[#8C1007]">
              Balasan Anda
            </span>
          </div>
          <p className="text-sm text-[#2C2C2C]">{review.response}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(review.respondedAt!).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      ) : isResponding ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Tulis balasan Anda..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsResponding(false)}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={handleSubmitResponse}
              disabled={loading || !responseText.trim()}
              className="px-3 py-1.5 text-sm bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0a05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsResponding(true)}
          className="mt-3 text-sm text-[#8C1007] hover:underline font-medium"
        >
          Balas Review
        </button>
      )}
    </motion.div>
  );
}
