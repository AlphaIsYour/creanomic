// app/api/pengepul/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pengepuls = await prisma.pengepulProfile.findMany({
      where: {
        AND: [
          { approvalStatus: "APPROVED" },
          {
            user: {
              latitude: { not: null },
              longitude: { not: null },
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        companyName: true,
        licenseNumber: true,
        specializedMaterials: true,
        operatingArea: true,
        operatingRadius: true,
        description: true,
        website: true,
        workingHours: true,
        priceList: true,
        totalCollections: true,
        totalWeight: true,
        averageRating: true,
        totalReviews: true,
        whatsappNumber: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { totalCollections: "desc" }],
    });

    if (pengepuls.length === 0) {
      return NextResponse.json(
        {
          pengepuls: [],
          message: "Belum ada pengepul yang tersedia",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      pengepuls,
      message: `Ditemukan ${pengepuls.length} pengepul`,
    });
  } catch (error) {
    console.error("Error fetching pengepuls:", error);
    return NextResponse.json(
      {
        error: "Gagal memuat data pengepul",
        message: "Terjadi kesalahan saat memuat data pengepul",
      },
      { status: 500 }
    );
  }
}
