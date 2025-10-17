// app/api/user/stats/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = params;

    // Get user with their profiles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pengepulProfile: true,
        pengrajinProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count waste offers
    const wasteOffers = await prisma.wasteOffer.count({
      where: { userId },
    });

    // Count transactions
    const transactions = await prisma.transaction.count({
      where: { userId },
    });

    // Get reviews as reviewer (reviews given)
    const reviewsGiven = await prisma.review.count({
      where: { reviewerId: userId },
    });

    // Calculate average rating received
    let averageRating = 0;
    let totalReviews = 0;

    if (user.role === "PENGEPUL" && user.pengepulProfile) {
      averageRating = user.pengepulProfile.averageRating;
      totalReviews = user.pengepulProfile.totalReviews;
    } else if (user.role === "PENGRAJIN" && user.pengrajinProfile) {
      averageRating = user.pengrajinProfile.averageRating;
      totalReviews = user.pengrajinProfile.totalReviews;
    }

    // For Pengrajin: count products and bookings
    let totalProducts = 0;
    let totalBookings = 0;

    if (user.role === "PENGRAJIN" && user.pengrajinProfile) {
      totalProducts = await prisma.craftProduct.count({
        where: {
          pengrajinId: user.pengrajinProfile.id,
          status: "PUBLISHED",
        },
      });

      totalBookings = await prisma.serviceBooking.count({
        where: { pengrajinId: user.pengrajinProfile.id },
      });
    }

    return NextResponse.json({
      wasteOffers,
      transactions,
      reviews: totalReviews,
      reviewsGiven,
      averageRating,
      totalProducts,
      totalBookings,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
