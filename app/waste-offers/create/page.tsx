/* eslint-disable @next/next/no-img-element */
// app/waste-offers/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MaterialType,
  OfferType,
  MATERIAL_TYPE_LABELS,
  OFFER_TYPE_LABELS,
  MAX_IMAGES,
  OfferStats,
} from "@/types/waste-offer";

const LocationPicker = dynamic(
  () => import("@/app/waste-offers/components/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

export default function CreateWasteOfferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<OfferStats | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialType, setMaterialType] = useState<MaterialType>("PLASTIC");
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [offerType, setOfferType] = useState<OfferType>("SELL");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (
      session?.user.role !== "USER" &&
      session?.user.role !== "ADMIN"
    ) {
      router.push("/waste-offers");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/waste-offers/my-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);

        if (data.availableSlots === 0) {
          setError(
            "Anda sudah memiliki 3 penawaran aktif. Selesaikan atau batalkan penawaran lama terlebih dahulu."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      alert(`Maksimal ${MAX_IMAGES} gambar`);
      return;
    }

    setLoading(true); // Atau buat state uploadingImages

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const { url } = await response.json();
        uploadedUrls.push(url); // ✅ URL asli dari Vercel Blob
      } catch (error) {
        console.error("Upload error:", error);
        alert("Gagal upload gambar");
      }
    }

    setImages([...images, ...uploadedUrls]);
    setLoading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(addr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setError("Silakan pilih lokasi pada peta");
      return;
    }

    if (stats && stats.availableSlots === 0) {
      setError("Anda sudah mencapai batas maksimal penawaran aktif");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waste-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          materialType,
          weight: weight ? parseFloat(weight) : undefined,
          images,
          condition,
          address,
          latitude,
          longitude,
          offerType,
          suggestedPrice:
            suggestedPrice && offerType === "SELL"
              ? parseFloat(suggestedPrice)
              : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/waste-offers/manage");
      } else {
        setError(data.message || data.error || "Gagal membuat penawaran");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      setError("Terjadi kesalahan saat membuat penawaran");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C1007]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Buat Penawaran Sampah
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Tawarkan sampah Anda untuk dijual atau didonasikan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Alert */}
      {stats && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div
            className={`rounded-lg border p-4 ${
              stats.availableSlots === 0
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg
                className={`w-5 h-5 ${
                  stats.availableSlots === 0 ? "text-red-600" : "text-blue-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                className={`text-sm ${
                  stats.availableSlots === 0 ? "text-red-800" : "text-blue-800"
                }`}
              >
                Anda memiliki <strong>{stats.activeCount}/3</strong> penawaran
                aktif. Sisa slot: <strong>{stats.availableSlots}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Judul Penawaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Botol Plastik Bersih 20kg"
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi dan detail sampah Anda..."
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            />
          </div>

          {/* Material Type & Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Jenis Material <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={materialType}
                onChange={(e) =>
                  setMaterialType(e.target.value as MaterialType)
                }
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              >
                {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Berat (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Estimasi berat"
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Kondisi
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Contoh: Bersih, sudah dipilah, kering"
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
            />
          </div>

          {/* Offer Type & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tipe Penawaran <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={offerType}
                onChange={(e) => setOfferType(e.target.value as OfferType)}
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
              >
                {Object.entries(OFFER_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {offerType === "SELL" && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Harga yang Diharapkan (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(e.target.value)}
                  placeholder="Harga estimasi"
                  className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1007] focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Foto Sampah (Maksimal {MAX_IMAGES})
            </label>

            {images.length < MAX_IMAGES && (
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG (Maks. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Lokasi Pengambilan <span className="text-red-500">*</span>
            </label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {address && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{address}</p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !!(stats && stats.availableSlots === 0)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Buat Penawaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
