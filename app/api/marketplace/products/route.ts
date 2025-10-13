/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/marketplace/products - Get all products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.getAll("category");
    const material = searchParams.getAll("material");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000000");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const searchTerm = searchParams.get("search");

    const where: any = {
      status: "PUBLISHED",
    };

    if (category.length > 0) {
      where.category = { in: category };
    }
    if (material.length > 0) {
      where.materials = { hasSome: material };
    }
    if (minPrice || maxPrice) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { tags: { hasSome: [searchTerm] } },
        {
          pengrajin: {
            user: { name: { contains: searchTerm, mode: "insensitive" } },
          },
        },
      ];
    }

    const getOrderBy = (sortType: string) => {
      switch (sortType) {
        case "cheapest":
          return { price: "asc" as const };
        case "expensive":
          return { price: "desc" as const };
        case "popular":
          return { views: "desc" as const };
        case "newest":
        default:
          return { createdAt: "desc" as const };
      }
    };

    const orderBy = getOrderBy(sort);

    const products = await prisma.craftProduct.findMany({
      where,
      include: {
        pengrajin: {
          select: {
            id: true,
            user: { select: { name: true, image: true } },
            totalProducts: true,
            averageRating: true,
            instagramHandle: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
      orderBy,
      take: limit,
      skip,
    });

    const totalProducts = await prisma.craftProduct.count({ where });
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({ data: products, totalPages, currentPage: page });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/products - Create a new product (only for PENGRAJIN)
export async function POST(request: Request) {
  // TODO: Implement authentication and authorization (check if user is PENGRAJIN)
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== UserRole.PENGRAJIN) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    // Validate body against your CraftProduct schema (e.g., Zod)
    const {
      title,
      description,
      price,
      images,
      category,
      materials,
      pengrajinId,
      stock,
    } = body;

    const newProduct = await prisma.craftProduct.create({
      data: {
        title,
        description,
        price,
        images,
        category,
        materials,
        stock: stock || 1,
        status: "DRAFT",
        pengrajinId,
      },
    });

    // Update pengrajin's totalProducts count
    await prisma.pengrajinProfile.update({
      where: { id: pengrajinId },
      data: { totalProducts: { increment: 1 } },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
