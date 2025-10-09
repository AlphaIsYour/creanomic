/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/waste-offers/my-offers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      if (status === "active") {
        where.status = {
          in: ["AVAILABLE", "RESERVED", "TAKEN"],
        };
      } else if (status === "completed") {
        where.status = "COMPLETED";
      } else if (status === "cancelled") {
        where.status = "CANCELLED";
      } else {
        where.status = status;
      }
    }

    const offers = await prisma.wasteOffer.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        pengepul: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching my offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch my offers" },
      { status: 500 }
    );
  }
}
