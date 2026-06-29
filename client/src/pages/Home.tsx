/**
 * Home — Direct2YourDoc
 * Design: Quiet Luxury Clinic — Cormorant Garamond + DM Sans
 * Palette: Warm Linen / Forest Green / Aged Bronze / Charcoal
 */
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import ServicesSection from "@/components/ServicesSection";
import ValueSection from "@/components/ValueSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FounderSection from "@/components/FounderSection";
import MembershipSection from "@/components/MembershipSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <ValueSection />
      <HowItWorksSection />
      <FounderSection />
      <MembershipSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
