/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sari Wijaya",
      role: "Ibu Rumah Tangga",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Platform ini sangat membantu saya mengelola sampah rumah tangga. Sekarang sampah plastik bisa dijual ke pengepul terdekat dengan mudah!",
    },
    {
      name: "Budi Santoso",
      role: "Pengepul",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Daurin memudahkan saya menemukan supplier sampah berkualitas. Sistem chat dan lokasi real-time sangat efisien untuk bisnis saya.",
    },
    {
      name: "Maya Indira",
      role: "Pengrajin",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Sebagai pengrajin, platform ini membuka peluang baru untuk menerima pesanan custom. Chatbot AI-nya juga membantu mencarikan klien potensial.",
    },
  ];

  return (
    <section className="py-20 bg-[#F4E1D2]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2C] mb-6">
            Kata
            <span className="bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
              {" "}
              Mereka
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimoni nyata dari pengguna yang telah merasakan manfaat platform
            Daurin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#B7410E]/20 group-hover:text-[#B7410E]/40 transition-colors" />

              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-[#2C2C2C] text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed italic">
                &quot;{testimonial.text}&quot;
              </p>

              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#B7410E] to-[#D4651F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
