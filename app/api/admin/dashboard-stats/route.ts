import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all stats in parallel
    const [
      totalUsers,
      regularUsers,
      pengepulUsers,
      pengrajinUsers,
      pendingApprovals,
      approvedApprovals,
      rejectedApprovals,
      totalWasteOffers,
      availableWasteOffers,
      reservedWasteOffers,
      completedWasteOffers,
      totalProducts,
      publishedProducts,
      draftProducts,
      soldOutProducts,
      totalTransactions,
      pendingTransactions,
      completedTransactions,
      completedTransactionsData,
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "PENGEPUL" } }),
      prisma.user.count({ where: { role: "PENGRAJIN" } }),

      // Approval stats
      prisma
        .$transaction([
          prisma.pengepulProfile.count({
            where: { approvalStatus: "PENDING" },
          }),
          prisma.pengrajinProfile.count({
            where: { approvalStatus: "PENDING" },
          }),
        ])
        .then(([pengepul, pengrajin]) => pengepul + pengrajin),

      prisma
        .$transaction([
          prisma.pengepulProfile.count({
            where: { approvalStatus: "APPROVED" },
          }),
          prisma.pengrajinProfile.count({
            where: { approvalStatus: "APPROVED" },
          }),
        ])
        .then(([pengepul, pengrajin]) => pengepul + pengrajin),

      prisma
        .$transaction([
          prisma.pengepulProfile.count({
            where: { approvalStatus: "REJECTED" },
          }),
          prisma.pengrajinProfile.count({
            where: { approvalStatus: "REJECTED" },
          }),
        ])
        .then(([pengepul, pengrajin]) => pengepul + pengrajin),

      // Waste Offers stats
      prisma.wasteOffer.count(),
      prisma.wasteOffer.count({ where: { status: "AVAILABLE" } }),
      prisma.wasteOffer.count({ where: { status: "RESERVED" } }),
      prisma.wasteOffer.count({ where: { status: "COMPLETED" } }),

      // Products stats
      prisma.craftProduct.count(),
      prisma.craftProduct.count({ where: { status: "PUBLISHED" } }),
      prisma.craftProduct.count({ where: { status: "DRAFT" } }),
      prisma.craftProduct.count({ where: { status: "SOLD_OUT" } }),

      // Transaction stats
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: "PENDING" } }),
      prisma.transaction.count({ where: { status: "COMPLETED" } }),

      // Get completed transactions with amounts for revenue calculation
      prisma.transaction.findMany({
        where: {
          status: "COMPLETED",
          amount: { not: null },
        },
        select: { amount: true },
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = completedTransactionsData.reduce(
      (sum, tx) => sum + (tx.amount || 0),
      0
    );

    const stats = {
      users: {
        total: totalUsers,
        regular: regularUsers,
        pengepul: pengepulUsers,
        pengrajin: pengrajinUsers,
        activeToday: 0, // TODO: implement active today logic if needed
      },
      approvals: {
        pending: pendingApprovals,
        approved: approvedApprovals,
        rejected: rejectedApprovals,
      },
      wasteOffers: {
        total: totalWasteOffers,
        available: availableWasteOffers,
        reserved: reservedWasteOffers,
        completed: completedWasteOffers,
      },
      products: {
        total: totalProducts,
        published: publishedProducts,
        draft: draftProducts,
        soldOut: soldOutProducts,
      },
      transactions: {
        total: totalTransactions,
        pending: pendingTransactions,
        completed: completedTransactions,
        totalRevenue: totalRevenue,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
