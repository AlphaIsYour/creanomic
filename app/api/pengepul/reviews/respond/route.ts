// app/api/pengepul/reviews/respond/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reviewId, response } = body;

    if (!reviewId || !response) {
      return NextResponse.json(
        { error: "Review ID and response are required" },
        { status: 400 }
      );
    }

    // Verify that the review belongs to this pengepul
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        pengepul: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.pengepul?.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only respond to your own reviews" },
        { status: 403 }
      );
    }

    // Update review with response
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response,
        respondedAt: new Date(),
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Create notification for reviewer
    await prisma.notification.create({
      data: {
        userId: review.reviewerId,
        title: "Balasan Review",
        message: `Pengepul telah membalas review Anda`,
        type: "REVIEW_RECEIVED",
        actionUrl: `/reviews/${reviewId}`,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: updatedReview.id,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        response: updatedReview.response,
        respondedAt: updatedReview.respondedAt,
        createdAt: updatedReview.createdAt,
        reviewer: updatedReview.reviewer,
      },
    });
  } catch (error) {
    console.error("Error responding to review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
