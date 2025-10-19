/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MATERIAL_LABELS: Record<string, string> = {
  PLASTIC: "Plastik",
  GLASS: "Kaca",
  METAL: "Logam",
  PAPER: "Kertas",
  CARDBOARD: "Kardus",
  ELECTRONIC: "Elektronik",
  TEXTILE: "Tekstil",
  WOOD: "Kayu",
  RUBBER: "Karet",
  ORGANIC: "Organik",
  OTHER: "Lainnya",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Dipublikasikan",
  SOLD_OUT: "Habis",
  ARCHIVED: "Diarsipkan",
};

export default function ProductDetailClient({ product }: any) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    const badges: Record<string, { bg: string; text: string }> = {
      PUBLISHED: { bg: "bg-green-100", text: "text-green-800" },
      DRAFT: { bg: "bg-gray-100", text: "text-gray-800" },
      SOLD_OUT: { bg: "bg-red-100", text: "text-red-800" },
      ARCHIVED: { bg: "bg-yellow-100", text: "text-yellow-800" },
    };
    const badge = badges[product.status] || badges.DRAFT;
    return `${badge.bg} ${badge.text}`;
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Menambahkan ${quantity} ${product.title} ke keranjang`);
  };

  const handleBuyNow = () => {
    // TODO: Implement direct checkout
    alert(`Membeli ${quantity} ${product.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            ← Kembali
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {product.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-6xl">
                    📦
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge()}`}
                  >
                    {STATUS_LABELS[product.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-[#8C1007]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-black mb-2">
                {product.title}
              </h1>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>

              <div className="border-t border-b py-4 mb-4">
                <p className="text-4xl font-bold text-[#8C1007]">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Stok</span>
                  <span className="font-medium text-black">
                    {product.stock} pcs
                  </span>
                </div>

                {product.dimensions && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Dimensi</span>
                    <span className="font-medium text-black">
                      {product.dimensions}
                    </span>
                  </div>
                )}

                {product.weight && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Berat</span>
                    <span className="font-medium text-black">
                      {product.weight} kg
                    </span>
                  </div>
                )}

                {product.colors?.length > 0 && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600 mb-2 block">
                      Warna
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color: string) => (
                        <span
                          key={color}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-black"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.materials?.length > 0 && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600 mb-2 block">
                      Material
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material: string) => (
                        <span
                          key={material}
                          className="px-3 py-1 bg-[#F4E1D2] text-[#8C1007] rounded-full text-sm font-medium"
                        >
                          {MATERIAL_LABELS[material] || material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.customizable && (
                  <div className="py-2">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      ✨ Bisa Custom
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity & Actions */}
              {product.status === "PUBLISHED" && product.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Jumlah:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-black hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 text-center border-x border-gray-300 py-2 text-black"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-4 py-2 text-black hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-6 py-3 border-2 border-[#8C1007] text-[#8C1007] font-medium rounded-lg hover:bg-[#8C1007] hover:text-white transition-colors"
                    >
                      🛒 Keranjang
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-6 py-3 bg-[#8C1007] text-white font-medium rounded-lg hover:bg-[#7a0d06] transition-colors"
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              )}

              {product.status === "SOLD_OUT" && (
                <div className="text-center py-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 font-medium">Produk Habis</p>
                </div>
              )}
            </div>

            {/* Pengrajin Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Pengrajin
              </h3>
              <div className="flex items-center gap-4 mb-4">
                {product.pengrajin.user.image ? (
                  <Image
                    src={product.pengrajin.user.image}
                    alt={product.pengrajin.user.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-full" />
                )}
                <div>
                  <p className="font-semibold text-black">
                    {product.pengrajin.user.name}
                  </p>
                  <p className="text-sm text-gray-500">Pengrajin</p>
                </div>
              </div>
              <Link
                href={`/pengrajin/${product.pengrajin.id}`}
                className="block text-center px-4 py-2 bg-[#8C1007] text-white font-medium rounded-lg hover:bg-[#7a0d06] transition-colors"
              >
                Lihat Profil Pengrajin
              </Link>
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-black mb-4">
            Deskripsi Produk
          </h2>
          <p className="text-black whitespace-pre-wrap mb-6">
            {product.description}
          </p>

          {product.tags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-black mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
