import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MaterialType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { pengepulProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a pengepul profile
    if (user.pengepulProfile) {
      return NextResponse.json(
        { error: "Anda sudah memiliki profil pengepul" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      licenseNumber,
      specializedMaterials,
      operatingArea,
      description,
      website,
      workingHours,
      whatsappNumber,
      verificationDocs,
      address,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!companyName || !whatsappNumber || !address) {
      return NextResponse.json(
        { error: "Nama perusahaan, nomor WhatsApp, dan alamat wajib diisi" },
        { status: 400 }
      );
    }

    // Validate WhatsApp number format
    const waRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!waRegex.test(whatsappNumber.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid" },
        { status: 400 }
      );
    }

    // Check if license number already exists
    if (licenseNumber) {
      const existingLicense = await prisma.pengepulProfile.findUnique({
        where: { licenseNumber },
      });

      if (existingLicense) {
        return NextResponse.json(
          { error: "Nomor izin sudah terdaftar" },
          { status: 400 }
        );
      }
    }

    // Create pengepul profile
    const pengepulProfile = await prisma.pengepulProfile.create({
      data: {
        userId: user.id,
        companyName,
        licenseNumber: licenseNumber || null,
        specializedMaterials: specializedMaterials as MaterialType[],
        operatingArea: operatingArea || [],
        description,
        website,
        workingHours,
        whatsappNumber,
        verificationDocs: verificationDocs || [],
        approvalStatus: "PENDING",
      },
    });

    // Update user location if provided
    if (latitude && longitude && address) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          address,
          latitude,
          longitude,
        },
      });
    }

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Pendaftaran Pengepul Diterima",
        message:
          "Pendaftaran Anda sebagai pengepul sedang dalam proses verifikasi oleh admin. Kami akan memberitahu Anda melalui email dan notifikasi.",
        type: "APPROVAL_STATUS",
      },
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil! Mohon tunggu verifikasi dari admin.",
        data: pengepulProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pengepul registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pengepulProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasProfile: !!user.pengepulProfile,
      profile: user.pengepulProfile,
    });
  } catch (error) {
    console.error("Get pengepul profile error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
