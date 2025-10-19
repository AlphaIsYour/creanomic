/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Eye, Package as PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductsTabProps {
  products: any[];
}

export default function ProductsTab({ products }: ProductsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/marketplace/products/${product.id}`}
                className="group block bg-white rounded-xl overflow-hidden border border-[#2C2C2C] hover:border-[#8C1007] hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F4E1D2]">
                      <PackageIcon className="w-16 h-16 text-[#8C1007] opacity-30" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold border-2 border-[#2C2C2C] uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Views Badge */}
                  {product.views !== undefined && product.views > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-semibold">
                      <Eye className="w-3.5 h-3.5" />
                      {product.views}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-[#2C2C2C] mb-2 line-clamp-2 group-hover:text-[#8C1007] transition-colors min-h-[3rem]">
                    {product.title}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                  )}

                  <div className="pt-3 border-t-2 border-[#F4E1D2]">
                    <p className="text-2xl font-bold text-[#8C1007] mb-2">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>

                    {/* Stock & Custom Info */}
                    {(product.stock !== undefined || product.customizable) && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        {product.stock !== undefined && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Stok: {product.stock}
                          </span>
                        )}
                        {product.customizable && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F4E1D2] border-2 border-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="w-10 h-10 text-[#8C1007]" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">
            Belum Ada Produk
          </h3>
          <p className="text-sm text-gray-600">
            Produk kerajinan akan ditampilkan di sini
          </p>
        </div>
      )}
    </motion.div>
  );
}
