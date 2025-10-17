/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const rating = searchParams.get("rating");
    const responded = searchParams.get("responded");

    // Get pengrajin profile
    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = {
      OR: [
        { pengrajinId: pengrajinProfile.id },
        {
          product: {
            pengrajinId: pengrajinProfile.id,
          },
        },
      ],
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    if (responded === "true") {
      where.response = { not: null };
    } else if (responded === "false") {
      where.response = null;
    }

    // Get total count
    const totalReviews = await prisma.review.count({ where });

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where,
      select: {
        id: true,
        rating: true,
        comment: true,
        images: true,
        response: true,
        respondedAt: true,
        createdAt: true,
        reviewer: {
          select: {
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        respondedAt: review.respondedAt?.toISOString() || null,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: page * limit < totalReviews,
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
