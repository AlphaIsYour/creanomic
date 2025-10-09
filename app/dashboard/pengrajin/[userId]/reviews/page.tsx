/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import ReviewCard from "@/app/dashboard/pengrajin/[userId]/components/ReviewCard";
import {
  StarIcon,
  FunnelIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasMore: boolean;
}

export default function ReviewsPage({
  params,
}: {
  params: { userId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterResponded, setFilterResponded] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      if (session.user.id !== params.userId) {
        router.push("/");
        return;
      }
      fetchReviews();
    }
  }, [
    status,
    session,
    params.userId,
    filterRating,
    filterResponded,
    currentPage,
    router,
  ]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (filterRating !== "all") {
        queryParams.append("rating", filterRating);
      }
      if (filterResponded !== "all") {
        queryParams.append("responded", filterResponded);
      }

      const res = await fetch(
        `/api/pengrajin/reviews/${params.userId}?${queryParams}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string, response: string) => {
    try {
      const res = await fetch("/api/pengrajin/reviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, response }),
      });

      if (res.ok) {
        // Refresh reviews
        fetchReviews();
      }
    } catch (error) {
      console.error("Error responding to review:", error);
      throw error;
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  if (status === "loading" || loading) {
    return (
      <DashboardLayout userId={params.userId}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-lg border"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={params.userId}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">
            Review Pelanggan
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola dan balas review dari pelanggan Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Rating */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-[#8C1007]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Rating Rata-rata</p>
            <div className="flex items-end space-x-2">
              <h3 className="text-3xl font-bold text-[#2C2C2C]">
                {averageRating.toFixed(1)}
              </h3>
              <div className="flex pb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <ChatBubbleLeftIcon className="w-6 h-6 text-[#8C1007]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Review</p>
            <h3 className="text-3xl font-bold text-[#2C2C2C]">
              {pagination?.totalReviews || 0}
            </h3>
          </div>

          {/* Response Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4E1D2] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#8C1007]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Tingkat Respon</p>
            <h3 className="text-3xl font-bold text-[#2C2C2C]">
              {reviews.length > 0
                ? Math.round(
                    (reviews.filter((r) => r.response).length /
                      reviews.length) *
                      100
                  )
                : 0}
              %
            </h3>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-[#2C2C2C] mb-4">
            Distribusi Rating
          </h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-20">
                  <span className="text-sm font-medium text-[#2C2C2C]">
                    {star}
                  </span>
                  <StarIconSolid className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8C1007] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>

            <select
              value={filterRating}
              onChange={(e) => {
                setFilterRating(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            >
              <option value="all">Semua Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>

            <select
              value={filterResponded}
              onChange={(e) => {
                setFilterResponded(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="false">Belum Dibalas</option>
              <option value="true">Sudah Dibalas</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">
                Belum Ada Review
              </h3>
              <p className="text-sm text-gray-600">
                Review dari pelanggan akan muncul di sini
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onRespond={handleRespond}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>

            <div className="flex items-center space-x-1">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#8C1007] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={currentPage === pagination.totalPages}
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
