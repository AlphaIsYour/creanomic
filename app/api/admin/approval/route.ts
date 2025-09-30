import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApprovalStatus, Prisma } from "@prisma/client";

// Type untuk response profile
type PengepulProfileWithUser = Prisma.PengepulProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
        address: true;
        image: true;
        createdAt: true;
      };
    };
    approvedBy: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

type PengrajinProfileWithUser = Prisma.PengrajinProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
        address: true;
        image: true;
        createdAt: true;
      };
    };
    approvedBy: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

// GET - Fetch all pending approvals
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'pengepul' or 'pengrajin'
    const status = searchParams.get("status") || "PENDING";

    let pengepulProfiles: PengepulProfileWithUser[] = [];
    let pengrajinProfiles: PengrajinProfileWithUser[] = [];

    if (!type || type === "pengepul") {
      pengepulProfiles = await prisma.pengepulProfile.findMany({
        where: { approvalStatus: status as ApprovalStatus },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
              createdAt: true,
            },
          },
          approvedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      });
    }

    if (!type || type === "pengrajin") {
      pengrajinProfiles = await prisma.pengrajinProfile.findMany({
        where: { approvalStatus: status as ApprovalStatus },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
              createdAt: true,
            },
          },
          approvedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      });
    }

    return NextResponse.json({
      pengepul: pengepulProfiles,
      pengrajin: pengrajinProfiles,
    });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Approve or reject registration
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { profileId, type, action, rejectionReason } = body;

    // Validate input
    if (!profileId || !type || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["pengepul", "pengrajin"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be pengepul or pengrajin" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "REVISION_NEEDED"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (
      (action === "REJECTED" || action === "REVISION_NEEDED") &&
      !rejectionReason
    ) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    const updateData:
      | Prisma.PengepulProfileUpdateInput
      | Prisma.PengrajinProfileUpdateInput = {
      approvalStatus: action as ApprovalStatus,
      approvedBy: {
        connect: { id: admin.id },
      },
    };

    if (action === "APPROVED") {
      updateData.approvedAt = new Date();
      updateData.rejectionReason = null;
    } else {
      updateData.rejectionReason = rejectionReason;
      updateData.approvedAt = null;
    }

    let updatedProfile;
    let userId: string;

    // Update the appropriate profile
    if (type === "pengepul") {
      updatedProfile = await prisma.pengepulProfile.update({
        where: { id: profileId },
        data: updateData as Prisma.PengepulProfileUpdateInput,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      userId = updatedProfile.userId;

      // Update user role if approved
      if (action === "APPROVED") {
        await prisma.user.update({
          where: { id: userId },
          data: {
            role: "PENGEPUL",
            isVerified: true,
          },
        });
      }
    } else {
      updatedProfile = await prisma.pengrajinProfile.update({
        where: { id: profileId },
        data: updateData as Prisma.PengrajinProfileUpdateInput,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      userId = updatedProfile.userId;

      // Update user role if approved
      if (action === "APPROVED") {
        await prisma.user.update({
          where: { id: userId },
          data: {
            role: "PENGRAJIN",
            isVerified: true,
          },
        });
      }
    }

    // Create notification for the user
    const notificationMessages = {
      APPROVED: {
        title: `Pendaftaran ${
          type === "pengepul" ? "Pengepul" : "Pengrajin"
        } Disetujui`,
        message: `Selamat! Pendaftaran Anda sebagai ${
          type === "pengepul" ? "pengepul" : "pengrajin"
        } telah disetujui. Anda sekarang dapat menggunakan fitur lengkap platform.`,
      },
      REJECTED: {
        title: `Pendaftaran ${
          type === "pengepul" ? "Pengepul" : "Pengrajin"
        } Ditolak`,
        message: `Mohon maaf, pendaftaran Anda sebagai ${
          type === "pengepul" ? "pengepul" : "pengrajin"
        } ditolak. Alasan: ${rejectionReason}`,
      },
      REVISION_NEEDED: {
        title: `Pendaftaran ${
          type === "pengepul" ? "Pengepul" : "Pengrajin"
        } Perlu Revisi`,
        message: `Pendaftaran Anda memerlukan revisi. Catatan: ${rejectionReason}`,
      },
    };

    await prisma.notification.create({
      data: {
        userId,
        type: "APPROVAL_STATUS",
        title:
          notificationMessages[action as keyof typeof notificationMessages]
            .title,
        message:
          notificationMessages[action as keyof typeof notificationMessages]
            .message,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: `Registration ${action.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error processing approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
