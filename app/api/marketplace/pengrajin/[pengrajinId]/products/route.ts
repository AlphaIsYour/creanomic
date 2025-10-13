/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/pengrajin/[pengrajinId]/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/marketplace/pengrajin/:pengrajinId/products - Get products by a specific pengrajin
export async function GET(
  request: Request,
  { params }: { params: { pengrajinId: string } }
) {
  try {
    const pengrajinProducts = await prisma.craftProduct.findMany({
      where: {
        pengrajinId: params.pengrajinId,
        status: "PUBLISHED", // Only show published products
      },
      include: {
        pengrajin: {
          select: {
            id: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pengrajinProducts);
  } catch (error: any) {
    console.error(
      `Error fetching products for pengrajin ${params.pengrajinId}:`,
      error
    );
    return NextResponse.json(
      { message: "Failed to fetch pengrajin products", error: error.message },
      { status: 500 }
    );
  }
}
