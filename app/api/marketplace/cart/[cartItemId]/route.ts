/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/cart/[cartItemId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/marketplace/cart/:cartItemId - Update quantity
export async function PUT(
  request: Request,
  { params }: { params: { cartItemId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quantity } = await request.json();

    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 }
      );
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: params.cartItemId },
      include: { product: { select: { stock: true } } },
    });

    if (!existingCartItem || existingCartItem.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Cart item not found or unauthorized" },
        { status: 404 }
      );
    }

    if (existingCartItem.product.stock < quantity) {
      return NextResponse.json(
        {
          message: `Not enough stock. Only ${existingCartItem.product.stock} available.`,
        },
        { status: 400 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error: any) {
    console.error(`Error updating cart item ${params.cartItemId}:`, error);
    return NextResponse.json(
      { message: "Failed to update cart item", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/cart/:cartItemId - Remove item from cart
export async function DELETE(
  request: Request,
  { params }: { params: { cartItemId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: params.cartItemId },
    });

    if (!existingCartItem || existingCartItem.userId !== session.user.id) {
      // app/api/marketplace/cart/[cartItemId]/route.ts (Lanjutan)

      return NextResponse.json(
        { message: "Cart item not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: params.cartItemId },
    });

    return NextResponse.json(
      { message: "Cart item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error deleting cart item ${params.cartItemId}:`, error);
    return NextResponse.json(
      { message: "Failed to delete cart item", error: error.message },
      { status: 500 }
    );
  }
}
