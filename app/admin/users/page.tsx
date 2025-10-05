/* eslint-disable react-hooks/exhaustive-deps */
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Users,
  Hammer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  pengepulProfile?: {
    id: string;
    companyName: string | null;
    approvalStatus: string;
  };
  pengrajinProfile?: {
    id: string;
    craftTypes: string[];
    approvalStatus: string;
  };
  _count: {
    wasteOffers: number;
    transactions: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "TOGGLE_ACTIVE",
          data: { isActive: !currentStatus },
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        `User berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Gagal mengubah status user");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyEmail = async (userId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "VERIFY_EMAIL",
          data: {},
        }),
      });

      if (!res.ok) throw new Error("Failed to verify email");

      toast.success("Email berhasil diverifikasi");
      fetchUsers();
    } catch (error) {
      toast.error("Gagal memverifikasi email");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User berhasil dihapus");
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus user");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      ADMIN: { color: "bg-red-100 text-red-800", icon: Shield },
      USER: { color: "bg-blue-100 text-blue-800", icon: User },
      PENGEPUL: { color: "bg-green-100 text-green-800", icon: Users },
      PENGRAJIN: { color: "bg-purple-100 text-purple-800", icon: Hammer },
    };
    const variant = variants[role] || variants.USER;
    const Icon = variant.icon;
    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
        <p className="text-gray-600 mt-1">
          Manajemen semua user di platform Creanomic
        </p>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Cari nama, email, atau telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Role</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="PENGEPUL">Pengepul</SelectItem>
                <SelectItem value="PENGRAJIN">Pengrajin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna ({pagination.total})</CardTitle>
          <CardDescription>
            Halaman {pagination.page} dari {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007] mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada data pengguna
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#8C1007] text-white font-semibold">
                                {user.name?.[0] || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name || "-"}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            className={
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                          {!user.isVerified && (
                            <Badge className="bg-yellow-100 text-yellow-800 block">
                              Belum Verifikasi
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            Sampah:{" "}
                            <span className="font-medium">
                              {user._count.wasteOffers}
                            </span>
                          </p>
                          <p>
                            Transaksi:{" "}
                            <span className="font-medium">
                              {user._count.transactions}
                            </span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleActive(user.id, user.isActive)
                              }
                              disabled={actionLoading}
                            >
                              {user.isActive ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aktifkan
                                </>
                              )}
                            </DropdownMenuItem>
                            {!user.isVerified && (
                              <DropdownMenuItem
                                onClick={() => handleVerifyEmail(user.id)}
                                disabled={actionLoading}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verifikasi Email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                dari {pagination.total} pengguna
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang pengguna
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nama:</strong> {selectedUser.name || "-"}
                </div>
                <div>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div>
                  <strong>Telepon:</strong> {selectedUser.phone || "-"}
                </div>
                <div>
                  <strong>Role:</strong> {selectedUser.role}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {selectedUser.isActive ? "Aktif" : "Nonaktif"}
                </div>
                <div>
                  <strong>Verifikasi:</strong>{" "}
                  {selectedUser.isVerified ? "Sudah" : "Belum"}
                </div>
              </div>

              {selectedUser.pengepulProfile && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Profil Pengepul</h3>
                  <p className="text-sm">
                    <strong>Perusahaan:</strong>{" "}
                    {selectedUser.pengepulProfile.companyName || "-"}
                  </p>
                  <p className="text-sm">
                    <strong>Status Approval:</strong>{" "}
                    {selectedUser.pengepulProfile.approvalStatus}
                  </p>
                </div>
              )}

              {selectedUser.pengrajinProfile && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Profil Pengrajin</h3>
                  <p className="text-sm">
                    <strong>Jenis Kerajinan:</strong>{" "}
                    {selectedUser.pengrajinProfile.craftTypes.join(", ")}
                  </p>
                  <p className="text-sm">
                    <strong>Status Approval:</strong>{" "}
                    {selectedUser.pengrajinProfile.approvalStatus}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Statistik Aktivitas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Total Penawaran Sampah:</strong>{" "}
                    {selectedUser._count.wasteOffers}
                  </p>
                  <p>
                    <strong>Total Transaksi:</strong>{" "}
                    {selectedUser._count.transactions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{selectedUser?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan dan akan menghapus semua data terkait.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={actionLoading}
            >
              {actionLoading ? "Menghapus..." : "Hapus User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
