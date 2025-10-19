// app/marketplace/components/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    images: string[];
    category: string;
    status?: string;
    views?: number;
    stock?: number;
    customizable?: boolean;
    pengrajin: {
      user: {
        name: string;
      };
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/marketplace/products/${product.id}`}
        className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              📦
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
              {product.category}
            </span>
          </div>

          {/* Views Badge */}
          {product.views !== undefined && product.views > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
              <EyeIcon className="w-3 h-3" />
              {product.views}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-base">
            {product.title}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
          )}

          <p className="text-xs text-gray-500 mb-3">
            Oleh: {product.pengrajin.user.name}
          </p>

          <p className="text-[#8C1007] font-bold text-lg mb-2">
            {formatPrice(product.price)}
          </p>

          {/* Stock & Custom Info */}
          {(product.stock !== undefined || product.customizable) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {product.stock !== undefined && (
                <span>Stok: {product.stock}</span>
              )}
              {product.customizable && product.stock !== undefined && (
                <span>•</span>
              )}
              {product.customizable && <span>Custom</span>}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
