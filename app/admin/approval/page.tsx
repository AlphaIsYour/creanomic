"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  createdAt: string;
}

interface PengepulProfile {
  id: string;
  userId: string;
  companyName?: string;
  licenseNumber?: string;
  specializedMaterials: string[];
  operatingArea: string[];
  description?: string;
  website?: string;
  workingHours?: string;
  whatsappNumber?: string;
  verificationDocs: string[];
  approvalStatus: string;
  rejectionReason?: string;
  submittedAt: string;
  user: User;
  approvedBy?: { name: string; email: string };
}

interface PengrajinProfile {
  id: string;
  userId: string;
  craftType: string[];
  materials: string[];
  portfolio: string[];
  priceRange?: string;
  description?: string;
  instagramHandle?: string;
  whatsappNumber?: string;
  verificationDocs: string[];
  approvalStatus: string;
  rejectionReason?: string;
  submittedAt: string;
  user: User;
  approvedBy?: { name: string; email: string };
}

type ProfileType = PengepulProfile | PengrajinProfile;

export default function ApprovalPage() {
  const [pengepulProfiles, setPengepulProfiles] = useState<PengepulProfile[]>(
    []
  );
  const [pengrajinProfiles, setPengrajinProfiles] = useState<
    PengrajinProfile[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/approval?status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to fetch profiles");
      const data = await res.json();
      setPengepulProfiles(data.pengepul || []);
      setPengrajinProfiles(data.pengrajin || []);
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleApproval = async (
    profileId: string,
    type: string,
    action: string
  ) => {
    if (
      (action === "REJECTED" || action === "REVISION_NEEDED") &&
      !rejectionReason
    ) {
      toast.error("Harap masukkan alasan penolakan");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          type,
          action,
          rejectionReason: action !== "APPROVED" ? rejectionReason : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to process approval");

      toast.success(
        `Pendaftaran berhasil ${
          action === "APPROVED"
            ? "disetujui"
            : action === "REJECTED"
            ? "ditolak"
            : "diminta revisi"
        }`
      );
      setRejectionReason("");
      fetchProfiles();
    } catch (error) {
      toast.error("Gagal memproses approval");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, { color: string; icon: typeof Clock }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
      REVISION_NEEDED: {
        color: "bg-orange-100 text-orange-800",
        icon: FileText,
      },
    };
    const variant = variants[status] || variants.PENDING;
    const Icon = variant.icon;
    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const ProfileCard = ({
    profile,
    type,
  }: {
    profile: ProfileType;
    type: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{profile.user.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" />
              {profile.user.email}
            </CardDescription>
          </div>
          <StatusBadge status={profile.approvalStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {type === "pengepul" && "companyName" in profile ? (
            <>
              <p>
                <strong>Perusahaan:</strong> {profile.companyName || "-"}
              </p>
              <p>
                <strong>Nomor Lisensi:</strong> {profile.licenseNumber || "-"}
              </p>
              <p>
                <strong>Material:</strong>{" "}
                {profile.specializedMaterials.join(", ")}
              </p>
              <p>
                <strong>Area Operasi:</strong>{" "}
                {profile.operatingArea.join(", ")}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <strong>WhatsApp:</strong> {profile.whatsappNumber || "-"}
              </p>
            </>
          ) : "craftType" in profile ? (
            <>
              <p>
                <strong>Jenis Kerajinan:</strong> {profile.craftType.join(", ")}
              </p>
              <p>
                <strong>Material:</strong> {profile.materials.join(", ")}
              </p>
              <p>
                <strong>Range Harga:</strong> {profile.priceRange || "-"}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <strong>WhatsApp:</strong> {profile.whatsappNumber || "-"}
              </p>
            </>
          ) : null}
          <p>
            <strong>Tanggal Daftar:</strong>{" "}
            {new Date(profile.submittedAt).toLocaleDateString("id-ID")}
          </p>
          {profile.rejectionReason && (
            <Alert className="mt-2">
              <AlertDescription className="text-xs">
                <strong>Alasan:</strong> {profile.rejectionReason}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detail Pendaftaran{" "}
                {type === "pengepul" ? "Pengepul" : "Pengrajin"}
              </DialogTitle>
              <DialogDescription>
                Review dan proses pendaftaran ini
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h3 className="font-semibold mb-3">Informasi Pengguna</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Nama:</strong> {profile.user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {profile.user.email}
                  </div>
                  <div>
                    <strong>Telepon:</strong> {profile.user.phone || "-"}
                  </div>
                  <div>
                    <strong>Alamat:</strong> {profile.user.address || "-"}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div>
                <h3 className="font-semibold mb-3">Informasi Profil</h3>
                <div className="space-y-2 text-sm">
                  {type === "pengepul" && "companyName" in profile ? (
                    <>
                      <p>
                        <strong>Nama Perusahaan:</strong>{" "}
                        {profile.companyName || "-"}
                      </p>
                      <p>
                        <strong>Nomor Lisensi:</strong>{" "}
                        {profile.licenseNumber || "-"}
                      </p>
                      <p>
                        <strong>Material Spesialisasi:</strong>{" "}
                        {profile.specializedMaterials.join(", ")}
                      </p>
                      <p>
                        <strong>Area Operasi:</strong>{" "}
                        {profile.operatingArea.join(", ")}
                      </p>
                      <p>
                        <strong>Jam Kerja:</strong>{" "}
                        {profile.workingHours || "-"}
                      </p>
                      <p>
                        <strong>Website:</strong> {profile.website || "-"}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong>{" "}
                        {profile.whatsappNumber || "-"}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {profile.description || "-"}
                      </p>
                    </>
                  ) : "craftType" in profile ? (
                    <>
                      <p>
                        <strong>Jenis Kerajinan:</strong>{" "}
                        {profile.craftType.join(", ")}
                      </p>
                      <p>
                        <strong>Material yang Digunakan:</strong>{" "}
                        {profile.materials.join(", ")}
                      </p>
                      <p>
                        <strong>Range Harga:</strong>{" "}
                        {profile.priceRange || "-"}
                      </p>
                      <p>
                        <strong>Instagram:</strong>{" "}
                        {profile.instagramHandle || "-"}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong>{" "}
                        {profile.whatsappNumber || "-"}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {profile.description || "-"}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Verification Docs */}
              <div>
                <h3 className="font-semibold mb-3">Dokumen Verifikasi</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.verificationDocs.map((doc: string, idx: number) => (
                    <a
                      key={idx}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      <Image
                        src={doc}
                        alt={`Document ${idx + 1}`}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2 text-xs text-center bg-gray-50">
                        Dokumen {idx + 1}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Portfolio for Pengrajin */}
              {type === "pengrajin" &&
                "portfolio" in profile &&
                profile.portfolio &&
                profile.portfolio.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Portfolio</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {profile.portfolio.map((img: string, idx: number) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg overflow-hidden hover:shadow-md transition"
                        >
                          <Image
                            src={img}
                            alt={`Portfolio ${idx + 1}`}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              {profile.approvalStatus === "PENDING" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Catatan / Alasan (untuk penolakan atau revisi)
                    </label>
                    <Textarea
                      placeholder="Masukkan alasan jika menolak atau meminta revisi..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleApproval(profile.id, type, "APPROVED")
                      }
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Setujui
                    </Button>
                    <Button
                      onClick={() =>
                        handleApproval(profile.id, type, "REVISION_NEEDED")
                      }
                      disabled={actionLoading || !rejectionReason}
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Minta Revisi
                    </Button>
                    <Button
                      onClick={() =>
                        handleApproval(profile.id, type, "REJECTED")
                      }
                      disabled={actionLoading || !rejectionReason}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Approval Pendaftaran</h1>
        <p className="text-gray-600">
          Kelola pendaftaran pengepul dan pengrajin
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {["PENDING", "APPROVED", "REJECTED", "REVISION_NEEDED"].map(
          (status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status}
            </Button>
          )
        )}
      </div>

      <Tabs defaultValue="pengepul" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pengepul">
            Pengepul ({pengepulProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="pengrajin">
            Pengrajin ({pengrajinProfiles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pengepul" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : pengepulProfiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada data pengepul dengan status {statusFilter}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pengepulProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  type="pengepul"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pengrajin" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : pengrajinProfiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada data pengrajin dengan status {statusFilter}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pengrajinProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  type="pengrajin"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
