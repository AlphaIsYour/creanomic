/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TransactionType, TransactionStatus } from "@prisma/client";

// GET /api/marketplace/orders - Get user's orders
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                price: true,
                pengrajin: { select: { user: { select: { name: true } } } },
              },
            },
          },
        },
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/orders - Create a new order (checkout)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      shippingAddress,
      shippingCity,
      shippingProvince,
      shippingMethod,
      paymentMethod,
      orderNotes,
      items, // Array of { productId, quantity, notes }
    } = await request.json();

    if (!shippingAddress || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Missing required order details" },
        { status: 400 }
      );
    }

    // Fetch user data to get phone
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true },
    });

    // --- Start a Prisma Transaction for atomicity ---
    const newOrder = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const shippingCost = 0; // TODO: Calculate actual shipping cost based on method/address
      const orderItemsData = [];
      const productsToUpdate = [];

      for (const item of items) {
        const product = await tx.craftProduct.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            price: true,
            stock: true,
            pengrajinId: true,
          },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Product "${
              product?.title || item.productId
            }" is out of stock or insufficient quantity.`
          );
        }

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          subtotal: itemSubtotal,
          notes: item.notes,
        });

        productsToUpdate.push({
          id: product.id,
          stock: product.stock - item.quantity,
          pengrajinId: product.pengrajinId,
          totalSales: item.quantity, // for pengrajin profile update
        });
      }

      const totalAmount = subtotal + shippingCost;
      const orderNumber = `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber: orderNumber,
          customerName: user?.name || "Anonymous",
          customerPhone: user?.phone || "",
          customerEmail: user?.email || "",
          shippingAddress,
          shippingCity,
          shippingProvince,
          shippingMethod,
          shippingCost,
          subtotal,
          totalAmount,
          paymentMethod,
          orderNotes,
          status: TransactionStatus.PENDING,
          items: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
      });

      // Create a transaction record for the order
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          transactionNumber: `TRX-${orderNumber}`,
          type: TransactionType.PRODUCT_PURCHASE,
          amount: totalAmount,
          paymentMethod,
          status: TransactionStatus.PENDING,
          orderId: createdOrder.id,
          // If the order has items from multiple pengrajin, you might need multiple transaction records
          // For simplicity here, assume one transaction per order
        },
      });

      // Update product stocks and pengrajin totalSales
      for (const productUpdate of productsToUpdate) {
        await tx.craftProduct.update({
          where: { id: productUpdate.id },
          data: { stock: productUpdate.stock },
        });

        await tx.pengrajinProfile.update({
          where: { id: productUpdate.pengrajinId },
          data: { totalSales: { increment: productUpdate.totalSales } },
        });
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          productId: { in: items.map((item: any) => item.productId) },
        },
      });

      return createdOrder;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
