// app/privacy-policy/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-[#8C1007] mb-4"
        >
          ← Kembali
        </button>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                1. Informasi yang Kami Kumpulkan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Daurin mengumpulkan informasi yang Anda berikan saat mendaftar
                dan menggunakan layanan kami, termasuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Nama lengkap dan informasi kontak (email, nomor telepon)
                </li>
                <li>Alamat dan koordinat lokasi untuk layanan pemetaan</li>
                <li>
                  Foto profil dan dokumen verifikasi (untuk pengepul dan
                  pengrajin)
                </li>
                <li>Informasi produk dan penawaran sampah yang Anda posting</li>
                <li>Riwayat transaksi dan ulasan</li>
                <li>Data penggunaan aplikasi dan preferensi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                2. Penggunaan Informasi
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Menyediakan dan meningkatkan layanan platform</li>
                <li>
                  Memfasilitasi koneksi antara pengguna, pengepul, dan pengrajin
                </li>
                <li>Menampilkan lokasi pada peta interaktif</li>
                <li>Memproses transaksi dan komunikasi</li>
                <li>Mengirim notifikasi dan informasi penting</li>
                <li>Melakukan analisis untuk pengembangan platform</li>
                <li>Menjaga keamanan dan mencegah penyalahgunaan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                3. Berbagi Informasi
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Informasi Anda dapat dibagikan kepada:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Pengguna lain yang relevan (pengepul, pengrajin) untuk
                  memfasilitasi transaksi
                </li>
                <li>
                  Pihak ketiga yang menyediakan layanan pendukung (hosting,
                  pembayaran)
                </li>
                <li>Pihak berwenang jika diperlukan untuk kepatuhan hukum</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Kami tidak akan menjual atau menyewakan informasi pribadi Anda
                kepada pihak ketiga untuk tujuan pemasaran.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                4. Keamanan Data
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi
                yang sesuai untuk melindungi informasi pribadi Anda dari akses,
                pengungkapan, perubahan, atau penghancuran yang tidak sah.
                Namun, tidak ada sistem yang 100% aman, dan kami tidak dapat
                menjamin keamanan absolut.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                5. Hak Anda
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Mengakses dan memperbarui informasi pribadi Anda</li>
                <li>Menghapus akun dan data Anda</li>
                <li>Menolak atau membatasi pemrosesan data tertentu</li>
                <li>Meminta salinan data Anda</li>
                <li>Mengajukan keluhan terkait penanganan data pribadi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                6. Cookies dan Teknologi Pelacakan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menggunakan cookies dan teknologi serupa untuk meningkatkan
                pengalaman pengguna, menganalisis penggunaan platform, dan
                menyediakan fitur yang dipersonalisasi. Anda dapat mengatur
                preferensi cookies melalui pengaturan browser Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                7. Perubahan Kebijakan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke
                waktu. Perubahan signifikan akan diinformasikan melalui email
                atau notifikasi di platform. Penggunaan berkelanjutan setelah
                perubahan berarti Anda menerima kebijakan yang diperbarui.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                8. Hubungi Kami
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau
                ingin menggunakan hak Anda, silakan hubungi kami:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@daurin.com
                  <br />
                  <strong>Alamat:</strong> Malang, Jawa Timur, Indonesia
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
