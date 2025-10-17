/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pengrajin/settings/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// GET - Ambil settings pengrajin
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params;
  const { userId } = params;

  // Cek authorization
  if (session.user.id !== userId && session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const pengrajin = await prisma.pengrajinProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            address: true,
          },
        },
      },
    });

    if (!pengrajin) {
      return NextResponse.json(
        { message: "Pengrajin profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pengrajin);
  } catch (error) {
    console.error("Error fetching pengrajin settings:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings pengrajin
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params;
  const { userId } = params;

  if (session.user.id !== userId && session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      // User fields
      name,
      phone,
      address,
      // Pengrajin fields
      craftTypes,
      specializedMaterials,
      portfolio,
      yearsOfExperience,
      description,
      instagramHandle,
      whatsappNumber,
      workshopAddress,
      workshopLatitude,
      workshopLongitude,
    } = body;

    // Update user data
    const userUpdateData: any = {};
    if (name !== undefined) userUpdateData.name = name;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (address !== undefined) userUpdateData.address = address;

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

    // Update pengrajin profile
    const pengrajinUpdateData: any = {};
    if (craftTypes !== undefined) pengrajinUpdateData.craftTypes = craftTypes;
    if (specializedMaterials !== undefined)
      pengrajinUpdateData.specializedMaterials = specializedMaterials;
    if (portfolio !== undefined) pengrajinUpdateData.portfolio = portfolio;
    if (yearsOfExperience !== undefined)
      pengrajinUpdateData.yearsOfExperience = yearsOfExperience;
    if (description !== undefined)
      pengrajinUpdateData.description = description;
    if (instagramHandle !== undefined)
      pengrajinUpdateData.instagramHandle = instagramHandle;
    if (whatsappNumber !== undefined)
      pengrajinUpdateData.whatsappNumber = whatsappNumber;
    if (workshopAddress !== undefined)
      pengrajinUpdateData.workshopAddress = workshopAddress;
    if (workshopLatitude !== undefined)
      pengrajinUpdateData.workshopLatitude = workshopLatitude;
    if (workshopLongitude !== undefined)
      pengrajinUpdateData.workshopLongitude = workshopLongitude;

    const updatedPengrajin = await prisma.pengrajinProfile.update({
      where: { userId },
      data: pengrajinUpdateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPengrajin);
  } catch (error) {
    console.error("Error updating pengrajin settings:", error);
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
