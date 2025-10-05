/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hammer,
  Recycle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  users: {
    total: number;
    regular: number;
    pengepul: number;
    pengrajin: number;
    activeToday: number;
  };
  approvals: {
    pending: number;
    approved: number;
    rejected: number;
  };
  wasteOffers: {
    total: number;
    available: number;
    reserved: number;
    completed: number;
  };
  products: {
    total: number;
    published: number;
    draft: number;
    soldOut: number;
  };
  transactions: {
    total: number;
    pending: number;
    completed: number;
    totalRevenue: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error("Gagal memuat statistik");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Gagal memuat data statistik</p>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    href,
  }: {
    title: string;
    value: number | string;
    description: string;
    icon: any;
    color: string;
    href?: string;
  }) => {
    const cardContent = (
      <Card
        className={`hover:shadow-lg transition-all ${
          href ? "cursor-pointer" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </CardContent>
      </Card>
    );

    return href ? <Link href={href}>{cardContent}</Link> : cardContent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan aktivitas platform Creanomic
        </p>
      </div>

      {/* Approval Alerts */}
      {stats.approvals.pending > 0 && (
        <Link href="/admin/approval">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">
                  {stats.approvals.pending} Pendaftaran Menunggu Approval
                </p>
                <p className="text-sm text-yellow-700">
                  Klik untuk review dan proses pendaftaran
                </p>
              </div>
              <Badge className="bg-yellow-600">Perlu Review</Badge>
            </div>
          </div>
        </Link>
      )}

      {/* User Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#8C1007]" />
          <span>Statistik Pengguna</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pengguna"
            value={stats.users.total}
            description="Semua user terdaftar"
            icon={Users}
            color="bg-blue-500"
            href="/admin/users"
          />
          <StatCard
            title="Pengguna Biasa"
            value={stats.users.regular}
            description="User dengan role USER"
            icon={Users}
            color="bg-gray-500"
          />
          <StatCard
            title="Pengepul"
            value={stats.users.pengepul}
            description="Pengepul sampah aktif"
            icon={Recycle}
            color="bg-green-500"
          />
          <StatCard
            title="Pengrajin"
            value={stats.users.pengrajin}
            description="Pengrajin aktif"
            icon={Hammer}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Approval Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-[#8C1007]" />
          <span>Status Approval</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Menunggu Approval"
            value={stats.approvals.pending}
            description="Pendaftaran pending"
            icon={Clock}
            color="bg-yellow-500"
            href="/admin/approval"
          />
          <StatCard
            title="Disetujui"
            value={stats.approvals.approved}
            description="Pendaftaran approved"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Ditolak"
            value={stats.approvals.rejected}
            description="Pendaftaran rejected"
            icon={XCircle}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Waste Offers & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Offers */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#8C1007]" />
            <span>Penawaran Sampah</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Penawaran"
              value={stats.wasteOffers.total}
              description="Semua penawaran"
              icon={Package}
              color="bg-orange-500"
              href="/admin/waste-offers"
            />
            <StatCard
              title="Tersedia"
              value={stats.wasteOffers.available}
              description="Belum diambil"
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Reserved"
              value={stats.wasteOffers.reserved}
              description="Sedang diproses"
              icon={Clock}
              color="bg-yellow-500"
            />
            <StatCard
              title="Selesai"
              value={stats.wasteOffers.completed}
              description="Sudah diambil"
              icon={CheckCircle}
              color="bg-blue-500"
            />
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#8C1007]" />
            <span>Produk Kerajinan</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Produk"
              value={stats.products.total}
              description="Semua produk"
              icon={ShoppingBag}
              color="bg-purple-500"
              href="/admin/products"
            />
            <StatCard
              title="Published"
              value={stats.products.published}
              description="Produk aktif"
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Draft"
              value={stats.products.draft}
              description="Belum publish"
              icon={Clock}
              color="bg-gray-500"
            />
            <StatCard
              title="Sold Out"
              value={stats.products.soldOut}
              description="Stok habis"
              icon={XCircle}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#8C1007]" />
          <span>Transaksi</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Transaksi"
            value={stats.transactions.total}
            description="Semua transaksi"
            icon={TrendingUp}
            color="bg-indigo-500"
            href="/admin/transactions"
          />
          <StatCard
            title="Pending"
            value={stats.transactions.pending}
            description="Menunggu konfirmasi"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Selesai"
            value={stats.transactions.completed}
            description="Transaksi completed"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Total Revenue"
            value={`Rp ${stats.transactions.totalRevenue.toLocaleString(
              "id-ID"
            )}`}
            description="Total pendapatan"
            icon={TrendingUp}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* Recent Activity Section - Optional */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center py-8">
              Fitur aktivitas terbaru akan segera hadir
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
