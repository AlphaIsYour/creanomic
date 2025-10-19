// app/pengrajin/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PengrajinProfileClient from "../../pengrajin/[id]/PengrajinProfileClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPengrajinProfile(id: string) {
  try {
    const pengrajin = await prisma.pengrajinProfile.findUnique({
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
          },
        },
        products: {
          where: {
            status: "PUBLISHED",
          },
          take: 12,
          orderBy: {
            createdAt: "desc",
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

    console.log("Pengrajin found:", pengrajin);
    console.log("Approval status:", pengrajin?.approvalStatus);
    return pengrajin;
  } catch (error) {
    console.error("Error fetching pengrajin:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pengrajin = await getPengrajinProfile(id);

  if (!pengrajin) {
    return {
      title: "Pengrajin Tidak Ditemukan",
    };
  }

  return {
    title: `${pengrajin.user.name} - Pengrajin Daurin`,
    description:
      pengrajin.description || `Profil pengrajin ${pengrajin.user.name}`,
    openGraph: {
      title: pengrajin.user.name || "Pengrajin",
      description: pengrajin.description || "",
      images: pengrajin.user.image ? [pengrajin.user.image] : [],
    },
  };
}

export default async function PengrajinProfilePage({ params }: PageProps) {
  const { id } = await params;
  const pengrajin = await getPengrajinProfile(id);

  if (!pengrajin) {
    notFound();
  }

  return <PengrajinProfileClient pengrajin={pengrajin} />;
}
