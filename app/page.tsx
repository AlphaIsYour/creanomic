import { Navbar } from "@/app/components/layout/Navbar";
import { HeroSection } from "@/app/components/home/HeroSection";
import { FeaturesSection } from "@/app/components/home/FeaturesSection";
import { StatsSection } from "@/app/components/home/StatsSection";
import { TestimonialsSection } from "@/app/components/home/TestimonialsSection";
import { CTASection } from "@/app/components/home/CTASection";
import { Footer } from "@/app/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E1D2] to-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
