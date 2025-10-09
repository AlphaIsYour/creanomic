import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // Verify pengrajin profile exists
    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        totalProducts: true,
        totalSales: true,
        totalBookings: true,
        totalReviews: true,
        averageRating: true,
      },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    // Get current month stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get previous month for comparison
    const startOfPrevMonth = new Date(startOfMonth);
    startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);

    const endOfPrevMonth = new Date(startOfMonth);
    endOfPrevMonth.setDate(0);
    endOfPrevMonth.setHours(23, 59, 59, 999);

    // Current month revenue
    const currentMonthOrders = await prisma.order.aggregate({
      where: {
        items: {
          some: {
            product: {
              pengrajinId: pengrajinProfile.id,
            },
          },
        },
        status: "COMPLETED",
        completedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Previous month revenue
    const prevMonthOrders = await prisma.order.aggregate({
      where: {
        items: {
          some: {
            product: {
              pengrajinId: pengrajinProfile.id,
            },
          },
        },
        status: "COMPLETED",
        completedAt: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Bookings stats
    const currentMonthBookings = await prisma.serviceBooking.count({
      where: {
        pengrajinId: pengrajinProfile.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const prevMonthBookings = await prisma.serviceBooking.count({
      where: {
        pengrajinId: pengrajinProfile.id,
        createdAt: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
    });

    // Calculate percentage changes
    const revenueChange = prevMonthOrders._sum.totalAmount
      ? (((currentMonthOrders._sum.totalAmount || 0) -
          prevMonthOrders._sum.totalAmount) /
          prevMonthOrders._sum.totalAmount) *
        100
      : 0;

    const ordersChange = prevMonthOrders._count
      ? (((currentMonthOrders._count || 0) - prevMonthOrders._count) /
          prevMonthOrders._count) *
        100
      : 0;

    const bookingsChange = prevMonthBookings
      ? ((currentMonthBookings - prevMonthBookings) / prevMonthBookings) * 100
      : 0;

    return NextResponse.json({
      overview: {
        totalProducts: pengrajinProfile.totalProducts,
        totalRevenue: currentMonthOrders._sum.totalAmount || 0,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        totalOrders: currentMonthOrders._count || 0,
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        totalBookings: currentMonthBookings,
        bookingsChange: parseFloat(bookingsChange.toFixed(1)),
        averageRating: pengrajinProfile.averageRating,
        totalReviews: pengrajinProfile.totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching pengrajin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
