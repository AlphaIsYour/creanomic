/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/waste-offers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MAX_ACTIVE_OFFERS } from "@/types/waste-offer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const materialType = searchParams.get("materialType");
    const offerType = searchParams.get("offerType");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const radius = searchParams.get("radius");

    const where: any = {};

    if (materialType) {
      where.materialType = materialType;
    }

    if (offerType) {
      where.offerType = offerType;
    }

    if (status) {
      where.status = status;
    } else {
      // Default: hanya tampilkan yang AVAILABLE
      where.status = "AVAILABLE";
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Location-based filtering (simplified, ideal pakai PostGIS)
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);

      // Rough bounding box calculation
      const latDelta = rad / 111; // 1 degree ≈ 111 km
      const lngDelta = rad / (111 * Math.cos((lat * Math.PI) / 180));

      where.latitude = {
        gte: lat - latDelta,
        lte: lat + latDelta,
      };
      where.longitude = {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      };
    }

    const offers = await prisma.wasteOffer.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching waste offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch waste offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user role is USER
    if (session.user.role !== "USER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only users can create waste offers" },
        { status: 403 }
      );
    }

    // Check active offers count
    const activeCount = await prisma.wasteOffer.count({
      where: {
        userId: session.user.id,
        status: {
          in: ["AVAILABLE", "RESERVED", "TAKEN"],
        },
      },
    });

    if (activeCount >= MAX_ACTIVE_OFFERS) {
      return NextResponse.json(
        {
          error: "Maximum active offers reached",
          message: `Anda sudah memiliki ${MAX_ACTIVE_OFFERS} penawaran aktif. Selesaikan atau batalkan penawaran lama terlebih dahulu.`,
        },
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

    // Validation
    if (
      !title ||
      !description ||
      !materialType ||
      !address ||
      !latitude ||
      !longitude ||
      !offerType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (images && images.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 images allowed" },
        { status: 400 }
      );
    }

    const offer = await prisma.wasteOffer.create({
      data: {
        title,
        description,
        materialType,
        weight: weight ? parseFloat(weight) : null,
        images: images || [],
        condition,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        offerType,
        suggestedPrice: suggestedPrice ? parseFloat(suggestedPrice) : null,
        userId: session.user.id,
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

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Error creating waste offer:", error);
    return NextResponse.json(
      { error: "Failed to create waste offer" },
      { status: 500 }
    );
  }
}
