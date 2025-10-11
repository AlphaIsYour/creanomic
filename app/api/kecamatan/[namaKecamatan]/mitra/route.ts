// app/api/kecamatan/[namaKecamatan]/mitra/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getKecamatanPolygon,
  KecamatanFeature,
} from "../../lib/geojson-loader";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";
import { Partner } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { namaKecamatan: string } }
) {
  const { namaKecamatan } = params;

  if (!namaKecamatan) {
    return NextResponse.json(
      { error: "Nama kecamatan diperlukan" },
      { status: 400 }
    );
  }

  try {
    const kecamatanFeature: KecamatanFeature | null =
      await getKecamatanPolygon(namaKecamatan);

    if (!kecamatanFeature || !kecamatanFeature.geometry) {
      return NextResponse.json(
        {
          error: `Batas wilayah untuk kecamatan ${decodeURIComponent(namaKecamatan)} tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    const kecamatanPolygon = kecamatanFeature.geometry;

    const allPartners = await prisma.partner.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        businessName: true,
        image: true,
        address: true,
        latitude: true,
        longitude: true,
        expertise: true,
      },
    });

    const partnersInKecamatan = allPartners.filter((partner) => {
      if (partner.latitude && partner.longitude) {
        const partnerPoint = turfPoint([partner.longitude, partner.latitude]);
        return booleanPointInPolygon(partnerPoint, kecamatanPolygon);
      }
      return false;
    });

    const typedPartnersInKecamatan: Partial<Partner>[] = partnersInKecamatan;

    return NextResponse.json(typedPartnersInKecamatan);
  } catch (error) {
    console.error(
      `Error fetching partners for kecamatan ${namaKecamatan}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil data mitra.";
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: errorMessage },
      { status: 500 }
    );
  }
}
