/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pengepul/settings/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.pengepulProfile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            bio: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        // User data
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.user.phone,
        address: profile.user.address,
        image: profile.user.image,
        bio: profile.user.bio,
        latitude: profile.user.latitude,
        longitude: profile.user.longitude,

        // Pengepul specific data
        companyName: profile.companyName,
        licenseNumber: profile.licenseNumber,
        specializedMaterials: profile.specializedMaterials,
        operatingArea: profile.operatingArea,
        operatingRadius: profile.operatingRadius,
        description: profile.description,
        website: profile.website,
        workingHours: profile.workingHours,
        priceList: profile.priceList,
        whatsappNumber: profile.whatsappNumber,
        approvalStatus: profile.approvalStatus,
      },
    });
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
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      // User fields
      name,
      phone,
      address,
      bio,
      latitude,
      longitude,

      // Pengepul fields
      companyName,
      specializedMaterials,
      operatingArea,
      operatingRadius,
      description,
      website,
      workingHours,
      priceList,
      whatsappNumber,
    } = body;

    // Update user data
    const userData: any = {};
    if (name !== undefined) userData.name = name;
    if (phone !== undefined) userData.phone = phone;
    if (address !== undefined) userData.address = address;
    if (bio !== undefined) userData.bio = bio;
    if (latitude !== undefined) userData.latitude = latitude;
    if (longitude !== undefined) userData.longitude = longitude;

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: params.userId },
        data: userData,
      });
    }

    // Update pengepul profile data
    const profileData: any = {};
    if (companyName !== undefined) profileData.companyName = companyName;
    if (specializedMaterials !== undefined)
      profileData.specializedMaterials = specializedMaterials;
    if (operatingArea !== undefined) profileData.operatingArea = operatingArea;
    if (operatingRadius !== undefined)
      profileData.operatingRadius = operatingRadius;
    if (description !== undefined) profileData.description = description;
    if (website !== undefined) profileData.website = website;
    if (workingHours !== undefined) profileData.workingHours = workingHours;
    if (priceList !== undefined) profileData.priceList = priceList;
    if (whatsappNumber !== undefined)
      profileData.whatsappNumber = whatsappNumber;

    if (Object.keys(profileData).length > 0) {
      await prisma.pengepulProfile.update({
        where: { userId: params.userId },
        data: profileData,
      });
    }

    // Fetch updated profile
    const updatedProfile = await prisma.pengepulProfile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
            bio: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        name: updatedProfile?.user.name,
        email: updatedProfile?.user.email,
        phone: updatedProfile?.user.phone,
        address: updatedProfile?.user.address,
        image: updatedProfile?.user.image,
        bio: updatedProfile?.user.bio,
        latitude: updatedProfile?.user.latitude,
        longitude: updatedProfile?.user.longitude,
        companyName: updatedProfile?.companyName,
        licenseNumber: updatedProfile?.licenseNumber,
        specializedMaterials: updatedProfile?.specializedMaterials,
        operatingArea: updatedProfile?.operatingArea,
        operatingRadius: updatedProfile?.operatingRadius,
        description: updatedProfile?.description,
        website: updatedProfile?.website,
        workingHours: updatedProfile?.workingHours,
        priceList: updatedProfile?.priceList,
        whatsappNumber: updatedProfile?.whatsappNumber,
        approvalStatus: updatedProfile?.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
