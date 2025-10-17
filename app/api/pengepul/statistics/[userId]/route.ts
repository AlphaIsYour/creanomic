// app/api/pengepul/statistics/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pengepul = await prisma.pengepulProfile.findUnique({
      where: { userId: params.userId },
    });

    if (!pengepul) {
      return NextResponse.json(
        { error: "Pengepul profile not found" },
        { status: 404 }
      );
    }

    // Material Type Distribution
    const materialStats = await prisma.wasteOffer.groupBy({
      by: ["materialType"],
      where: {
        pengepulId: pengepul.id,
        status: { in: ["COMPLETED", "TAKEN"] },
        takenAt: { gte: startDate },
      },
      _count: { materialType: true },
      _sum: { weight: true },
    });

    // Offer Type Stats (SELL vs DONATE)
    const offerTypeStats = await prisma.wasteOffer.groupBy({
      by: ["offerType"],
      where: {
        pengepulId: pengepul.id,
        status: { in: ["COMPLETED", "TAKEN"] },
        takenAt: { gte: startDate },
      },
      _count: { offerType: true },
      _sum: { weight: true, suggestedPrice: true },
    });

    // Monthly Trends (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const collections = await prisma.wasteOffer.findMany({
        where: {
          pengepulId: pengepul.id,
          status: { in: ["COMPLETED", "TAKEN"] },
          takenAt: { gte: monthStart, lt: monthEnd },
        },
        select: { weight: true },
      });

      const transactions = await prisma.transaction.findMany({
        where: {
          pengepulId: pengepul.id,
          type: "WASTE_PURCHASE",
          status: "COMPLETED",
          createdAt: { gte: monthStart, lt: monthEnd },
        },
        select: { amount: true },
      });

      monthlyData.push({
        month: monthStart.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        collections: collections.length,
        weight: collections.reduce((sum, c) => sum + (c.weight || 0), 0),
        income: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      });
    }

    // Top Areas
    const areaStats = await prisma.$queryRaw<
      Array<{ address: string; count: bigint }>
    >`
      SELECT 
        SPLIT_PART(address, ',', -1) as address,
        COUNT(*) as count
      FROM "waste_offers"
      WHERE "pengepulId" = ${pengepul.id}
        AND status IN ('COMPLETED', 'TAKEN')
        AND "takenAt" >= ${startDate}
      GROUP BY SPLIT_PART(address, ',', -1)
      ORDER BY count DESC
      LIMIT 5
    `;

    // Performance Metrics
    const avgResponseTime = await prisma.$queryRaw<Array<{ avg: number }>>`
      SELECT AVG(EXTRACT(EPOCH FROM ("takenAt" - "createdAt"))/3600) as avg
      FROM "waste_offers"
      WHERE "pengepulId" = ${pengepul.id}
        AND status IN ('COMPLETED', 'TAKEN')
        AND "takenAt" >= ${startDate}
    `;

    const completionRate = await prisma.wasteOffer.aggregate({
      where: {
        pengepulId: pengepul.id,
        takenAt: { gte: startDate },
      },
      _count: { status: true },
    });

    const completedCount = await prisma.wasteOffer.count({
      where: {
        pengepulId: pengepul.id,
        status: "COMPLETED",
        takenAt: { gte: startDate },
      },
    });

    return NextResponse.json({
      materialDistribution: materialStats.map((m) => ({
        material: m.materialType,
        count: m._count.materialType,
        weight: m._sum.weight || 0,
      })),
      offerTypeStats: offerTypeStats.map((o) => ({
        type: o.offerType,
        count: o._count.offerType,
        weight: o._sum.weight || 0,
        totalPrice: o._sum.suggestedPrice || 0,
      })),
      monthlyTrends: monthlyData,
      topAreas: areaStats.map((a) => ({
        area: a.address.trim(),
        count: Number(a.count),
      })),
      performance: {
        avgResponseTime: avgResponseTime[0]?.avg || 0,
        completionRate:
          completionRate._count.status > 0
            ? (completedCount / completionRate._count.status) * 100
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
