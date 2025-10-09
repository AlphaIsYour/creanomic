import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, response } = body;

    if (!reviewId || !response) {
      return NextResponse.json(
        { error: "Review ID and response are required" },
        { status: 400 }
      );
    }

    // Get user's pengrajin profile
    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    // Verify review belongs to this pengrajin
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        OR: [
          { pengrajinId: pengrajinProfile.id },
          {
            product: {
              pengrajinId: pengrajinProfile.id,
            },
          },
        ],
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update review with response
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response,
        respondedAt: new Date(),
      },
      select: {
        id: true,
        response: true,
        respondedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        ...updatedReview,
        respondedAt: updatedReview.respondedAt?.toISOString() || null,
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
