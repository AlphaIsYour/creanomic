import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Delete old OTP for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
        type: "EMAIL_VERIFICATION",
      },
    });

    // Generate new OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save to database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
        type: "EMAIL_VERIFICATION",
      },
    });

    // Send email
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "Kode OTP telah dikirim ke email Anda",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Gagal mengirim OTP" }, { status: 500 });
  }
}
