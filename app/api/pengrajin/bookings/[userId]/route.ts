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

    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId: params.userId },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    const bookings = await prisma.serviceBooking.findMany({
      where: { pengrajinId: pengrajinProfile.id },
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
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      accepted: bookings.filter((b) => b.status === "ACCEPTED").length,
      inProgress: bookings.filter((b) => b.status === "IN_PROGRESS").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    };

    return NextResponse.json({ bookings, stats });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
