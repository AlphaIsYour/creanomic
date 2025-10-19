// app/api/pengrajin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pengrajins = await prisma.pengrajinProfile.findMany({
      where: {
        approvalStatus: "APPROVED",
      },
      select: {
        id: true,
        userId: true,
        craftTypes: true,
        specializedMaterials: true,
        portfolio: true,
        workshopAddress: true,
        workshopLatitude: true,
        workshopLongitude: true,
        averageRating: true,
        totalReviews: true,
        totalProducts: true,
        totalSales: true,
        description: true,
        instagramHandle: true,
        whatsappNumber: true,
        yearsOfExperience: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { totalProducts: "desc" }],
    });

    // Filter: harus punya workshop location ATAU user location
    const validPengrajins = pengrajins.filter(
      (p) =>
        (p.workshopLatitude && p.workshopLongitude) ||
        (p.user.latitude && p.user.longitude)
    );

    if (validPengrajins.length === 0) {
      return NextResponse.json(
        {
          pengrajins: [],
          message: "Belum ada pengrajin yang tersedia di peta",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      pengrajins: validPengrajins,
      message: `Ditemukan ${validPengrajins.length} pengrajin`,
    });
  } catch (error) {
    console.error("Error fetching pengrajins:", error);
    return NextResponse.json(
      {
        error: "Gagal memuat data pengrajin",
        message: "Terjadi kesalahan saat memuat data pengrajin",
      },
      { status: 500 }
    );
  }
}
