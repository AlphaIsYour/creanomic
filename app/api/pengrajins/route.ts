// app/api/pengrajins/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pengrajins = await prisma.pengrajinProfile.findMany({
      where: {
        AND: [
          {
            approvalStatus: "APPROVED", // Hanya tampilkan yang sudah approved
          },
          {
            workshopLatitude: {
              not: null,
            },
          },
          {
            workshopLongitude: {
              not: null,
            },
          },
        ],
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
          },
        },
      },
    });

    if (pengrajins.length === 0) {
      return NextResponse.json(
        {
          pengrajins: [],
          message: "Belum ada pengrajin yang tersedia di peta",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      pengrajins,
      message: `Ditemukan ${pengrajins.length} pengrajin`,
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
