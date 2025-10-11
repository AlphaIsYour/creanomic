// app/api/kecamatan/[namaKecamatan]/toko/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getKecamatanPolygon,
  KecamatanFeature,
} from "../../lib/geojson-loader";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";
import { StoreProfile } from "@prisma/client";

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
    const allStores = await prisma.storeProfile.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        storeName: true,
        slug: true,
        userId: true,
        logoUrl: true,
        location: true,
        latitude: true,
        longitude: true,
      },
    });

    const storesInKecamatan = allStores.filter((store) => {
      if (store.latitude && store.longitude) {
        const storePoint = turfPoint([store.longitude, store.latitude]);
        return booleanPointInPolygon(storePoint, kecamatanPolygon);
      }
      return false;
    });

    const typedStoresInKecamatan: Partial<StoreProfile>[] = storesInKecamatan;

    return NextResponse.json(typedStoresInKecamatan);
  } catch (error) {
    console.error(
      `Error fetching stores for kecamatan ${namaKecamatan}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil data toko.";
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: errorMessage },
      { status: 500 }
    );
  }
}
