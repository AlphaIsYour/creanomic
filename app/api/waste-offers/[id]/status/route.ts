/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/waste-offers/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const offer = await prisma.wasteOffer.findUnique({
      where: { id: params.id },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Waste offer not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (offer.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status transitions
    const validStatuses = [
      "AVAILABLE",
      "RESERVED",
      "TAKEN",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };

    // Set timestamps based on status
    if (status === "RESERVED" && !offer.reservedAt) {
      updateData.reservedAt = new Date();
    } else if (status === "TAKEN" && !offer.takenAt) {
      updateData.takenAt = new Date();
    } else if (status === "COMPLETED" && !offer.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedOffer = await prisma.wasteOffer.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        pengepul: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Create notification for user
    if (status === "COMPLETED") {
      await prisma.notification.create({
        data: {
          userId: offer.userId,
          type: "OFFER_TAKEN",
          title: "Penawaran Selesai",
          message: `Penawaran "${offer.title}" telah diselesaikan.`,
          actionUrl: `/waste-offers/completed`,
        },
      });
    }

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Error updating offer status:", error);
    return NextResponse.json(
      { error: "Failed to update offer status" },
      { status: 500 }
    );
  }
}
