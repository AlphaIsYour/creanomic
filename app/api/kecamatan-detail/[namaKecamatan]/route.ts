// app/api/kecamatan-detail/[namaKecamatan]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { KecamatanDetail } from "@prisma/client";

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

  const decodedNamaKecamatan = decodeURIComponent(namaKecamatan);

  try {
    const kecamatanDetail = await prisma.kecamatanDetail.findUnique({
      where: {
        nama: decodedNamaKecamatan,
      },
    });

    if (!kecamatanDetail) {
      return NextResponse.json(
        {
          error: `Detail untuk kecamatan "${decodedNamaKecamatan}" tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(kecamatanDetail);
  } catch (error) {
    console.error(
      `Error fetching detail for kecamatan ${decodedNamaKecamatan}:`,
      error
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data detail kecamatan.";
    return NextResponse.json(
      { error: "Gagal memproses permintaan", details: errorMessage },
      { status: 500 }
    );
  }
}
