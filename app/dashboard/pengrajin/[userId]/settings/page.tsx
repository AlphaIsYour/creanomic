/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/dashboard/pengrajin/[userId]/components/DashboardLayout";
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface UserData {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  bio: string | null;
  image: string | null;
}

interface PengrajinData {
  craftTypes: string[];
  specializedMaterials: string[];
  portfolio: string[];
  yearsOfExperience: number | null;
  description: string | null;
  instagramHandle: string | null;
  whatsappNumber: string | null;
  workshopAddress: string | null;
  workshopLatitude: number | null;
  workshopLongitude: number | null;
}

export default function SettingsPage({
  params,
}: {
  params: { userId: string };
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    image: null,
  });
  const [pengrajinData, setPengrajinData] = useState<PengrajinData>({
    craftTypes: [],
    specializedMaterials: [],
    portfolio: [],
    yearsOfExperience: null,
    description: "",
    instagramHandle: "",
    whatsappNumber: "",
    workshopAddress: "",
    workshopLatitude: null,
    workshopLongitude: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/pengrajin/settings/${params.userId}`);
      const data = await res.json();
      setUserData(data.user);
      setPengrajinData(data.pengrajinProfile);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await fetch(`/api/pengrajin/settings/${params.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData }),
      });
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBusiness = async () => {
    setSaving(true);
    try {
      await fetch(`/api/pengrajin/settings/${params.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengrajinProfile: pengrajinData }),
      });
      alert("Informasi bisnis berhasil diperbarui!");
    } catch (error) {
      console.error("Error saving business:", error);
      alert("Gagal menyimpan informasi bisnis");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/pengrajin/settings/${params.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordData }),
      });
      if (res.ok) {
        alert("Password berhasil diubah!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert("Password lama salah!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userId={params.userId}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userId={params.userId}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">
            Kelola profil dan preferensi akun Anda
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <UserCircleIcon className="w-5 h-5 inline mr-2" />
                Profil
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "business"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <BuildingStorefrontIcon className="w-5 h-5 inline mr-2" />
                Informasi Bisnis
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "password"
                    ? "border-[#8C1007] text-[#8C1007]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <KeyIcon className="w-5 h-5 inline mr-2" />
                Keamanan
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <div className="flex items-center gap-4">
                    {userData.image ? (
                      <Image
                        src={userData.image}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Ubah Foto
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      value={userData.phone || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <input
                      type="text"
                      value={userData.address || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={userData.bio || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#6D0C05] transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}

            {/* Business Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kerajinan
                    </label>
                    <input
                      type="text"
                      value={pengrajinData.craftTypes.join(", ")}
                      onChange={(e) =>
                        setPengrajinData({
                          ...pengrajinData,
                          craftTypes: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="Anyaman, Tas, Dekorasi (pisah dengan koma)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pengalaman (Tahun)
                    </label>
                    <input
                      type="number"
                      value={pengrajinData.yearsOfExperience || ""}
                      onChange={(e) =>
                        setPengrajinData({
                          ...pengrajinData,
                          yearsOfExperience: parseInt(e.target.value) || null,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={pengrajinData.whatsappNumber || ""}
                      onChange={(e) =>
                        setPengrajinData({
                          ...pengrajinData,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="08123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={pengrajinData.instagramHandle || ""}
                      onChange={(e) =>
                        setPengrajinData({
                          ...pengrajinData,
                          instagramHandle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Workshop
                  </label>
                  <textarea
                    value={pengrajinData.workshopAddress || ""}
                    onChange={(e) =>
                      setPengrajinData({
                        ...pengrajinData,
                        workshopAddress: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Bisnis
                  </label>
                  <textarea
                    value={pengrajinData.description || ""}
                    onChange={(e) =>
                      setPengrajinData({
                        ...pengrajinData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Ceritakan tentang bisnis kerajinan Anda..."
                  />
                </div>

                <button
                  onClick={handleSaveBusiness}
                  disabled={saving}
                  className="px-6 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#6D0C05] transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="px-6 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#6D0C05] transition-colors disabled:opacity-50"
                >
                  {saving ? "Mengubah..." : "Ubah Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
