// app/dashboard/pengepul/[userId]/reviews/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import ReviewCard from "../components/ReviewCard";
import {
  StarIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface RatingDistribution {
  rating: number;
  count: number;
}

export default function ReviewsPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [distribution, setDistribution] = useState<RatingDistribution[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const ratingFilter = selectedRating ? `&rating=${selectedRating}` : "";
      const res = await fetch(
        `/api/pengepul/reviews/${userId}?page=${currentPage}&limit=10${ratingFilter}`
      );
      const data = await res.json();

      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
      setAverageRating(data.summary.averageRating);
      setTotalReviews(data.summary.totalReviews);
      setDistribution(data.summary.distribution);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, selectedRating]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRespond = async (reviewId: string, response: string) => {
    try {
      const res = await fetch("/api/pengepul/reviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, response }),
      });

      if (res.ok) {
        // Update review in state
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, response, respondedAt: new Date().toISOString() }
              : r
          )
        );
        setRespondingTo(null);
      }
    } catch (error) {
      console.error("Error responding to review:", error);
    }
  };

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <DashboardLayout userId={userId}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review</h1>
            <p className="text-sm text-gray-500 mt-1">
              Lihat dan kelola review dari pengguna
            </p>
          </div>
          <button
            onClick={fetchReviews}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolidIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Dari {totalReviews} review
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="lg:col-span-2 space-y-2">
              {distribution.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full transition-all"
                      style={{ width: `${getPercentage(count)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRating("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRating === ""
                    ? "bg-[#8C1007] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedRating === rating.toString()
                      ? "bg-[#8C1007] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rating}
                  <StarSolidIcon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onRespond={handleRespond}
                isResponding={respondingTo === review.id}
                setIsResponding={(value: boolean) =>
                  setRespondingTo(value ? review.id : null)
                }
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
