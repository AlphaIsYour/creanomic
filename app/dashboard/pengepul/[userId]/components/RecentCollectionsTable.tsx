"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface WasteCollection {
  id: string;
  title: string;
  materialType: string;
  weight: number | null;
  status: string;
  takenAt: string | null;
  userName: string;
}

interface RecentCollectionsTableProps {
  collections: WasteCollection[];
  loading?: boolean;
}

export default function RecentCollectionsTable({
  collections,
  loading = false,
}: RecentCollectionsTableProps) {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      RESERVED: "bg-blue-100 text-blue-800",
      TAKEN: "bg-purple-100 text-purple-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      RESERVED: "Direservasi",
      TAKEN: "Diambil",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
    };
    return texts[status] || status;
  };

  const getMaterialText = (material: string) => {
    const texts: { [key: string]: string } = {
      PLASTIC: "Plastik",
      GLASS: "Kaca",
      METAL: "Logam",
      PAPER: "Kertas",
      CARDBOARD: "Kardus",
      ELECTRONIC: "Elektronik",
      TEXTILE: "Tekstil",
      WOOD: "Kayu",
      RUBBER: "Karet",
      ORGANIC: "Organik",
      OTHER: "Lainnya",
    };
    return texts[material] || material;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#2C2C2C]">Pengumpulan Terbaru</h3>
          <Link
            href="/pengepul/collections"
            className="text-sm text-[#8C1007] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Penyetor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Berat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Belum ada pengumpulan
                </td>
              </tr>
            ) : (
              collections.map((collection, index) => (
                <motion.tr
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/waste-offers/${collection.id}`}
                      className="text-sm font-medium text-[#8C1007] hover:underline"
                    >
                      {collection.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#2C2C2C]">
                      {collection.userName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {getMaterialText(collection.materialType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#2C2C2C]">
                      {collection.weight ? `${collection.weight} kg` : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        collection.status
                      )}`}
                    >
                      {getStatusText(collection.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {collection.takenAt
                      ? new Date(collection.takenAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
