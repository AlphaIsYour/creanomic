/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/waste-offers/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          wasteOffers: [],
          message: "Query pencarian tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();

    // Search dengan multiple conditions
    const wasteOffers = await prisma.wasteOffer.findMany({
      where: {
        AND: [
          {
            // Hanya tampilkan yang AVAILABLE
            status: "AVAILABLE",
          },
          {
            OR: [
              // Search by title
              {
                title: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by description
              {
                description: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by material type
              {
                materialType: {
                  equals: searchTerm.toUpperCase() as any,
                },
              },
              // Search by address
              {
                address: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by condition
              {
                condition: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              // Search by offer type
              {
                offerType: {
                  equals: searchTerm.toUpperCase() as any,
                },
              },
            ],
          },
        ],
      },
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

    if (wasteOffers.length === 0) {
      return NextResponse.json(
        {
          wasteOffers: [],
          message: `Tidak ditemukan penawaran sampah dengan kata kunci "${searchTerm}"`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      wasteOffers,
      message: `Ditemukan ${wasteOffers.length} penawaran sampah dengan kata kunci "${searchTerm}"`,
      query: searchTerm,
    });
  } catch (error) {
    console.error("Error searching waste offers:", error);
    return NextResponse.json(
      {
        error: "Gagal mencari penawaran sampah",
        message: "Terjadi kesalahan saat mencari data penawaran sampah",
      },
      { status: 500 }
    );
  }
}
