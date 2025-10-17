"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Building2,
  Phone,
  Globe,
  Clock,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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

// Popup Konfirmasi Component
function ConfirmationModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4 animate-[scale-in_0.2s_ease-out]">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileCheck className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
          Konfirmasi Pendaftaran
        </h3>
        <p className="text-gray-600 text-center text-sm mb-4">
          Apakah Anda yakin semua data yang diisi sudah benar dan siap untuk
          diajukan?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cek Lagi
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

export default function PengepulRegistrationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    licenseNumber: "",
    specializedMaterials: [] as string[],
    operatingArea: "",
    description: "",
    website: "",
    workingHours: "",
    whatsappNumber: "",
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
    verificationDocs: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialToggle = (material: string) => {
    setFormData((prev) => ({
      ...prev,
      specializedMaterials: prev.specializedMaterials.includes(material)
        ? prev.specializedMaterials.filter((m) => m !== material)
        : [...prev.specializedMaterials, material],
    }));
  };

  const validateStep = (step: number): boolean => {
    setError("");

    if (step === 1) {
      if (!formData.companyName) {
        setError("Nama perusahaan wajib diisi");
        return false;
      }
    } else if (step === 2) {
      if (!formData.whatsappNumber) {
        setError("Nomor WhatsApp wajib diisi");
        return false;
      }
      if (!formData.address) {
        setError("Alamat lengkap wajib diisi");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
        setIsTransitioning(false);
      }, 300); // Reduced transition time for a snappier feel
    }
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setIsTransitioning(false);
    }, 300); // Reduced transition time
  };

  const handleSubmitConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setError("");
    setIsSubmitting(true);

    try {
      if (
        !formData.companyName ||
        !formData.whatsappNumber ||
        !formData.address
      ) {
        throw new Error("Mohon lengkapi semua field yang wajib diisi");
      }

      const operatingAreaArray = formData.operatingArea
        .split(",")
        .map((area) => area.trim())
        .filter((area) => area.length > 0);

      const response = await fetch("/api/register/pengepul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          operatingArea: operatingAreaArray,
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
    } finally {
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
        <div className="max-w-sm w-full bg-white rounded-lg shadow-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Terima kasih telah mendaftar sebagai Pengepul. Tim kami akan segera
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
      <div className="max-w-full w-full h-full lg:h-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white shadow-lg overflow-hidden">
        {/* Left Section: Image Poster */}
        <div className="relative hidden lg:block h-full">
          <Image
            src="/images/pengepul-daftar.jpg"
            alt="Daftar Pengepul"
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
              Daftar Sebagai Pengepul
            </h1>
            <p className="text-gray-600 text-sm">
              Lengkapi data di bawah untuk bergabung sebagai mitra pengepul
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        currentStep >= step
                          ? "bg-[#8C1007] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium text-gray-600">
                      {step === 1 && "Perusahaan"}
                      {step === 2 && "Kontak & Lokasi"}
                      {step === 3 && "Detail"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-1 rounded ${
                        currentStep > step ? "bg-[#8C1007]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md mb-4 text-sm">
              {error}
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
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Building2 className="w-4 h-4 mr-1 text-[#8C1007]" />
                  Informasi Perusahaan
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Nama Perusahaan{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                    placeholder="PT. Pengepul Sejahtera"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Nomor Izin Usaha
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                    placeholder="NIB/SIUP/TDP (Opsional)"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nomor izin akan membantu proses verifikasi lebih cepat
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Deskripsi Perusahaan
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                    placeholder="Ceritakan tentang perusahaan Anda, pengalaman, dan layanan yang ditawarkan..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact & Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-[#8C1007]" />
                    Informasi Kontak
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Nomor WhatsApp{" "}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                      placeholder="08123456789 atau +628123456789"
                    />
                    <p className="text-xs text-gray-500 mt-0.5">
                      Nomor ini akan digunakan user untuk menghubungi Anda
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                        placeholder="https://contoh.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Jam Operasional
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                        placeholder="Senin-Jumat: 08:00-17:00, Sabtu: 08:00-12:00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-[#8C1007]" />
                    Lokasi & Area Operasi
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Alamat Lengkap{" "}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                      placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
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
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
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
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Klik pada peta atau gunakan GPS untuk mendapatkan
                      koordinat yang akurat
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      Pilih di Peta
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Area Operasional
                    </label>
                    <input
                      type="text"
                      name="operatingArea"
                      value={formData.operatingArea}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#8C1007] focus:border-transparent text-sm"
                      placeholder="Surabaya Timur, Surabaya Utara, Sidoarjo"
                    />
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pisahkan dengan koma untuk beberapa area
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Materials & Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Jenis Sampah yang Dikumpulkan
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MATERIAL_TYPES.map((material) => (
                      <button
                        key={material.value}
                        type="button"
                        onClick={() => handleMaterialToggle(material.value)}
                        className={`px-3 py-2 rounded-md border text-xs font-medium transition-all ${
                          formData.specializedMaterials.includes(material.value)
                            ? "border-[#8C1007] bg-[#8C1007] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#8C1007]"
                        }`}
                      >
                        {material.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <FileUpload
                    label="Dokumen Verifikasi"
                    description="Upload KTP, Izin Usaha, atau dokumen pendukung lainnya (Max 5 file)"
                    maxFiles={5}
                    onFilesChange={(urls) =>
                      setFormData((prev) => ({
                        ...prev,
                        verificationDocs: urls,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={
                    currentStep === 1 ? () => router.back() : handlePrevious
                  }
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {currentStep === 1 ? "Batal" : "Kembali"}
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1 px-5 py-2 bg-[#8C1007] text-white rounded-md hover:bg-[#6d0c05] transition-colors font-medium text-sm"
                  >
                    Lanjutkan
                    <ArrowRight className="w-3 h-3" />
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
                      "Daftar Sekarang"
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
      {showMapModal && (
        <MapPicker
          initialLat={formData.latitude || -7.250445}
          initialLng={formData.longitude || 112.768845}
          onConfirm={(lat, lng) => {
            setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
            setShowMapModal(false);
          }}
          onCancel={() => setShowMapModal(false)}
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

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
