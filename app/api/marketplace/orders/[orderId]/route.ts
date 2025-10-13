/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole, TransactionStatus } from "@prisma/client";

// GET /api/marketplace/orders/:orderId - Get order details by ID
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                price: true,
                pengrajin: {
                  select: {
                    id: true,
                    user: { select: { name: true, image: true } },
                  },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        transactions: true, // Link to related transactions
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Authorization check: Only owner or admin can view the order
    if (
      order.userId !== session.user.id &&
      session.user.role !== UserRole.ADMIN
    ) {
      // If a pengrajin needs to see orders for their products, you'd add more logic here.
      // For now, only the buyer or admin can see the full order.
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(`Error fetching order ${params.orderId}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch order", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/orders/:orderId - Update order status (for admin/pengrajin)
export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, paymentProof, adminNotes } = await request.json();

    // Authorization: Only ADMIN or PENGRAJIN (for their own product's orders)
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { items: { include: { product: true } } },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let isAuthorized = false;
    if (session.user.role === UserRole.ADMIN) {
      isAuthorized = true;
    } else if (session.user.role === UserRole.PENGRAJIN) {
      // Check if the pengrajin owns any product in this order
      const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (pengrajinProfile) {
        isAuthorized = existingOrder.items.some(
          (item) => item.product.pengrajinId === pengrajinProfile.id
        );
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Forbidden: Not authorized to update this order" },
        { status: 403 }
      );
    }

    // Basic validation for status transitions
    if (!Object.values(TransactionStatus).includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: status,
        paymentProof: paymentProof || existingOrder.paymentProof,
        adminNotes: adminNotes || existingOrder.adminNotes,
        // Update dates based on status change
        paidAt:
          status === TransactionStatus.CONFIRMED && !existingOrder.paidAt
            ? new Date()
            : existingOrder.paidAt,
        shippedAt:
          status === TransactionStatus.PROCESSING && !existingOrder.shippedAt
            ? new Date()
            : existingOrder.shippedAt,
        completedAt:
          status === TransactionStatus.COMPLETED && !existingOrder.completedAt
            ? new Date()
            : existingOrder.completedAt,
      },
      include: {
        transactions: true,
      },
    });

    // Update related transaction status as well
    if (updatedOrder.transactions && updatedOrder.transactions.length > 0) {
      await prisma.transaction.update({
        where: { id: updatedOrder.transactions[0].id }, // Assuming one transaction per order for now
        data: { status: status },
      });
    }

    // TODO: Send notifications to buyer/seller based on status change

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error(`Error updating order ${params.orderId}:`, error);
    return NextResponse.json(
      { message: "Failed to update order", error: error.message },
      { status: 500 }
    );
  }
}
