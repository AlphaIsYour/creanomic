"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#B7410E]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Tentang{" "}
            <span className="bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
              Kami
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-[#B7410E]/30 to-[#D4651F]/30 rounded-2xl border border-[#B7410E]/20 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-2 bg-gradient-to-r from-[#B7410E] to-[#D4651F] rounded-full opacity-60" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-gray-300 text-lg leading-relaxed text-justify space-y-4">
              <p>
                Daurin lahir dari visi untuk menciptakan masa depan yang lebih
                berkelanjutan melalui inovasi teknologi. Sebagai platform
                terdepan dalam solusi ramah lingkungan, kami berkomitmen untuk
                menghadirkan transformasi digital yang tidak hanya menguntungkan
                bisnis, tetapi juga berkontribusi positif terhadap kelestarian
                lingkungan.
              </p>

              <p>
                Dengan tim ahli yang berpengalaman lebih dari 10 tahun di bidang
                teknologi hijau dan pengembangan berkelanjutan, kami memahami
                tantangan yang dihadapi perusahaan modern dalam mengadopsi
                praktik bisnis yang ramah lingkungan. Melalui penelitian
                mendalam dan kolaborasi dengan berbagai stakeholder, kami
                mengembangkan solusi inovatif yang memungkinkan bisnis untuk
                tumbuh sambil menjaga keseimbangan ekosistem.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
