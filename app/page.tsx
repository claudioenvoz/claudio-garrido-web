import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProgramSection from "@/components/ProgramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProgramSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}