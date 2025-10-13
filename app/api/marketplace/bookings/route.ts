/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/marketplace/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  BookingStatus,
  TransactionType,
  TransactionStatus,
} from "@prisma/client";

// GET /api/marketplace/bookings - Get user's bookings
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: { userId: session.user.id }, // Only fetch bookings made by this user
      include: {
        pengrajin: {
          select: {
            id: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/bookings - Create a new service booking
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      serviceType,
      materialType,
      budget,
      referenceImages,
      specifications,
      deadline,
      address,
      latitude,
      longitude,
      pengrajinId, // Optional: if user wants to book a specific pengrajin
    } = await request.json();

    if (!title || !description || !serviceType) {
      return NextResponse.json(
        { message: "Missing required booking details" },
        { status: 400 }
      );
    }

    // TODO: Validate other fields as needed

    const newBooking = await prisma.serviceBooking.create({
      data: {
        userId: session.user.id,
        title,
        description,
        serviceType,
        materialType,
        budget,
        referenceImages: referenceImages || [],
        specifications,
        deadline: deadline ? new Date(deadline) : null,
        address,
        latitude,
        longitude,
        pengrajinId: pengrajinId || null, // If a specific pengrajin is targeted
        status: BookingStatus.PENDING,
      },
    });

    // Create a corresponding transaction (e.g., initial payment/deposit, or just a record)
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        transactionNumber: `BOOK-${newBooking.id.substring(
          0,
          8
        )}-${Date.now()}`,
        type: TransactionType.SERVICE_BOOKING,
        amount: budget || 0, // Initial budget as amount, will be updated with final price
        status: TransactionStatus.PENDING,
        bookingId: newBooking.id,
        pengrajinId: pengrajinId || null,
      },
    });

    // TODO: Send notification to pengrajin (if specific one is targeted) or relevant admins
    // For targeted pengrajin:
    // if (pengrajinId) {
    //   await prisma.notification.create({
    //     data: {
    //       userId: pengrajinId's_user_id, // Need to get user ID from pengrajinProfile
    //       title: 'Permintaan Booking Baru',
    //       message: `Anda memiliki permintaan booking baru dari ${session.user.name}: ${title}`,
    //       type: NotificationType.BOOKING_UPDATE,
    //       actionUrl: `/dashboard/pengrajin/bookings/${newBooking.id}`, // Example dashboard link
    //     }
    //   });
    // }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Failed to create booking", error: error.message },
      { status: 500 }
    );
  }
}
