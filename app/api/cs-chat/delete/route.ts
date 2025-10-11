import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const { userEmail } = await req.json();

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Hapus semua pesan CS user ini
    await prisma.csMessage.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Chat berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus chat" },
      { status: 500 }
    );
  }
}
