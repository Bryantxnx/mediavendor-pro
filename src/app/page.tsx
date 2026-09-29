import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import PricelistCalculator from "@/components/PricelistCalculator";
import RentalGuide from "@/components/RentalGuide";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Clients />
        <Services />
        <Portfolio />
        <PricelistCalculator />
        <RentalGuide />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
