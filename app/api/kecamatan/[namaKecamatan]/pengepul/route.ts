// app/api/kecamatan/[namaKecamatan]/pengepul/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getKecamatanPolygon,
  KecamatanFeature,
} from "../../lib/geojson-loader";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ namaKecamatan: string }> }
) {
  const params = await props.params;
  const { namaKecamatan } = params;

  if (!namaKecamatan) {
    return NextResponse.json(
      { error: "Nama kecamatan diperlukan" },
      { status: 400 }
    );
  }

  try {
    const kecamatanFeature: KecamatanFeature | null = await getKecamatanPolygon(
      namaKecamatan
    );

    if (!kecamatanFeature || !kecamatanFeature.geometry) {
      return NextResponse.json(
        {
          error: `Batas wilayah untuk kecamatan ${decodeURIComponent(
            namaKecamatan
          )} tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    const kecamatanPolygon = kecamatanFeature.geometry;

    const allPengepul = await prisma.user.findMany({
      where: {
        role: "PENGEPUL",
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        pengepulProfile: true,
      },
    });

    const pengepulInKecamatan = allPengepul.filter((pengepul) => {
      if (pengepul.latitude && pengepul.longitude) {
        const pengepulPoint = turfPoint([
          pengepul.longitude,
          pengepul.latitude,
        ]);
        return booleanPointInPolygon(pengepulPoint, kecamatanPolygon);
      }
      return false;
    });

    const response = pengepulInKecamatan.map((pengepul) => ({
      id: pengepul.id,
      name: pengepul.name,
      image: pengepul.image,
      address: pengepul.address,
      latitude: pengepul.latitude,
      longitude: pengepul.longitude,
      companyName: pengepul.pengepulProfile?.companyName,
      specializedMaterials: pengepul.pengepulProfile?.specializedMaterials,
      operatingArea: pengepul.pengepulProfile?.operatingArea,
      averageRating: pengepul.pengepulProfile?.averageRating,
      isVerified: pengepul.isVerified,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      `Error fetching pengepul for kecamatan ${namaKecamatan}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil data pengepul.";
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: errorMessage },
      { status: 500 }
    );
  }
}
