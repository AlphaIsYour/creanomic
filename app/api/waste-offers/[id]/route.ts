// app/api/waste-offers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const offer = await prisma.wasteOffer.findUnique({
      where: { id: params.id },
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

    if (!offer) {
      return NextResponse.json(
        { error: "Waste offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error fetching waste offer:", error);
    return NextResponse.json(
      { error: "Failed to fetch waste offer" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Can only edit AVAILABLE offers
    if (offer.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Can only edit available offers" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      materialType,
      weight,
      images,
      condition,
      address,
      latitude,
      longitude,
      offerType,
      suggestedPrice,
    } = body;

    if (images && images.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 images allowed" },
        { status: 400 }
      );
    }

    const updatedOffer = await prisma.wasteOffer.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(materialType && { materialType }),
        ...(weight !== undefined && {
          weight: weight ? parseFloat(weight) : null,
        }),
        ...(images && { images }),
        ...(condition !== undefined && { condition }),
        ...(address && { address }),
        ...(latitude && { latitude: parseFloat(latitude) }),
        ...(longitude && { longitude: parseFloat(longitude) }),
        ...(offerType && { offerType }),
        ...(suggestedPrice !== undefined && {
          suggestedPrice: suggestedPrice ? parseFloat(suggestedPrice) : null,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Error updating waste offer:", error);
    return NextResponse.json(
      { error: "Failed to update waste offer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Soft delete: update status to CANCELLED
    const cancelledOffer = await prisma.wasteOffer.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      message: "Offer cancelled successfully",
      offer: cancelledOffer,
    });
  } catch (error) {
    console.error("Error cancelling waste offer:", error);
    return NextResponse.json(
      { error: "Failed to cancel waste offer" },
      { status: 500 }
    );
  }
}
