// app/pengepul/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PengepulProfileClient from "./PengepulProfileClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPengepulProfile(id: string) {
  try {
    const pengepul = await prisma.pengepulProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        takenOffers: {
          where: {
            status: "COMPLETED",
          },
          take: 10,
          orderBy: {
            completedAt: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return pengepul;
  } catch (error) {
    console.error("Error fetching pengepul:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pengepul = await getPengepulProfile(id);

  if (!pengepul) {
    return {
      title: "Pengepul Tidak Ditemukan",
    };
  }

  return {
    title: `${pengepul.companyName || pengepul.user.name} - Pengepul Daurin`,
    description:
      pengepul.description ||
      `Profil pengepul ${pengepul.companyName || pengepul.user.name}`,
    openGraph: {
      title: pengepul.companyName || pengepul.user.name || "Pengepul",
      description: pengepul.description || "",
      images: pengepul.user.image ? [pengepul.user.image] : [],
    },
  };
}

export default async function PengepulProfilePage({ params }: PageProps) {
  const { id } = await params;
  const pengepul = await getPengepulProfile(id);

  if (!pengepul || pengepul.approvalStatus !== "APPROVED") {
    notFound();
  }

  return <PengepulProfileClient pengepul={pengepul} />;
}
