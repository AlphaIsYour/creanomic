/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pengepul/reviews/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const rating = searchParams.get("rating");

    // Get pengepul profile
    const pengepul = await prisma.pengepulProfile.findUnique({
      where: { userId: params.userId },
    });

    if (!pengepul) {
      return NextResponse.json(
        { error: "Pengepul profile not found" },
        { status: 404 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      pengepulId: pengepul.id,
    };

    if (rating) {
      whereClause.rating = parseInt(rating);
    }

    // Fetch reviews with pagination
    const [reviews, totalCount, ratingDistribution] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: whereClause,
      }),
      // Get rating distribution
      prisma.review.groupBy({
        by: ["rating"],
        where: {
          pengepulId: pengepul.id,
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    // Format rating distribution
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const found = ratingDistribution.find((r) => r.rating === star);
      return {
        rating: star,
        count: found?._count.rating || 0,
      };
    });

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: {
        pengepulId: pengepul.id,
      },
      _avg: {
        rating: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        response: r.response,
        respondedAt: r.respondedAt,
        createdAt: r.createdAt,
        reviewer: r.reviewer,
      })),
      summary: {
        averageRating: avgRating._avg.rating || 0,
        totalReviews: totalCount,
        distribution,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
