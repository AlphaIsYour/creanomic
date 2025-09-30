import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan OTP harus diisi" },
        { status: 400 }
      );
    }

    // Find token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Kode OTP salah" }, { status: 400 });
    }

    // Check if expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: otp,
          },
        },
      });

      return NextResponse.json(
        { error: "Kode OTP sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // OTP valid - keep token until registration complete
    return NextResponse.json({
      success: true,
      message: "Verifikasi berhasil",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi OTP" },
      { status: 500 }
    );
  }
}
