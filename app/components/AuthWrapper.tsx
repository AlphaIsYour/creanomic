/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { HeroSection } from "./home/HeroSection";
import { MapsSection } from "./home/MapsSection";
import { UserSection } from "./home/UserSection";
import { TestimonialsSection } from "./home/TestimonialsSection";
import { AboutSection } from "./home/AboutSection";
import { DashboardLayout } from "@/app/components/dashboard/DashboardLayout";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
  children?: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#8C1007] mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika user sudah login, tampilkan dashboard
  if (session) {
    return <DashboardLayout />;
  }

  // Jika user belum login, tampilkan landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E1D2] to-white">
      <Navbar />
      <main>
        <HeroSection />
        <MapsSection />
        <UserSection />
        <TestimonialsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
