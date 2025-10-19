/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import ProductFormModal from "@/app/dashboard/pengrajin/[userId]/components/ProductFormModal";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  materials: string[];
  stock: number;
  status: string;
  views: number;
  createdAt: string;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
  soldOut: number;
}

export default function ProductsPage({ userId }: { userId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    draft: 0,
    soldOut: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/pengrajin/products`);
      const data = await res.json();
      setProducts(data.products);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "ALL" || product.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleMarkSold = async (productId: string) => {
    try {
      await fetch(`/api/pengrajin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SOLD_OUT" }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error marking sold:", error);
    }
  };

  const handlePublish = async (productId: string) => {
    try {
      await fetch(`/api/pengrajin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error publishing:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await fetch(`/api/pengrajin/products/${productId}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditProduct(null);
  };

  if (loading) {
    return (
      <DashboardLayout userId={userId}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={userId}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Produk Saya</h1>
          <p className="text-gray-600 mt-1">
            Kelola semua produk kerajinan Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Produk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Dipublikasi</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.published}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Terjual</p>
            <p className="text-2xl font-bold text-[#8C1007]">{stats.soldOut}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Dipublikasi</option>
              <option value="DRAFT">Draft</option>
              <option value="SOLD_OUT">Terjual</option>
              <option value="ARCHIVED">Diarsipkan</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#6D0C05] transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Produk
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        product.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : product.status === "SOLD_OUT"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-[#8C1007]">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.views} views
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {product.status === "DRAFT" && (
                      <button
                        onClick={() => handlePublish(product.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Publikasi
                      </button>
                    )}
                    {product.status === "PUBLISHED" && (
                      <button
                        onClick={() => handleMarkSold(product.id)}
                        className="flex-1 px-3 py-2 bg-[#8C1007] text-white text-sm rounded hover:bg-[#6D0C05] transition-colors"
                      >
                        Tandai Terjual
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-[#8C1007] border border-gray-300 rounded hover:border-[#8C1007] transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 border border-gray-300 rounded hover:border-red-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={fetchProducts}
        userId={userId}
        product={editProduct}
      />
    </DashboardLayout>
  );
}
