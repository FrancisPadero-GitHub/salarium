import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Stats from "@/components/landing/stats";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
