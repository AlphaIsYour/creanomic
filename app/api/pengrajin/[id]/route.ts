import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params di Next.js 15
    const { id } = await context.params;

    const profile = await prisma.pengrajinProfile.findUnique({
      where: {
        id: id,
        approvalStatus: "APPROVED", // Only show approved profiles
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            image: true,
          },
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
          take: 10,
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found or not approved" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching pengrajin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
