/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, TrendingUp, Briefcase, User, Shield } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileTabs from "./components/ProfileTabs";
import AboutTab from "./components/tabs/AboutTab";
import ProductsTab from "./components/tabs/ProductsTab";
import ReviewsTab from "./components/tabs/ReviewsTab";
import WasteOffersTab from "./components/tabs/WasteOffersTab";

interface UserProfile {
  user: any;
  stats: any;
  products: any[];
  wasteOffers: any[];
  reviews: any[];
  isOwnProfile: boolean;
}

type TabId = "about" | "waste-offers" | "products" | "reviews";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("about");

  useEffect(() => {
    fetchProfile();
  }, [params.username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/profile/${params.username}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        router.push("/404");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      PENGEPUL: {
        label: "Pengepul",
        color: "bg-emerald-500",
        icon: TrendingUp,
      },
      PENGRAJIN: {
        label: "Pengrajin",
        color: "bg-violet-500",
        icon: Briefcase,
      },
      USER: {
        label: "Pengguna",
        color: "bg-blue-500",
        icon: User,
      },
      ADMIN: {
        label: "Admin",
        color: "bg-rose-500",
        icon: Shield,
      },
    };
    return badges[role as keyof typeof badges] || badges.USER;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${profile?.user.name}`,
          text: `Lihat profil ${profile?.user.name} di Daurin`,
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link profil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#8C1007] mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const { user, stats, products, wasteOffers, reviews, isOwnProfile } = profile;
  const roleBadge = getRoleBadge(user.role);
  const profileData = user.pengepulProfile || user.pengrajinProfile;

  // Build tabs dynamically
  const tabs = [
    { id: "about", label: "Tentang" },
    ...(wasteOffers.length > 0
      ? [
          {
            id: "waste-offers",
            label: "Sampah Ditawarkan",
            count: wasteOffers.length,
          },
        ]
      : []),
    ...(user.role === "PENGRAJIN" && products.length > 0
      ? [{ id: "products", label: "Produk", count: products.length }]
      : []),
    ...(reviews.length > 0
      ? [{ id: "reviews", label: "Ulasan", count: reviews.length }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <ProfileHeader
        user={user}
        profileData={profileData}
        roleBadge={roleBadge}
        isOwnProfile={isOwnProfile}
        isAuthenticated={!!session}
        onShare={handleShare}
      />

      <ProfileStats stats={stats} joinDate={user.createdAt} />

      <ProfileTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
      />

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[calc(100%-80px)]">
        <div className="min-h-[200px]">
          {activeTab === "about" && (
            <AboutTab user={user} profileData={profileData} />
          )}
          {activeTab === "waste-offers" && (
            <WasteOffersTab wasteOffers={wasteOffers} />
          )}
          {activeTab === "products" && <ProductsTab products={products} />}
          {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
        </div>
      </div>
    </div>
  );
}
