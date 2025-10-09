/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.craftProduct.findUnique({
      where: { id: params.productId },
      include: { pengrajin: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.pengrajin.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const updateData: any = { ...body };

    // Update publishedAt if status changed to PUBLISHED
    if (body.status === "PUBLISHED" && product.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    // Update soldAt if status changed to SOLD_OUT
    if (body.status === "SOLD_OUT" && product.status !== "SOLD_OUT") {
      updateData.soldAt = new Date();
    }

    const updatedProduct = await prisma.craftProduct.update({
      where: { id: params.productId },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.craftProduct.findUnique({
      where: { id: params.productId },
      include: { pengrajin: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.pengrajin.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.craftProduct.delete({
      where: { id: params.productId },
    });

    // Update pengrajin stats
    await prisma.pengrajinProfile.update({
      where: { id: product.pengrajinId },
      data: { totalProducts: { decrement: 1 } },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
