"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InteractiveMap } from "@/app/components/home/InteractiveMap";

export function MapsSection() {
  return (
    <section
      id="home"
      className="pt-8 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4E1D2]/30 via-transparent to-[#F4E1D2]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(140,16,7,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 text-[#8C1007] font-semibold text-sm tracking-wide"
              >
                <div className="w-2 h-2 bg-[#8C1007] rounded-full animate-pulse" />
                <span>PLATFORM GREEN BUSINESS TERDEPAN</span>
              </motion.div>

              <h1 className="text-3xl lg:text-5xl font-extrabold text-[#2C2C2C] leading-[1.1] tracking-tight">
                Ubah Sampah Jadi{" "}
                <span className="bg-gradient-to-r from-[#8C1007] via-[#8C1007] to-[#8C1007]/80 bg-clip-text text-transparent">
                  Berkah
                </span>
              </h1>

              <p className="text-xl text-[#2C2C2C]/70 leading-relaxed font-medium max-w-xl">
                Platform revolusioner yang menghubungkan masyarakat dengan
                pengepul dan pengrajin untuk menciptakan ekonomi sirkular yang
                berkelanjutan.
              </p>
              <p className="text-xl text-[#2C2C2C]/70 leading-relaxed font-medium max-w-xl">
                Platform revolusioner yang menghubungkan masyarakat dengan
                pengepul dan pengrajin untuk menciptakan ekonomi sirkular yang
                berkelanjutan.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/register"
                className="group flex items-center justify-center space-x-3 px-10 py-4 bg-[#8C1007] text-white rounded-2xl hover:bg-[#8C1007]/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] font-semibold"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glassmorphism Container */}
            <div
              className="relative h-[550px] rounded-3xl overflow-hidden border border-white/20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
                backdropFilter: "blur(30px)",
                boxShadow: `
                  0 20px 50px rgba(140,16,7,0.15),
                  0 10px 25px rgba(0,0,0,0.1),
                  inset 0 1px 0 rgba(255,255,255,0.3),
                  inset 0 -1px 0 rgba(140,16,7,0.1)
                `,
              }}
            >
              {/* Inner shadow for depth */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  boxShadow: "inset 0 0 50px rgba(140,16,7,0.05)",
                }}
              />

              {/* Map container with additional glass effect */}
              <div
                className="absolute inset-4 rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <InteractiveMap />
              </div>

              {/* Highlight effect */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
