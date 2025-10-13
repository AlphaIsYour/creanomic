/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/cart/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/marketplace/cart - Get user's cart
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            stock: true,
            // Only necessary product info for cart view
          },
        },
      },
      orderBy: { addedAt: "asc" },
    });
    return NextResponse.json(cartItems);
  } catch (error: any) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart items", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/cart - Add item to cart
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { message: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // Check product existence and stock
    const product = await prisma.craftProduct.findUnique({
      where: { id: productId },
      select: { stock: true, status: true },
    });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json(
        { message: "Product not available" },
        { status: 404 }
      );
    }
    if (product.stock < quantity) {
      return NextResponse.json(
        { message: `Not enough stock. Only ${product.stock} available.` },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity if already exists
      if (product.stock < existingCartItem.quantity + quantity) {
        return NextResponse.json(
          {
            message: `Adding this quantity would exceed available stock (${product.stock}).`,
          },
          { status: 400 }
        );
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { message: "Failed to add item to cart", error: error.message },
      { status: 500 }
    );
  }
}
