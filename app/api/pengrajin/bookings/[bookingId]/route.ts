// app/api/pengrajin/bookings/[bookingId]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ bookingId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: params.bookingId },
      include: { pengrajin: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.pengrajin || booking.pengrajin.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status, estimatedPrice, finalPrice } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }
    if (estimatedPrice !== undefined) {
      updateData.estimatedPrice = estimatedPrice;
    }
    if (finalPrice !== undefined) {
      updateData.finalPrice = finalPrice;
    }
    if (status === "COMPLETED" && booking.status !== "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const updatedBooking = await prisma.serviceBooking.update({
      where: { id: params.bookingId },
      data: updateData,
    });
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ bookingId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: params.bookingId },
      include: { pengrajin: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (!booking.pengrajin || booking.pengrajin.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Soft delete: update status to CANCELLED
    const cancelledBooking = await prisma.serviceBooking.update({
      where: { id: params.bookingId },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json(cancelledBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
