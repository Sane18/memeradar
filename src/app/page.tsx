import { Navbar } from "@/components/Navbar";
import { TokenBanner } from "@/components/TokenBanner";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { WebMobileSection } from "@/components/landing/WebMobileSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-chad-bg">
      <Navbar />
      {/* rotating token banner — top */}
      <TokenBanner direction="left" />

      <Hero />
      <WebMobileSection />
      <FeatureGrid />
      <CtaSection />

      {/* rotating token banner — bottom */}
      <TokenBanner direction="right" />
      <Footer />
    </main>
  );
}
