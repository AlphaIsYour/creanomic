// app/api/user/profile/[username]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const session = await getServerSession(authOptions);

    // Try to find user by username-slug or by ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            name: { equals: username.replace(/-/g, " "), mode: "insensitive" },
          },
          { id: username },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        address: true,
        latitude: true,
        longitude: true,
        bio: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        pengepulProfile: {
          select: {
            id: true,
            companyName: true,
            specializedMaterials: true,
            operatingArea: true,
            description: true,
            website: true,
            workingHours: true,
            totalCollections: true,
            totalWeight: true,
            totalReviews: true,
            averageRating: true,
            approvalStatus: true,
            whatsappNumber: true,
          },
        },
        pengrajinProfile: {
          select: {
            id: true,
            craftTypes: true,
            specializedMaterials: true,
            portfolio: true,
            yearsOfExperience: true,
            description: true,
            instagramHandle: true,
            whatsappNumber: true,
            workshopAddress: true,
            workshopLatitude: true,
            workshopLongitude: true,
            totalProducts: true,
            totalSales: true,
            totalBookings: true,
            totalReviews: true,
            averageRating: true,
            approvalStatus: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if viewing own profile
    const isOwnProfile = session?.user?.id === user.id;

    // Get additional stats
    const [wasteOffers, products, reviews, completedTransactions] =
      await Promise.all([
        // Waste offers count
        prisma.wasteOffer.count({
          where: {
            userId: user.id,
            status: { in: ["AVAILABLE", "RESERVED", "TAKEN", "COMPLETED"] },
          },
        }),

        // Products (for pengrajin)
        user.role === "PENGRAJIN" && user.pengrajinProfile
          ? prisma.craftProduct.findMany({
              where: {
                pengrajinId: user.pengrajinProfile.id,
                status: "PUBLISHED",
              },
              take: 6,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                title: true,
                price: true,
                images: true,
                category: true,
                views: true,
              },
            })
          : Promise.resolve([]),

        // Recent reviews received
        user.role === "PENGEPUL" && user.pengepulProfile
          ? prisma.review.findMany({
              where: { pengepulId: user.pengepulProfile.id },
              take: 5,
              orderBy: { createdAt: "desc" },
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            })
          : user.role === "PENGRAJIN" && user.pengrajinProfile
          ? prisma.review.findMany({
              where: { pengrajinId: user.pengrajinProfile.id },
              take: 5,
              orderBy: { createdAt: "desc" },
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            })
          : Promise.resolve([]),

        // Completed transactions count
        prisma.transaction.count({
          where: {
            userId: user.id,
            status: "COMPLETED",
          },
        }),
      ]);

    // Hide sensitive data if not own profile
    if (!isOwnProfile) {
      user.email = user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
      if (user.phone) {
        user.phone = user.phone.replace(/(\d{4})(\d*)(\d{4})/, "$1****$3");
      }
    }

    return NextResponse.json({
      user,
      stats: {
        wasteOffers,
        products: products.length,
        reviews: reviews.length,
        completedTransactions,
      },
      products,
      reviews,
      isOwnProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
