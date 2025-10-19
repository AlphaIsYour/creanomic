// app/api/pengrajins/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          pengrajins: [],
          message: "Query pencarian tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();

    // Search dengan multiple conditions
    const pengrajins = await prisma.pengrajinProfile.findMany({
      where: {
        AND: [
          {
            approvalStatus: "APPROVED",
          },
          {
            workshopLatitude: { not: null },
            workshopLongitude: { not: null },
          },
          {
            OR: [
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
              // Search by workshop address
              {
                workshopAddress: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by Instagram handle
              {
                instagramHandle: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
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
      orderBy: [{ averageRating: "desc" }, { totalProducts: "desc" }],
    });

    if (pengrajins.length === 0) {
      return NextResponse.json(
        {
          pengrajins: [],
          message: `Tidak ditemukan pengrajin dengan kata kunci "${searchTerm}"`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      pengrajins,
      message: `Ditemukan ${pengrajins.length} pengrajin dengan kata kunci "${searchTerm}"`,
      query: searchTerm,
    });
  } catch (error) {
    console.error("Error searching pengrajins:", error);
    return NextResponse.json(
      {
        error: "Gagal mencari pengrajin",
        message: "Terjadi kesalahan saat mencari data pengrajin",
      },
      { status: 500 }
    );
  }
}
