"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Globe, Leaf } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#B7410E]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Siap Menjadi Bagian
                <span className="block bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
                  Revolusi Hijau?
                </span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed">
                Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat
                platform Daurin. Mulai perjalanan menuju bisnis yang lebih
                berkelanjutan hari ini.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#B7410E] rounded-full" />
                <span className="text-gray-300">
                  Gratis untuk semua pengguna
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#B7410E] rounded-full" />
                <span className="text-gray-300">
                  Dukungan 24/7 dari tim ahli
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#B7410E] rounded-full" />
                <span className="text-gray-300">
                  Akses ke seluruh fitur premium
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/register"
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#B7410E] to-[#D4651F] text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="font-medium">Daftar Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth/login"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 text-center"
              >
                Sudah Punya Akun?
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
              >
                <Smartphone className="w-12 h-12 text-[#B7410E] mb-4" />
                <h3 className="text-white font-semibold mb-2">Mobile First</h3>
                <p className="text-gray-300 text-sm">
                  Akses mudah dari smartphone Anda
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mt-8"
              >
                <Globe className="w-12 h-12 text-[#B7410E] mb-4" />
                <h3 className="text-white font-semibold mb-2">
                  Jangkauan Luas
                </h3>
                <p className="text-gray-300 text-sm">
                  Tersedia di seluruh Indonesia
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 -mt-4"
              >
                <Leaf className="w-12 h-12 text-[#B7410E] mb-4" />
                <h3 className="text-white font-semibold mb-2">
                  Ramah Lingkungan
                </h3>
                <p className="text-gray-300 text-sm">
                  Kontribusi nyata untuk bumi
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#B7410E]/20 to-[#D4651F]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#B7410E]/30 mt-4"
              >
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <h3 className="text-white font-semibold mb-2">
                  Pengguna Aktif
                </h3>
                <p className="text-gray-300 text-sm">
                  Dan terus bertambah setiap hari
                </p>
              </motion.div>
            </div>

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#B7410E]/20 to-[#D4651F]/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
