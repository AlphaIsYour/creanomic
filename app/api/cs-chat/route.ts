import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userEmail, message, userName } = await req.json();

    // Cari atau buat user
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName || "Guest User",
        },
      });
    }

    // Simpan pesan CS
    await prisma.csMessage.create({
      data: {
        message,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil diterima",
    });
  } catch (error) {
    console.error("CS Chat Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesan" },
      { status: 500 }
    );
  }
}
