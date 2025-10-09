/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/pengepul/[userId]/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  latitude: number | null;
  longitude: number | null;
  companyName: string;
  licenseNumber: string;
  specializedMaterials: string[];
  operatingArea: string[];
  operatingRadius: number;
  description: string;
  website: string;
  workingHours: string;
  priceList: any;
  whatsappNumber: string;
  approvalStatus: string;
}

const materialOptions = [
  "PLASTIC",
  "GLASS",
  "METAL",
  "PAPER",
  "CARDBOARD",
  "ELECTRONIC",
  "TEXTILE",
  "WOOD",
  "RUBBER",
  "ORGANIC",
  "OTHER",
];

const materialLabels: { [key: string]: string } = {
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

export default function SettingsPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pengepul/settings/${userId}`);
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch(`/api/pengepul/settings/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setProfile(data.profile);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal memperbarui profil",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  const handleMaterialToggle = (material: string) => {
    if (!profile) return;

    const materials = profile.specializedMaterials.includes(material)
      ? profile.specializedMaterials.filter((m) => m !== material)
      : [...profile.specializedMaterials, material];

    setProfile({ ...profile, specializedMaterials: materials });
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return (
      <DashboardLayout userId={userId}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userId={userId}>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Profil tidak ditemukan</p>
          </div>
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
            Pengaturan Profil
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <XCircleIcon className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Approval Status Banner */}
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            profile.approvalStatus === "APPROVED"
              ? "bg-green-50 border border-green-200"
              : profile.approvalStatus === "REJECTED"
              ? "bg-red-50 border border-red-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          {profile.approvalStatus === "APPROVED" ? (
            <>
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">
                  Akun Terverifikasi
                </p>
                <p className="text-sm text-green-700">
                  Profil Anda telah disetujui oleh admin
                </p>
              </div>
            </>
          ) : profile.approvalStatus === "REJECTED" ? (
            <>
              <XCircleIcon className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Akun Ditolak</p>
                <p className="text-sm text-red-700">
                  Silakan hubungi admin untuk informasi lebih lanjut
                </p>
              </div>
            </>
          ) : (
            <>
              <ClockIcon className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">
                  Menunggu Persetujuan
                </p>
                <p className="text-sm text-yellow-700">
                  Profil Anda sedang ditinjau oleh admin
                </p>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "personal"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserCircleIcon className="w-5 h-5 inline mr-2" />
                Informasi Pribadi
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "business"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
                Informasi Usaha
              </button>
              <button
                onClick={() => setActiveTab("operational")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "operational"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ClockIcon className="w-5 h-5 inline mr-2" />
                Operasional
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={profile.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={profile.whatsappNumber || ""}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={profile.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={profile.latitude || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          parseFloat(e.target.value) || null
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="-6.2088"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={profile.longitude || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          parseFloat(e.target.value) || null
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="106.8456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Information Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={profile.companyName || ""}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="PT. Contoh Perusahaan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Lisensi
                    </label>
                    <input
                      type="text"
                      value={profile.licenseNumber || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nomor lisensi tidak dapat diubah
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="https://www.contoh.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius Operasi (km)
                    </label>
                    <input
                      type="number"
                      value={profile.operatingRadius || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "operatingRadius",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Usaha
                  </label>
                  <textarea
                    value={profile.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Deskripsikan usaha Anda..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Material yang Diterima
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {materialOptions.map((material) => (
                      <button
                        key={material}
                        type="button"
                        onClick={() => handleMaterialToggle(material)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          profile.specializedMaterials.includes(material)
                            ? "border-[#8C1007] bg-[#8C1007] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#8C1007]"
                        }`}
                      >
                        <span className="font-medium text-sm">
                          {materialLabels[material]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Operational Tab */}
            {activeTab === "operational" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={profile.workingHours || ""}
                    onChange={(e) =>
                      handleInputChange("workingHours", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Senin - Jumat: 08:00 - 17:00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contoh: Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 12:00
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Operasi
                  </label>
                  <textarea
                    value={profile.operatingArea.join(", ") || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "operatingArea",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Jakarta Selatan, Jakarta Timur, Depok"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pisahkan dengan koma untuk multiple area
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daftar Harga
                  </label>
                  <textarea
                    value={
                      typeof profile.priceList === "string"
                        ? profile.priceList
                        : JSON.stringify(profile.priceList || {}, null, 2)
                    }
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handleInputChange("priceList", parsed);
                      } catch {
                        handleInputChange("priceList", e.target.value);
                      }
                    }}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent font-mono text-sm"
                    placeholder='{"plastik": "Rp 3.000/kg", "kertas": "Rp 2.000/kg"}'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format JSON atau teks bebas untuk daftar harga material
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={fetchProfile}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0c05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
