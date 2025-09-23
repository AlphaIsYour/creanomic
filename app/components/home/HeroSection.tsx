"use client";

import { ArrowRight, MapPin, Recycle, Palette } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InteractiveMap } from "@/app/components/home/InteractiveMap";

export function HeroSection() {
  return (
    <section
      id="home"
      className="pt-16 min-h-screen flex items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4E1D2]/50 via-transparent to-white/50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 text-[#B7410E] font-medium"
              >
                <div className="w-2 h-2 bg-[#B7410E] rounded-full animate-pulse" />
                <span>Platform Green Business Terdepan</span>
              </motion.div>

              <h1 className="text-4xl lg:text-6xl font-bold text-[#2C2C2C] leading-tight">
                Ubah Sampah Jadi{" "}
                <span className="bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
                  Berkah
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Platform revolusioner yang menghubungkan masyarakat dengan
                pengepul dan pengrajin untuk menciptakan ekonomi sirkular yang
                berkelanjutan.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#B7410E]/10"
              >
                <MapPin className="w-8 h-8 text-[#B7410E] mb-2" />
                <div className="text-sm font-medium text-[#2C2C2C]">
                  Lokasi Real-time
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#B7410E]/10"
              >
                <Recycle className="w-8 h-8 text-[#B7410E] mb-2" />
                <div className="text-sm font-medium text-[#2C2C2C]">
                  Daur Ulang
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#B7410E]/10"
              >
                <Palette className="w-8 h-8 text-[#B7410E] mb-2" />
                <div className="text-sm font-medium text-[#2C2C2C]">
                  Kerajinan
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-[#B7410E] text-white rounded-xl hover:bg-[#A0370C] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="font-medium">Mulai Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 border-2 border-[#B7410E] text-[#B7410E] rounded-xl hover:bg-[#B7410E] hover:text-white transition-all duration-200"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <InteractiveMap />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#B7410E] to-[#D4651F] rounded-full flex items-center justify-center shadow-lg"
            >
              <Recycle className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#B7410E] rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-[#B7410E] rounded-full mt-2" />
        </motion.div>
      </div>
    </section>
  );
}
