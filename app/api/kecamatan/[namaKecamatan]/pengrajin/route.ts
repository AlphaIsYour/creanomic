// app/api/kecamatan/[namaKecamatan]/pengrajin/route.ts
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

    const allPengrajin = await prisma.user.findMany({
      where: {
        role: "PENGRAJIN",
      },
      include: {
        pengrajinProfile: true,
      },
    });

    const pengrajinInKecamatan = allPengrajin.filter((pengrajin) => {
      const profile = pengrajin.pengrajinProfile;
      if (profile?.workshopLatitude && profile?.workshopLongitude) {
        const pengrajinPoint = turfPoint([
          profile.workshopLongitude,
          profile.workshopLatitude,
        ]);
        return booleanPointInPolygon(pengrajinPoint, kecamatanPolygon);
      }
      return false;
    });

    const response = pengrajinInKecamatan.map((pengrajin) => ({
      id: pengrajin.id,
      name: pengrajin.name,
      image: pengrajin.image,
      address: pengrajin.address,
      latitude: pengrajin.pengrajinProfile?.workshopLatitude,
      longitude: pengrajin.pengrajinProfile?.workshopLongitude,
      workshopAddress: pengrajin.pengrajinProfile?.workshopAddress,
      craftTypes: pengrajin.pengrajinProfile?.craftTypes,
      specializedMaterials: pengrajin.pengrajinProfile?.specializedMaterials,
      averageRating: pengrajin.pengrajinProfile?.averageRating,
      totalProducts: pengrajin.pengrajinProfile?.totalProducts,
      isVerified: pengrajin.isVerified,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      `Error fetching pengrajin for kecamatan ${namaKecamatan}:`,
      error
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data pengrajin.";
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: errorMessage },
      { status: 500 }
    );
  }
}
