// app/api/pengepuls/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          pengepuls: [],
          message: "Query pencarian tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();

    // Search dengan multiple conditions
    const pengepuls = await prisma.pengepulProfile.findMany({
      where: {
        AND: [
          {
            approvalStatus: "APPROVED",
          },
          {
            user: {
              latitude: { not: null },
              longitude: { not: null },
            },
          },
          {
            OR: [
              // Search by company name
              {
                companyName: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by user name
              {
                user: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
              // Search by description
              {
                description: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },

              // Search by address
              {
                user: {
                  address: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            ],
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
          message: `Tidak ditemukan pengepul dengan kata kunci "${searchTerm}"`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      pengepuls,
      message: `Ditemukan ${pengepuls.length} pengepul dengan kata kunci "${searchTerm}"`,
      query: searchTerm,
    });
  } catch (error) {
    console.error("Error searching pengepuls:", error);
    return NextResponse.json(
      {
        error: "Gagal mencari pengepul",
        message: "Terjadi kesalahan saat mencari data pengepul",
      },
      { status: 500 }
    );
  }
}
