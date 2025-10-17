import { NextResponse } from "next/server";
import bankSampah from "@/app/components/dashboard/json/bank-sampah.json";
import lembagaTpa from "@/app/components/dashboard/json/lembaga-tpa.json";
import tpa from "@/app/components/dashboard/json/tpa.json";
import tpst3r from "@/app/components/dashboard/json/tpst3r.json";

interface GeoJSONFeature {
  type: string;
  properties: {
    id?: string;
    nama?: string;
    alamat?: string;
    no?: number;
    lat_1?: number | string;
    long_1?: number | string;
    lat_2?: number | string;
    long_2?: number | string;
    lintang?: number;
    bujur?: number;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export async function GET() {
  try {
    // Transform GeoJSON features to simpler format
    const transformFeatures = (features: GeoJSONFeature[], type: string) => {
      return features
        .map((feature) => {
          // Get coordinates from properties
          let latitude = 0;
          let longitude = 0;

          // Special handling for lembaga-tpa (uses lintang/bujur)
          if (
            type === "Lembaga TPA" &&
            feature.properties.lintang &&
            feature.properties.bujur
          ) {
            latitude = feature.properties.lintang;
            longitude = feature.properties.bujur;
          }
          // Try lat_2/long_2 first as they are usually in decimal format
          else if (feature.properties.lat_2 && feature.properties.long_2) {
            // Handle DMS format for TPST3R data
            if (
              type === "TPST3R" &&
              typeof feature.properties.lat_2 === "string"
            ) {
              // Skip DMS format, use lat_1/long_1 instead for TPST3R
              if (feature.properties.lat_1 && feature.properties.long_1) {
                latitude =
                  typeof feature.properties.lat_1 === "number"
                    ? feature.properties.lat_1
                    : parseFloat(feature.properties.lat_1);
                longitude =
                  typeof feature.properties.long_1 === "number"
                    ? feature.properties.long_1
                    : parseFloat(feature.properties.long_1);
              }
            } else {
              latitude =
                typeof feature.properties.lat_2 === "string"
                  ? parseFloat(feature.properties.lat_2)
                  : feature.properties.lat_2;
              longitude =
                typeof feature.properties.long_2 === "string"
                  ? parseFloat(feature.properties.long_2)
                  : feature.properties.long_2;
            }
          }
          // Fallback to lat_1/long_1
          else if (feature.properties.lat_1 && feature.properties.long_1) {
            const lat1 =
              typeof feature.properties.lat_1 === "string"
                ? parseFloat(feature.properties.lat_1)
                : feature.properties.lat_1;
            const lng1 =
              typeof feature.properties.long_1 === "string"
                ? parseFloat(feature.properties.long_1)
                : feature.properties.long_1;

            // Fix coordinate signs - ensure proper negative values for Indonesia
            latitude = lat1 < 0 ? lat1 : -Math.abs(lat1);
            longitude = lng1;
          }
          // Fallback to geometry coordinates
          else if (
            feature.geometry.coordinates &&
            feature.geometry.coordinates.length >= 2
          ) {
            longitude = feature.geometry.coordinates[0];
            latitude = feature.geometry.coordinates[1];
          }

          return {
            id:
              feature.properties.id ||
              feature.properties.no?.toString() ||
              Math.random().toString(36).substr(2, 9),
            name: feature.properties.nama || "Tidak ada nama",
            address: feature.properties.alamat || "Tidak ada alamat",
            type: type,
            latitude: latitude,
            longitude: longitude,
          };
        })
        .filter((item) => {
          // Filter out invalid coordinates
          return (
            item.latitude !== 0 &&
            item.longitude !== 0 &&
            !isNaN(item.latitude) &&
            !isNaN(item.longitude)
          );
        });
    };

    const facilities = {
      bankSampah: transformFeatures(bankSampah.features, "Bank Sampah"),
      lembagaTpa: transformFeatures(lembagaTpa.features, "Lembaga TPA"),
      tpa: transformFeatures(tpa.features, "TPA"),
      tpst3r: transformFeatures(tpst3r.features, "TPST3R"),
    };

    console.log("Facilities count:", {
      bankSampah: facilities.bankSampah.length,
      lembagaTpa: facilities.lembagaTpa.length,
      tpa: facilities.tpa.length,
      tpst3r: facilities.tpst3r.length,
    });

    const totalFacilities =
      facilities.bankSampah.length +
      facilities.lembagaTpa.length +
      facilities.tpa.length +
      facilities.tpst3r.length;

    if (totalFacilities === 0) {
      return NextResponse.json(
        {
          facilities: [],
          message: "Belum ada fasilitas yang tersedia di peta",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      facilities,
      message: `Ditemukan ${totalFacilities} fasilitas pengelolaan sampah`,
    });
  } catch (error) {
    console.error("Error fetching waste facilities:", error);
    return NextResponse.json(
      {
        error: "Gagal memuat data fasilitas",
        message: "Terjadi kesalahan saat memuat data fasilitas",
      },
      { status: 500 }
    );
  }
}
