/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Booking {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  materialType: string | null;
  budget: number | null;
  estimatedPrice: number | null;
  finalPrice: number | null;
  referenceImages: string[];
  deadline: string | null;
  address: string | null;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  inProgress: number;
  completed: number;
}

export default function BookingsPage({
  userId, // ← ganti dari params jadi userId langsung
}: {
  userId: string; // ← ganti tipe props
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/pengrajin/bookings/${userId}`);
      const data = await res.json();
      setBookings(data.bookings);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "ALL") return true;
    return booking.status === filterStatus;
  });

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await fetch(`/api/pengrajin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openWhatsApp = (phone: string | null, bookingTitle: string) => {
    if (!phone) {
      alert("Nomor WhatsApp customer tidak tersedia");
      return;
    }
    const message = `Halo, saya ingin membahas tentang booking: ${bookingTitle}`;
    window.open(
      `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
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
          <h1 className="text-2xl font-bold text-gray-900">
            Booking & Pesanan Custom
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola pesanan custom dari pelanggan
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Booking</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Diterima</p>
            <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Dikerjakan</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Selesai</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="IN_PROGRESS">Dikerjakan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="REJECTED">Ditolak</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Tidak ada booking ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {booking.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(booking.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                      {booking.deadline && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          Deadline:{" "}
                          {new Date(booking.deadline).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      )}
                      {booking.budget && (
                        <span className="flex items-center gap-1">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          Budget: Rp {booking.budget.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {booking.user.image ? (
                      <Image
                        src={booking.user.image}
                        alt={booking.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {booking.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === "PENDING" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(booking.id, "ACCEPTED");
                        }}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Terima
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(booking.id, "REJECTED");
                        }}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Tolak
                      </button>
                    </>
                  )}
                  {booking.status === "ACCEPTED" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(booking.id, "IN_PROGRESS");
                      }}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Mulai Kerjakan
                    </button>
                  )}
                  {booking.status === "IN_PROGRESS" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(booking.id, "COMPLETED");
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Tandai Selesai
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openWhatsApp(booking.user.phone, booking.title);
                    }}
                    className="px-4 py-2 bg-[#25D366] text-white text-sm rounded hover:bg-[#20BA5A] transition-colors flex items-center gap-1"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedBooking.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Deskripsi</p>
                  <p className="text-gray-600">{selectedBooking.description}</p>
                </div>
                {selectedBooking.serviceType && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Jenis Layanan
                    </p>
                    <p className="text-gray-600">
                      {selectedBooking.serviceType}
                    </p>
                  </div>
                )}
                {selectedBooking.materialType && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Material
                    </p>
                    <p className="text-gray-600">
                      {selectedBooking.materialType}
                    </p>
                  </div>
                )}
                {selectedBooking.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Alamat</p>
                    <p className="text-gray-600 flex items-start gap-1">
                      <MapPinIcon className="w-4 h-4 mt-0.5" />
                      {selectedBooking.address}
                    </p>
                  </div>
                )}
                {selectedBooking.referenceImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Gambar Referensi
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedBooking.referenceImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative h-24 bg-gray-100 rounded"
                        >
                          <Image
                            src={img}
                            alt={`Reference ${idx + 1}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
