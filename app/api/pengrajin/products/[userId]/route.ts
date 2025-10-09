import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId: params.userId },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    const products = await prisma.craftProduct.findMany({
      where: { pengrajinId: pengrajinProfile.id },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: products.length,
      published: products.filter((p) => p.status === "PUBLISHED").length,
      draft: products.filter((p) => p.status === "DRAFT").length,
      soldOut: products.filter((p) => p.status === "SOLD_OUT").length,
    };

    return NextResponse.json({ products, stats });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
      where: { userId: params.userId },
    });

    if (!pengrajinProfile) {
      return NextResponse.json(
        { error: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      images,
      category,
      materials,
      dimensions,
      weight,
      colors,
      customizable,
      stock,
      status,
      tags,
    } = body;

    const product = await prisma.craftProduct.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        images: images || [],
        category,
        materials: materials || [],
        dimensions,
        weight: weight ? parseFloat(weight) : null,
        colors: colors || [],
        customizable: customizable || false,
        stock: parseInt(stock) || 1,
        status: status || "DRAFT",
        tags: tags || [],
        pengrajinId: pengrajinProfile.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Update pengrajin stats
    await prisma.pengrajinProfile.update({
      where: { id: pengrajinProfile.id },
      data: { totalProducts: { increment: 1 } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
