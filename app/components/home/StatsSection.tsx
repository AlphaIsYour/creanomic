"use client";

import { motion } from "framer-motion";
import { Users, Recycle, TreePine, TrendingUp } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Pengguna Aktif",
      description: "Bergabung dalam komunitas green business",
    },
    {
      icon: Recycle,
      number: "500+",
      label: "Ton Sampah",
      description: "Telah didaur ulang melalui platform",
    },
    {
      icon: TreePine,
      number: "2,500+",
      label: "Pohon Diselamatkan",
      description: "Setara dengan dampak lingkungan positif",
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Tingkat Kepuasan",
      description: "Rating rata-rata dari pengguna",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#B7410E] to-[#A0370C] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Dampak Nyata untuk
            <span className="block text-[#F4E1D2]">Bumi Kita</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Angka-angka yang menunjukkan kontribusi nyata platform dalam
            menciptakan lingkungan yang lebih berkelanjutan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-10 h-10 text-white" />
              </div>

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-2"
              >
                {stat.number}
              </motion.div>

              <h3 className="text-xl font-semibold text-[#F4E1D2] mb-2">
                {stat.label}
              </h3>
              <p className="text-white/80 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
    </section>
  );
}
