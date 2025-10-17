"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Palette,
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
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-2 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4 animate-slideUp">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
          Konfirmasi Pendaftaran
        </h3>
        <p className="text-gray-600 text-center text-sm mb-4">
          Pastikan semua data yang Anda masukkan sudah benar. Apakah Anda yakin
          ingin mengirim pendaftaran?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Periksa Lagi
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2 bg-[#8C1007] text-white rounded-md hover:bg-[#6d0c05] transition-colors text-sm font-medium"
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
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setError("");
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setIsTransitioning(false);
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
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#8C1007] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-xl p-6 text-center animate-slideUp">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Terima kasih telah mendaftar sebagai Pengrajin. Tim kami akan segera
            memverifikasi data Anda.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-700">
            Anda akan menerima notifikasi melalui email dan dashboard setelah
            proses verifikasi selesai.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50 p-2 lg:p-0 overflow-hidden">
      <div className="w-full h-full lg:h-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white shadow-lg overflow-hidden">
        {/* Left Section: Image Poster */}
        <div className="relative hidden lg:block h-full">
          <Image
            src="/images/pengrajin-daftar.jpg"
            alt="Daftar Pengrajin"
            fill
            style={{ objectFit: "cover" }}
            className=""
            priority
          />
        </div>

        {/* Right Section: Registration Form */}
        <div className="flex flex-col p-4 sm:p-6 relative h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Daftar Sebagai Pengrajin
            </h1>
            <p className="text-gray-600 text-sm">
              Tampilkan karya Anda dan dapatkan pelanggan baru
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all text-sm ${
                        currentStep >= step
                          ? "bg-[#8C1007] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    <span
                      className={`mt-1 text-xs font-medium ${
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
                      className={`h-1 flex-1 mx-1 transition-all ${
                        currentStep > step ? "bg-[#8C1007]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card content */}
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md mb-4 flex items-center justify-between text-sm">
              <span>{error}</span>
              <button onClick={() => setError("")}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Loading Overlay */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#8C1007] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-600 font-medium">
                  Loading...
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
            className={`flex-grow ${
              isTransitioning ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {/* Step 1: Craft Types & Materials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Craft Types */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <Palette className="w-4 h-4 mr-1 text-[#8C1007]" />
                    Jenis Kerajinan{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CRAFT_CATEGORIES.map((craft) => (
                      <button
                        key={craft}
                        type="button"
                        onClick={() => handleCraftTypeToggle(craft)}
                        className={`px-3 py-2 rounded-md border text-xs font-medium transition-all ${
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
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Jenis Kerajinan Lainnya (jika tidak ada di daftar)
                    </label>
                    <input
                      type="text"
                      name="customCraftType"
                      value={formData.customCraftType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                      placeholder="Contoh: Anyaman Bambu, Keramik, dll"
                    />
                  </div>
                </div>

                {/* Materials */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Bahan yang Digunakan{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MATERIAL_TYPES.map((material) => (
                      <button
                        key={material.value}
                        type="button"
                        onClick={() => handleMaterialToggle(material.value)}
                        className={`px-3 py-2 rounded-md border text-xs font-medium transition-all ${
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
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Deskripsi Profil{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                    placeholder="Ceritakan tentang Anda, pengalaman, teknik yang dikuasai, dan keunikan karya Anda..."
                  />
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
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-[#8C1007]" />
                    Lokasi Workshop/Studio
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Alamat Lengkap
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                      placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi (Opsional)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Koordinat Lokasi
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-0.5">
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
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                          placeholder="-7.250445"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-0.5">
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
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                          placeholder="112.768845"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="w-full px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
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
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={currentStep === 1 ? () => router.back() : handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="w-3 h-3" />
                  {currentStep === 1 ? "Batal" : "Kembali"}
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className="px-5 py-2 bg-[#8C1007] text-white rounded-md hover:bg-[#6d0c05] transition-colors font-medium flex items-center gap-1 text-sm disabled:opacity-50"
                  >
                    Lanjutkan
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitConfirm}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#8C1007] text-white rounded-md hover:bg-[#6d0c05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengirim...
                      </span>
                    ) : (
                      "Kirim Pendaftaran"
                    )}
                  </button>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
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
          </form>
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
        html,
        body,
        #__next {
          height: 100%;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        /* Custom Scrollbar for the form section */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* Smaller width */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px; /* Slightly smaller radius */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #aaa; /* Darker for better visibility */
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }

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
            transform: translateY(15px); /* Smaller slide distance */
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
