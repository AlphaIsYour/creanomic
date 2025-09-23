"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  MessageCircle,
  Recycle,
  Palette,
  Bot,
  Star,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Lokasi Real-time",
      description:
        "Temukan pengepul dan pengrajin terdekat dengan sistem GPS terintegrasi",
    },
    {
      icon: Recycle,
      title: "Pengepul Sampah",
      description:
        "Hubungkan sampah Anda dengan pengepul yang tepat untuk daur ulang optimal",
    },
    {
      icon: Palette,
      title: "Jasa Pengrajin",
      description:
        "Pesan kerajinan custom dari bahan daur ulang dengan pengrajin berpengalaman",
    },
    {
      icon: MessageCircle,
      title: "Chat Real-time",
      description:
        "Komunikasi langsung dengan pengepul dan pengrajin untuk kesepakatan terbaik",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description:
        "Chatbot cerdas untuk rekomendasi pengepul dan pengrajin sesuai kebutuhan",
    },
    {
      icon: Star,
      title: "Rating & Review",
      description:
        "Sistem penilaian transparan untuk menjamin kualitas layanan terbaik",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2C] mb-6">
            Fitur
            <span className="bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
              {" "}
              Unggulan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Teknologi terdepan untuk menciptakan ekosistem green business yang
            berkelanjutan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 bg-gradient-to-br from-white to-[#F4E1D2]/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#B7410E]/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#B7410E] to-[#D4651F] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
