import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import WhyChooseUsSection from "./components/landing/WhyChooseUsSection";
import ScreensSection from "./components/landing/ScreensSection";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="landing-page" style={{ minHeight: '100vh', backgroundColor: 'var(--lp-bg)' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <ScreensSection />
      <CTASection />
      <Footer />
    </main>
  );
}
