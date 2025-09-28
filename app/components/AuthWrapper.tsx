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

interface AuthWrapperProps {
  children?: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E1D2] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-[#F4E1D2] rounded-md animate-pulse"></div>
          </div>
          <p className="text-[#2C2C2C] font-medium">Memuat...</p>
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
