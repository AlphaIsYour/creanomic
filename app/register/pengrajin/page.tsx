"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Palette,
  DollarSign,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
} from "lucide-react";
import { FileUpload } from "@/app/components/FileUpload";
import { MapPicker } from "@/app/components/MapPicker";

const MATERIAL_TYPES = [
  { value: "PLASTIC", label: "Plastik" },
  { value: "GLASS", label: "Kaca" },
  { value: "METAL", label: "Logam" },
  { value: "PAPER", label: "Kertas" },
  { value: "ELECTRONIC", label: "Elektronik" },
  { value: "ORGANIC", label: "Organik" },
  { value: "OTHER", label: "Lainnya" },
];

const CRAFT_CATEGORIES = [
  "Kerajinan Tangan",
  "Furniture",
  "Dekorasi Rumah",
  "Aksesoris Fashion",
  "Tas & Dompet",
  "Perhiasan",
  "Mainan Edukatif",
  "Seni & Lukisan",
  "Lampu Hias",
  "Lainnya",
];

// Confirmation Modal Component
function ConfirmationModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Konfirmasi Pendaftaran
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Pastikan semua data yang Anda masukkan sudah benar. Apakah Anda yakin
          ingin mengirim pendaftaran?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Periksa Lagi
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0c05] transition-colors font-medium"
          >
            Ya, Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PengrajinRegistrationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [formData, setFormData] = useState({
    craftType: [] as string[],
    materials: [] as string[],
    portfolio: [] as string[],
    priceRange: "",
    description: "",
    address: "",
    latitude: -7.250445 as number | null,
    longitude: 112.768845 as number | null,
    verificationDocs: [] as string[],
    customCraftType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCraftTypeToggle = (craft: string) => {
    setFormData((prev) => ({
      ...prev,
      craftType: prev.craftType.includes(craft)
        ? prev.craftType.filter((c) => c !== craft)
        : [...prev.craftType, craft],
    }));
  };

  const handleMaterialToggle = (material: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }));
  };

  const handleMapConfirm = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setShowMapPicker(false);
  };

  const validateStep = (step: number): boolean => {
    setError("");

    if (step === 1) {
      const finalCraftTypes = [...formData.craftType];
      if (
        formData.customCraftType &&
        !finalCraftTypes.includes(formData.customCraftType)
      ) {
        finalCraftTypes.push(formData.customCraftType);
      }

      if (finalCraftTypes.length === 0) {
        setError("Pilih minimal satu jenis kerajinan");
        return false;
      }

      if (formData.materials.length === 0) {
        setError("Pilih minimal satu jenis bahan");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.description.trim()) {
        setError("Deskripsi profil wajib diisi");
        return false;
      }
      if (!formData.priceRange) {
        setError("Kisaran harga wajib dipilih");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setError("");
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleSubmitConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setError("");
    setIsSubmitting(true);

    try {
      const finalCraftTypes = [...formData.craftType];
      if (
        formData.customCraftType &&
        !finalCraftTypes.includes(formData.customCraftType)
      ) {
        finalCraftTypes.push(formData.customCraftType);
      }

      const response = await fetch("/api/register/pengrajin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          craftType: finalCraftTypes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#8C1007] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar sebagai Pengrajin. Tim kami akan segera
            memverifikasi data Anda.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            Anda akan menerima notifikasi melalui email dan dashboard setelah
            proses verifikasi selesai.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Sebagai Pengrajin
          </h1>
          <p className="text-gray-600">
            Tampilkan karya Anda dan dapatkan pelanggan baru
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? "bg-[#8C1007] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step ? "text-[#8C1007]" : "text-gray-400"
                    }`}
                  >
                    {step === 1 && "Kerajinan"}
                    {step === 2 && "Profil"}
                    {step === 3 && "Dokumen"}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step ? "bg-[#8C1007]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`bg-white rounded-2xl shadow-lg p-8 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 1: Craft Types & Materials */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Craft Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-[#8C1007]" />
                  Jenis Kerajinan <span className="text-red-500 ml-1">*</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CRAFT_CATEGORIES.map((craft) => (
                    <button
                      key={craft}
                      type="button"
                      onClick={() => handleCraftTypeToggle(craft)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.craftType.includes(craft)
                          ? "border-[#8C1007] bg-[#8C1007] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#8C1007]"
                      }`}
                    >
                      {craft}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kerajinan Lainnya (jika tidak ada di daftar)
                  </label>
                  <input
                    type="text"
                    name="customCraftType"
                    value={formData.customCraftType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Contoh: Anyaman Bambu, Keramik, dll"
                  />
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bahan yang Digunakan <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MATERIAL_TYPES.map((material) => (
                    <button
                      key={material.value}
                      type="button"
                      onClick={() => handleMaterialToggle(material.value)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.materials.includes(material.value)
                          ? "border-[#8C1007] bg-[#8C1007] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#8C1007]"
                      }`}
                    >
                      {material.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile & Description */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Profil <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  placeholder="Ceritakan tentang Anda, pengalaman, teknik yang dikuasai, dan keunikan karya Anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kisaran Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                  >
                    <option value="">Pilih Kisaran Harga</option>
                    <option value="< Rp 100.000">{"< Rp 100.000"}</option>
                    <option value="Rp 100.000 - Rp 500.000">
                      Rp 100.000 - Rp 500.000
                    </option>
                    <option value="Rp 500.000 - Rp 1.000.000">
                      Rp 500.000 - Rp 1.000.000
                    </option>
                    <option value="Rp 1.000.000 - Rp 5.000.000">
                      Rp 1.000.000 - Rp 5.000.000
                    </option>
                    <option value="> Rp 5.000.000">{"> Rp 5.000.000"}</option>
                    <option value="Bervariasi">Bervariasi</option>
                  </select>
                </div>
              </div>

              <FileUpload
                label="Portfolio Karya"
                description="Upload foto-foto karya terbaik Anda (Max 10 gambar)"
                maxFiles={10}
                accept="image/*"
                onFilesChange={(urls) =>
                  setFormData((prev) => ({ ...prev, portfolio: urls }))
                }
              />
            </div>
          )}

          {/* Step 3: Location & Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#8C1007]" />
                  Lokasi Workshop/Studio
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                    placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi (Opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koordinat Lokasi
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.latitude || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            latitude: parseFloat(e.target.value) || null,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                        placeholder="-7.250445"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            longitude: parseFloat(e.target.value) || null,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                        placeholder="112.768845"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Pilih Lokasi di Peta
                  </button>
                </div>
              </div>

              <FileUpload
                label="Dokumen Verifikasi"
                description="Upload KTP, foto workshop, sertifikat (jika ada), atau dokumen pendukung lainnya"
                maxFiles={5}
                onFilesChange={(urls) =>
                  setFormData((prev) => ({ ...prev, verificationDocs: urls }))
                }
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t mt-8">
            <button
              type="button"
              onClick={currentStep === 1 ? () => router.back() : handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={isTransitioning}
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? "Batal" : "Kembali"}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isTransitioning}
                className="px-8 py-3 bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0c05] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                Lanjutkan
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitConfirm}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#8C1007] text-white rounded-lg hover:bg-[#6d0c05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Pendaftaran"
                )}
              </button>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Dengan mendaftar, Anda menyetujui{" "}
            <a href="/terms" className="text-[#8C1007] hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            serta{" "}
            <a href="/privacy" className="text-[#8C1007] hover:underline">
              Kebijakan Privasi
            </a>{" "}
            kami
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          onConfirm={handleFinalSubmit}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Map Picker Modal */}
      {showMapPicker && (
        <MapPicker
          initialLat={formData.latitude || -7.250445}
          initialLng={formData.longitude || 112.768845}
          onConfirm={handleMapConfirm}
          onCancel={() => setShowMapPicker(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
