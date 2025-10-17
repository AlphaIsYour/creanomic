// app/api/kecamatan/lib/geojson-loader.ts
import fs from "fs/promises";
import path from "path";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

interface KecamatanProperties {
  wadmkc?: string;
  wadmkk?: string;
  ["jumlah kel"]?: number;
  ["jumlah k_1"]?: number;
}

export type KecamatanFeature = Feature<
  Polygon | MultiPolygon,
  KecamatanProperties
>;
export type KecamatanFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  KecamatanProperties
>;

let cachedGeoJSON: KecamatanFeatureCollection | null = null;

export async function getMalangGeoJSON(): Promise<KecamatanFeatureCollection> {
  if (cachedGeoJSON && process.env.NODE_ENV === "production") {
    return cachedGeoJSON;
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "app/components/dashboard/json",
      "malang.json"
    );
    const fileContents = await fs.readFile(filePath, "utf8");
    const geojsonData = JSON.parse(fileContents) as KecamatanFeatureCollection;

    if (
      !geojsonData ||
      geojsonData.type !== "FeatureCollection" ||
      !Array.isArray(geojsonData.features)
    ) {
      throw new Error("Format GeoJSON tidak valid atau kosong.");
    }

    cachedGeoJSON = geojsonData;
    return geojsonData;
  } catch (error) {
    console.error("Gagal memuat atau parse file GeoJSON:", error);
    throw new Error("Tidak dapat memproses data batas wilayah.");
  }
}

export async function getKecamatanPolygon(
  namaKecamatan: string
): Promise<KecamatanFeature | null> {
  const geojsonData = await getMalangGeoJSON();
  const decodedNamaKecamatan = decodeURIComponent(namaKecamatan);

  const kecamatanFeature = geojsonData.features.find(
    (feature) =>
      feature.properties?.wadmkc?.toLowerCase() ===
      decodedNamaKecamatan.toLowerCase()
  );

  return kecamatanFeature || null;
}
