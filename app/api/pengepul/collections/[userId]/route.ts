// app/api/pengepul/collections/[userId]/route.ts
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
    const limit = parseInt(searchParams.get("limit") || "6");
    const period = searchParams.get("period") || "30";
    const chartOnly = searchParams.get("chartOnly") === "true";

    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

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

    // Chart data - group by date
    const chartData = [];
    const daysArray = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date;
    });

    for (const date of daysArray) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const collections = await prisma.wasteOffer.findMany({
        where: {
          pengepulId: pengepul.id,
          status: {
            in: ["COMPLETED", "TAKEN"],
          },
          takenAt: {
            gte: date,
            lt: nextDate,
          },
        },
        select: {
          weight: true,
        },
      });

      const totalWeight = collections.reduce(
        (sum, c) => sum + (c.weight || 0),
        0
      );
      const count = collections.length;

      chartData.push({
        date: date.toISOString().split("T")[0],
        collections: count,
        weight: Math.round(totalWeight * 100) / 100,
      });
    }

    if (chartOnly) {
      return NextResponse.json({ chartData });
    }

    // Recent collections with pagination
    const skip = (page - 1) * limit;

    const [collections, totalCount] = await Promise.all([
      prisma.wasteOffer.findMany({
        where: {
          pengepulId: pengepul.id,
          status: {
            in: ["COMPLETED", "TAKEN"],
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
        orderBy: {
          takenAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.wasteOffer.count({
        where: {
          pengepulId: pengepul.id,
          status: {
            in: ["COMPLETED", "TAKEN"],
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      collections: collections.map((c) => ({
        id: c.id,
        title: c.title,
        materialType: c.materialType,
        weight: c.weight,
        offerType: c.offerType,
        suggestedPrice: c.suggestedPrice,
        status: c.status,
        address: c.address,
        takenAt: c.takenAt,
        completedAt: c.completedAt,
        user: c.user,
      })),
      chartData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
