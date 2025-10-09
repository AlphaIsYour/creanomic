// app/api/pengepul/stats/[userId]/route.ts
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

    // Get pengepul profile
    const pengepul = await prisma.pengepulProfile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!pengepul) {
      return NextResponse.json(
        { error: "Pengepul profile not found" },
        { status: 404 }
      );
    }

    // Get period from query params (default: 30 days)
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total collections (COMPLETED + TAKEN)
    const totalCollections = await prisma.wasteOffer.count({
      where: {
        pengepulId: pengepul.id,
        status: {
          in: ["COMPLETED", "TAKEN"],
        },
        takenAt: {
          gte: startDate,
        },
      },
    });

    // Total weight
    const wasteOffers = await prisma.wasteOffer.findMany({
      where: {
        pengepulId: pengepul.id,
        status: {
          in: ["COMPLETED", "TAKEN"],
        },
        takenAt: {
          gte: startDate,
        },
      },
      select: {
        weight: true,
      },
    });

    const totalWeight = wasteOffers.reduce((sum, offer) => {
      return sum + (offer.weight || 0);
    }, 0);

    // Total income from transactions (WASTE_PURCHASE only)
    const transactions = await prisma.transaction.findMany({
      where: {
        pengepulId: pengepul.id,
        type: "WASTE_PURCHASE",
        status: "COMPLETED",
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
      },
    });

    const totalIncome = transactions.reduce((sum, tx) => {
      return sum + (tx.amount || 0);
    }, 0);

    // Get reviews count and average rating (all time)
    const reviewsCount = await prisma.review.count({
      where: {
        pengepulId: pengepul.id,
      },
    });

    const reviewsData = await prisma.review.aggregate({
      where: {
        pengepulId: pengepul.id,
      },
      _avg: {
        rating: true,
      },
    });

    // Recent collections for growth calculation
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const prevCollections = await prisma.wasteOffer.count({
      where: {
        pengepulId: pengepul.id,
        status: {
          in: ["COMPLETED", "TAKEN"],
        },
        takenAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    // Calculate growth percentage
    const collectionsGrowth =
      prevCollections > 0
        ? ((totalCollections - prevCollections) / prevCollections) * 100
        : totalCollections > 0
        ? 100
        : 0;

    return NextResponse.json({
      stats: {
        totalCollections,
        totalWeight: Math.round(totalWeight * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        averageRating: reviewsData._avg.rating || 0,
        totalReviews: reviewsCount,
        collectionsGrowth: Math.round(collectionsGrowth * 10) / 10,
      },
      profile: {
        companyName: pengepul.companyName,
        specializedMaterials: pengepul.specializedMaterials,
        averageRating: pengepul.averageRating,
        totalCollections: pengepul.totalCollections,
        approvalStatus: pengepul.approvalStatus,
      },
      user: pengepul.user,
    });
  } catch (error) {
    console.error("Error fetching pengepul stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}