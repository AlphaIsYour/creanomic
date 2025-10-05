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
      include: { pengrajinProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a pengrajin profile
    if (user.pengrajinProfile) {
      return NextResponse.json(
        { error: "Anda sudah memiliki profil pengrajin" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      craftType,
      materials,
      portfolio,
      description,
      verificationDocs,
      address,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!craftType || craftType.length === 0) {
      return NextResponse.json(
        { error: "Jenis kerajinan wajib diisi" },
        { status: 400 }
      );
    }

    if (!materials || materials.length === 0) {
      return NextResponse.json(
        { error: "Bahan yang digunakan wajib diisi" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Deskripsi profil wajib diisi" },
        { status: 400 }
      );
    }

    // Create pengrajin profile
    const pengrajinProfile = await prisma.pengrajinProfile.create({
      data: {
        userId: user.id,
        craftTypes: craftType,
        specializedMaterials: materials as MaterialType[],
        portfolio: portfolio || [],
        description,
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
        title: "Pendaftaran Pengrajin Diterima",
        message:
          "Pendaftaran Anda sebagai pengrajin sedang dalam proses verifikasi oleh admin. Kami akan memberitahu Anda melalui email dan notifikasi.",
        type: "APPROVAL_STATUS",
      },
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil! Mohon tunggu verifikasi dari admin.",
        data: pengrajinProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pengrajin registration error:", error);
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
        pengrajinProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasProfile: !!user.pengrajinProfile,
      profile: user.pengrajinProfile,
    });
  } catch (error) {
    console.error("Get pengrajin profile error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
