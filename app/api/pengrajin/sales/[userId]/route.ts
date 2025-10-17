import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "6months";

    // Get pengrajin profile
    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    if (period === "6months") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === "12months") {
      startDate.setMonth(startDate.getMonth() - 12);
    } else {
      startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get monthly sales data
    const orders = await prisma.order.findMany({
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
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    // Group by month
    const monthlyData: { [key: string]: { sales: number; orders: number } } =
      {};

    orders.forEach((order) => {
      if (!order.completedAt) return;

      const monthKey = new Intl.DateTimeFormat("id-ID", {
        month: "short",
        year: "numeric",
      }).format(order.completedAt);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sales: 0, orders: 0 };
      }

      monthlyData[monthKey].sales += order.totalAmount;
      monthlyData[monthKey].orders += 1;
    });

    // Convert to array format
    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sales: data.sales,
      orders: data.orders,
    }));

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              pengrajinId: pengrajinProfile.id,
            },
          },
        },
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Get recent bookings
    const recentBookings = await prisma.serviceBooking.findMany({
      where: {
        pengrajinId: pengrajinProfile.id,
      },
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json({
      chartData,
      recentOrders: recentOrders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        title: booking.title,
        customerName: booking.user.name || "Unknown",
        budget: booking.budget,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
