/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/products/[productId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // Untuk autentikasi/otorisasi
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client"; // Untuk role enum

// GET /api/marketplace/products/:productId - Get product by ID
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.craftProduct.findUnique({
      where: { id: params.productId },
      include: {
        pengrajin: {
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true, email: true },
            },
            totalProducts: true,
            averageRating: true,
            instagramHandle: true,
          },
        },
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Increment views count (optional, can be debounced or moved to a separate service)
    await prisma.craftProduct.update({
      where: { id: params.productId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error(`Error fetching product ${params.productId}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/products/:productId - Update product (only for owner PENGRAJIN or ADMIN)
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // TODO: Implement authentication and authorization
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    // Validate body

    // TODO: Check if user is the owner of the product or ADMIN
    // const product = await prisma.craftProduct.findUnique({ where: { id: params.productId } });
    // if (!product || (product.pengrajinId !== session.user.pengrajinId && session.user.role !== UserRole.ADMIN)) {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const updatedProduct = await prisma.craftProduct.update({
      where: { id: params.productId },
      data: { ...body },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error(`Error updating product ${params.productId}:`, error);
    return NextResponse.json(
      { message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/products/:productId - Delete product (only for owner PENGRAJIN or ADMIN)
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // TODO: Implement authentication and authorization
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // TODO: Check if user is the owner of the product or ADMIN
    // const product = await prisma.craftProduct.findUnique({ where: { id: params.productId } });
    // if (!product || (product.pengrajinId !== session.user.pengrajinId && session.user.role !== UserRole.ADMIN)) {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    await prisma.craftProduct.delete({
      where: { id: params.productId },
    });

    // Optionally update pengrajin's totalProducts count
    // await prisma.pengrajinProfile.update({
    //   where: { id: product.pengrajinId },
    //   data: { totalProducts: { decrement: 1 } },
    // });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error deleting product ${params.productId}:`, error);
    return NextResponse.json(
      { message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
