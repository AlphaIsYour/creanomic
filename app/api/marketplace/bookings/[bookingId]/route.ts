/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/bookings/[bookingId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingStatus, UserRole, TransactionStatus } from "@prisma/client";

// GET /api/marketplace/bookings/:bookingId - Get booking details by ID
export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: params.bookingId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        pengrajin: {
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true, email: true },
            },
            craftTypes: true,
          },
        },
        transactions: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Authorization check: Only owner, assigned pengrajin, or admin can view
    let isAuthorized = false;
    if (
      booking.userId === session.user.id ||
      session.user.role === UserRole.ADMIN
    ) {
      isAuthorized = true;
    } else if (booking.pengrajinId) {
      const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (pengrajinProfile && booking.pengrajinId === pengrajinProfile.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Forbidden: Not authorized to view this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error(`Error fetching booking ${params.bookingId}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch booking", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/bookings/:bookingId - Update booking status/details
export async function PUT(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      status,
      estimatedPrice,
      finalPrice,
      rejectionReason,
      // ...other fields that can be updated
    } = await request.json();

    const existingBooking = await prisma.serviceBooking.findUnique({
      where: { id: params.bookingId },
      include: { pengrajin: true, transactions: true },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Authorization: Buyer can cancel/update some fields. Pengrajin can accept/reject/update prices/status. Admin can do everything.
    let isAuthorized = false;
    let updateData: any = {};

    if (session.user.role === UserRole.ADMIN) {
      isAuthorized = true;
      updateData = { status, estimatedPrice, finalPrice, rejectionReason }; // Admin can set everything
    } else if (existingBooking.userId === session.user.id) {
      // User (buyer) actions
      if (status === BookingStatus.CANCELLED) {
        isAuthorized = true;
        updateData.status = BookingStatus.CANCELLED;
      }
      // Buyer might confirm finalPrice or approve revision
      // Add more specific logic here for buyer's permissible updates
    } else if (existingBooking.pengrajinId) {
      // Check if current user is the assigned pengrajin
      const pengrajinProfile = await prisma.pengrajinProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (
        pengrajinProfile &&
        existingBooking.pengrajinId === pengrajinProfile.id
      ) {
        isAuthorized = true;
        // Pengrajin can update status, estimatedPrice, finalPrice, rejectionReason
        updateData.status = status;
        if (estimatedPrice !== undefined)
          updateData.estimatedPrice = estimatedPrice;
        if (finalPrice !== undefined) updateData.finalPrice = finalPrice;
        if (rejectionReason !== undefined)
          updateData.rejectionReason = rejectionReason;

        // Specific status transitions for pengrajin
        if (status === BookingStatus.ACCEPTED && !existingBooking.acceptedAt) {
          updateData.acceptedAt = new Date();
        } else if (
          status === BookingStatus.IN_PROGRESS &&
          !existingBooking.startedAt
        ) {
          updateData.startedAt = new Date();
        } else if (
          status === BookingStatus.COMPLETED &&
          !existingBooking.completedAt
        ) {
          updateData.completedAt = new Date();
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Forbidden: Not authorized to update this booking" },
        { status: 403 }
      );
    }

    // Basic validation for status transitions
    if (status && !Object.values(BookingStatus).includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updatedBooking = await prisma.serviceBooking.update({
      where: { id: params.bookingId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        pengrajin: {
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true, email: true },
            },
            craftTypes: true,
          },
        },
        transactions: true,
      },
    });

    // Update related transaction status and amount
    if (updatedBooking.transactions && updatedBooking.transactions.length > 0) {
      const transactionToUpdate = updatedBooking.transactions[0];
      await prisma.transaction.update({
        where: { id: transactionToUpdate.id },
        data: {
          status: status
            ? statusToTransactionStatus(status)
            : transactionToUpdate.status, // Map BookingStatus to TransactionStatus
          amount: finalPrice || estimatedPrice || transactionToUpdate.amount, // Update amount if price finalized
        },
      });
    }

    // TODO: Send notifications to relevant parties (buyer, pengrajin) about booking updates

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error(`Error updating booking ${params.bookingId}:`, error);
    return NextResponse.json(
      { message: "Failed to update booking", error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to map BookingStatus to TransactionStatus
function statusToTransactionStatus(
  bookingStatus: BookingStatus
): TransactionStatus {
  switch (bookingStatus) {
    case BookingStatus.PENDING:
      return TransactionStatus.PENDING;
    case BookingStatus.ACCEPTED:
    case BookingStatus.IN_PROGRESS:
      return TransactionStatus.PROCESSING;
    case BookingStatus.COMPLETED:
      return TransactionStatus.COMPLETED;
    case BookingStatus.REJECTED:
    case BookingStatus.CANCELLED:
      return TransactionStatus.CANCELLED;
    default:
      return TransactionStatus.PENDING; // Fallback
  }
}
