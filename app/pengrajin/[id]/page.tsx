"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Star,
  Mail,
  Phone,
  Instagram,
  MessageCircle,
  Palette,
  Recycle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface PengrajinProfile {
  id: string;
  craftType: string[];
  materials: string[];
  portfolio: string[];
  priceRange?: string;
  description?: string;
  totalReviews: number;
  averageRating?: number;
  instagramHandle?: string;
  whatsappNumber?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer: {
      name: string;
      image?: string;
    };
  }>;
}

export default function PengrajinDashboard() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<PengrajinProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/pengrajin/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      toast.error("Gagal memuat profil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChat = () => {
    router.push(`/chat?userId=${profile?.user.id}`);
  };

  const handleWhatsApp = () => {
    if (!profile?.whatsappNumber) {
      toast.error("Nomor WhatsApp tidak tersedia");
      return;
    }
    const message = encodeURIComponent(
      `Halo ${profile.user.name}, saya tertarik dengan karya Anda dan ingin memesan produk.`
    );
    window.open(
      `https://wa.me/${profile.whatsappNumber.replace(
        /\D/g,
        ""
      )}?text=${message}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">Profil tidak ditemukan</p>
      </div>
    );
  }

  const materialColors: Record<string, string> = {
    PLASTIC: "bg-blue-100 text-blue-800",
    GLASS: "bg-purple-100 text-purple-800",
    METAL: "bg-gray-100 text-gray-800",
    PAPER: "bg-orange-100 text-orange-800",
    ELECTRONIC: "bg-red-100 text-red-800",
    ORGANIC: "bg-green-100 text-green-800",
    OTHER: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center relative overflow-hidden">
                {profile.user.image ? (
                  <Image
                    src={profile.user.image}
                    alt={profile.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Palette className="w-16 h-16 text-purple-600" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.user.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    {profile.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {profile.averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({profile.totalReviews} ulasan)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.craftType.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleChat}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat untuk Pesan
                  </Button>
                  {profile.whatsappNumber && (
                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {profile.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.user.phone}</span>
                  </div>
                )}
                {profile.user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{profile.user.email}</span>
                  </div>
                )}
                {profile.instagramHandle && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-gray-500" />
                    <a
                      href={`https://instagram.com/${profile.instagramHandle.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {profile.instagramHandle}
                    </a>
                  </div>
                )}
                {profile.priceRange && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>Range Harga: {profile.priceRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Gallery */}
          {profile.portfolio && profile.portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Karya</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Main Image */}
                <div className="relative mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative w-full h-96 cursor-pointer hover:opacity-90 transition rounded-lg overflow-hidden">
                        <Image
                          src={profile.portfolio[selectedImage]}
                          alt={`Portfolio ${selectedImage + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <div className="relative w-full h-[600px]">
                        <Image
                          src={profile.portfolio[selectedImage]}
                          alt={`Portfolio ${selectedImage + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Navigation Arrows */}
                  {profile.portfolio.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? profile.portfolio.length - 1 : prev - 1
                          )
                        }
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === profile.portfolio.length - 1 ? 0 : prev + 1
                          )
                        }
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {profile.portfolio.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition relative ${
                        selectedImage === idx
                          ? "border-purple-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {profile.description && (
            <Card>
              <CardHeader>
                <CardTitle>Tentang Pengrajin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Ulasan Pelanggan ({profile.totalReviews})</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.reviews && profile.reviews.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          {review.reviewer.image ? (
                            <Image
                              src={review.reviewer.image}
                              alt={review.reviewer.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold">
                              {review.reviewer.name[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {review.reviewer.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-700">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Belum ada ulasan
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Materials Used */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="w-5 h-5" />
                Material yang Digunakan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.materials.map((material) => (
                  <Badge
                    key={material}
                    className={materialColors[material] || "bg-gray-100"}
                  >
                    {material}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Portfolio</span>
                <span className="font-semibold">
                  {profile.portfolio?.length || 0} karya
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Ulasan</span>
                <span className="font-semibold">{profile.totalReviews}</span>
              </div>
              {profile.averageRating && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Rating Rata-rata
                  </span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {profile.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jenis Kerajinan</span>
                <span className="font-semibold">
                  {profile.craftType.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Palette className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                Tertarik dengan Karya Kami?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Hubungi kami sekarang untuk memesan produk kerajinan berkualitas
              </p>
              <Button
                onClick={handleChat}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mulai Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
