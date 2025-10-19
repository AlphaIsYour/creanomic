// app/waste-offers/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WasteOfferDetailClient from "./WasteOfferDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getWasteOffer(id: string) {
  try {
    const offer = await prisma.wasteOffer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
        pengepul: {
          include: {
            user: {
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

    return offer;
  } catch (error) {
    console.error("Error fetching waste offer:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getWasteOffer(id);

  if (!offer) {
    return {
      title: "Penawaran Tidak Ditemukan",
    };
  }

  return {
    title: `${offer.title} - Bekasin`,
    description: offer.description,
    openGraph: {
      title: offer.title,
      description: offer.description,
      images: offer.images.length > 0 ? [offer.images[0]] : [],
    },
  };
}

export default async function WasteOfferDetailPage({ params }: PageProps) {
  const { id } = await params;
  const offer = await getWasteOffer(id);

  if (!offer) {
    notFound();
  }

  return <WasteOfferDetailClient offer={offer} />;
}
