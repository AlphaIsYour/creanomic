"use client";
// app/terms-of-service/page.tsx

import { useRouter } from "next/navigation";

export default function TermsOfServicePage() {
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
            Syarat dan Ketentuan
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
                1. Penerimaan Syarat
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Dengan mengakses dan menggunakan platform Daurin, Anda setuju
                untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak
                setuju dengan syarat ini, harap tidak menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                2. Tentang Daurin
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Daurin adalah platform digital yang menghubungkan masyarakat
                dengan pengepul sampah dan pengrajin daur ulang. Platform ini
                menyediakan:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Peta interaktif untuk menemukan pengepul dan pengrajin</li>
                <li>Marketplace untuk produk kerajinan daur ulang</li>
                <li>Sistem penawaran dan pengambilan sampah</li>
                <li>Layanan pemesanan produk custom</li>
                <li>Sistem review dan rating</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                3. Pendaftaran dan Akun
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Anda harus berusia minimal 17 tahun untuk menggunakan layanan
                  ini
                </li>
                <li>Informasi yang Anda berikan harus akurat dan terkini</li>
                <li>Anda bertanggung jawab menjaga kerahasiaan akun Anda</li>
                <li>Satu orang hanya boleh memiliki satu akun aktif</li>
                <li>Pengepul dan pengrajin harus melalui proses verifikasi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                4. Penggunaan Platform
              </h2>
              <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                Anda dilarang:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Memposting konten yang menyesatkan, ilegal, atau melanggar hak
                  orang lain
                </li>
                <li>
                  Menggunakan platform untuk penipuan atau aktivitas ilegal
                </li>
                <li>Mengganggu atau merusak sistem keamanan platform</li>
                <li>Mengumpulkan data pengguna lain tanpa izin</li>
                <li>Menggunakan bot atau otomasi yang tidak sah</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                5. Transaksi dan Pembayaran
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Daurin memfasilitasi koneksi antara pembeli dan penjual</li>
                <li>
                  Transaksi pembayaran dilakukan langsung antara pengguna
                  melalui WhatsApp atau metode yang disepakati
                </li>
                <li>
                  Platform tidak bertanggung jawab atas perselisihan transaksi
                  antara pengguna
                </li>
                <li>
                  Harga, ketersediaan, dan kualitas produk adalah tanggung jawab
                  pengrajin
                </li>
                <li>
                  Pengguna diharapkan menyelesaikan transaksi dengan itikad baik
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                6. Konten Pengguna
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Dengan memposting konten (foto, deskripsi, review), Anda
                memberikan Daurin lisensi non-eksklusif untuk menggunakan,
                menampilkan, dan mendistribusikan konten tersebut di platform.
                Anda tetap memiliki hak cipta atas konten Anda dan dapat
                menghapusnya kapan saja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                7. Pengepul dan Pengrajin
              </h2>
              <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                Pengepul dan pengrajin yang terdaftar wajib:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Menyediakan informasi verifikasi yang valid</li>
                <li>Menjaga profesionalitas dalam berkomunikasi</li>
                <li>Memberikan layanan sesuai yang dijanjikan</li>
                <li>Mematuhi peraturan pengelolaan sampah yang berlaku</li>
                <li>
                  Bertanggung jawab atas kualitas produk atau layanan mereka
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                8. Pembatasan Tanggung Jawab
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Daurin tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Kualitas, keamanan, atau legalitas produk dan layanan yang
                  ditawarkan
                </li>
                <li>Keakuratan informasi yang diberikan pengguna</li>
                <li>
                  Kerugian langsung atau tidak langsung dari penggunaan platform
                </li>
                <li>Gangguan teknis atau kehilangan data</li>
                <li>Tindakan pihak ketiga yang menggunakan platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                9. Penangguhan dan Penghentian
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami berhak menangguhkan atau menghentikan akun Anda jika:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Anda melanggar syarat dan ketentuan ini</li>
                <li>Menerima laporan pelanggaran yang valid</li>
                <li>Aktivitas mencurigakan terdeteksi</li>
                <li>Atas permintaan pihak berwenang</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                10. Perubahan Syarat
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu.
                Perubahan akan diinformasikan melalui platform atau email.
                Penggunaan berkelanjutan setelah perubahan berarti Anda menerima
                syarat yang diperbarui.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                11. Hukum yang Berlaku
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
                Setiap perselisihan akan diselesaikan melalui musyawarah, dan
                jika tidak tercapai kesepakatan, akan diselesaikan di pengadilan
                yang berwenang di Malang, Jawa Timur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                12. Kontak
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Untuk pertanyaan tentang syarat dan ketentuan ini, hubungi kami:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@Daurin.com
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
