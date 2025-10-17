// app/api/profile/[username]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    const { username } = params;

    // Find user by username (assuming username is stored in 'name' or add username field)
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name: username }, { email: username }],
      },
      include: {
        pengepulProfile: {
          include: {
            reviews: {
              include: {
                reviewer: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 5,
            },
          },
        },
        pengrajinProfile: {
          include: {
            products: {
              where: {
                status: "PUBLISHED",
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 6,
            },
            reviews: {
              include: {
                reviewer: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 5,
            },
          },
        },
        wasteOffers: {
          where: {
            status: {
              in: ["AVAILABLE", "RESERVED"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 6,
        },
        sentReviews: {
          include: {
            pengepul: {
              select: {
                companyName: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            pengrajin: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            product: {
              select: {
                title: true,
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if viewing own profile
    const isOwnProfile = session?.user?.email === user.email;

    // Prepare response data
    const profileData = {
      id: user.id,
      name: user.name,
      email: isOwnProfile ? user.email : null, // Hide email from others
      image: user.image,
      role: user.role,
      phone: isOwnProfile
        ? user.phone
        : user.pengepulProfile?.whatsappNumber ||
          user.pengrajinProfile?.whatsappNumber,
      address: user.address,
      bio: user.bio,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLoginAt: isOwnProfile ? user.lastLoginAt : null,

      // Stats
      stats: {
        wasteOffersCount: user.wasteOffers.length,
        reviewsGiven: user.sentReviews.length,
      },

      // Pengepul profile
      pengepulProfile: user.pengepulProfile
        ? {
            id: user.pengepulProfile.id,
            companyName: user.pengepulProfile.companyName,
            specializedMaterials: user.pengepulProfile.specializedMaterials,
            operatingArea: user.pengepulProfile.operatingArea,
            operatingRadius: user.pengepulProfile.operatingRadius,
            description: user.pengepulProfile.description,
            website: user.pengepulProfile.website,
            workingHours: user.pengepulProfile.workingHours,
            priceList: user.pengepulProfile.priceList,
            totalCollections: user.pengepulProfile.totalCollections,
            totalWeight: user.pengepulProfile.totalWeight,
            totalReviews: user.pengepulProfile.totalReviews,
            averageRating: user.pengepulProfile.averageRating,
            approvalStatus: user.pengepulProfile.approvalStatus,
            whatsappNumber: user.pengepulProfile.whatsappNumber,
            reviews: user.pengepulProfile.reviews,
          }
        : null,

      // Pengrajin profile
      pengrajinProfile: user.pengrajinProfile
        ? {
            id: user.pengrajinProfile.id,
            craftTypes: user.pengrajinProfile.craftTypes,
            specializedMaterials: user.pengrajinProfile.specializedMaterials,
            portfolio: user.pengrajinProfile.portfolio,
            yearsOfExperience: user.pengrajinProfile.yearsOfExperience,
            description: user.pengrajinProfile.description,
            instagramHandle: user.pengrajinProfile.instagramHandle,
            whatsappNumber: user.pengrajinProfile.whatsappNumber,
            workshopAddress: user.pengrajinProfile.workshopAddress,
            totalProducts: user.pengrajinProfile.totalProducts,
            totalSales: user.pengrajinProfile.totalSales,
            totalBookings: user.pengrajinProfile.totalBookings,
            totalReviews: user.pengrajinProfile.totalReviews,
            averageRating: user.pengrajinProfile.averageRating,
            approvalStatus: user.pengrajinProfile.approvalStatus,
            products: user.pengrajinProfile.products,
            reviews: user.pengrajinProfile.reviews,
          }
        : null,

      // Recent waste offers
      wasteOffers: user.wasteOffers,

      // Reviews given by user
      reviewsGiven: user.sentReviews,

      // Permission flags
      isOwnProfile,
      canEdit: isOwnProfile,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;
    const body = await req.json();

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name: username }, { email: username }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is editing own profile
    if (session.user.email !== user.email) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own profile" },
        { status: 403 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        bio: body.bio,
        image: body.image,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
