import { EventsSection } from "@/components/home/EventsSection";
import { FeaturedBrecholeirasSection } from "@/components/home/FeaturedBrecholeirasSection";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductsSection } from "@/components/home/ProductsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <MissionSection />
        <EventsSection />
        <FeaturedBrecholeirasSection />
        <ProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
