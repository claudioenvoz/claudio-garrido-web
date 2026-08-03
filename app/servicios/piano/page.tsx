import Hero from "./components/Hero";
import ForWho from "./components/ForWho";
import WhyItWorks from "./components/WhyItWorks";
import Learn from "./components/Learn";
import Methodology from "./components/Methodology";
import Plans from "./components/Plans";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";

export default function CantoPage() {
  return (
    <main className="w-full">
      <Hero />
      <ForWho />
      <WhyItWorks />
      <Learn />
      <Methodology />
      <Plans />
      <FAQ />
      <CTA />
    </main>
  );
}
