/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/waste-offers/my-stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MAX_ACTIVE_OFFERS } from "@/types/waste-offer";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [activeCount, completedCount, cancelledCount] = await Promise.all([
      prisma.wasteOffer.count({
        where: {
          userId: session.user.id,
          status: {
            in: ["AVAILABLE", "RESERVED", "TAKEN"],
          },
        },
      }),
      prisma.wasteOffer.count({
        where: {
          userId: session.user.id,
          status: "COMPLETED",
        },
      }),
      prisma.wasteOffer.count({
        where: {
          userId: session.user.id,
          status: "CANCELLED",
        },
      }),
    ]);

    const availableSlots = MAX_ACTIVE_OFFERS - activeCount;

    return NextResponse.json({
      activeCount,
      availableSlots,
      totalCompleted: completedCount,
      totalCancelled: cancelledCount,
    });
  } catch (error) {
    console.error("Error fetching offer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer stats" },
      { status: 500 }
    );
  }
}
