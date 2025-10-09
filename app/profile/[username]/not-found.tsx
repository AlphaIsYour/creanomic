"use client";

import { useRouter } from "next/navigation";
import { UserX, Home, Search } from "lucide-react";

export default function ProfileNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserX className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Profil Tidak Ditemukan
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Maaf, profil yang Anda cari tidak ditemukan atau mungkin telah
            dihapus. Silakan periksa kembali username atau cari pengguna lain.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-[#8C1007] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#6d0c05] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </button>

            <button
              onClick={() => router.push("/search")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Cari Pengguna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
