import { EventsSection } from "@/components/home/EventsSection";
import { FeaturedBrecholeirasSection } from "@/components/home/FeaturedBrecholeirasSection";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { getPublicEvents, getPublicFeaturedBrands, getPublicProducts } from "@/lib/public-events";

export default async function Home() {
  const [events, featuredBrands, products] = await Promise.all([getPublicEvents(), getPublicFeaturedBrands(), getPublicProducts()]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <MissionSection />
        <EventsSection events={events.slice(0, 3)} />
        <FeaturedBrecholeirasSection brands={featuredBrands} />
        <ProductsSection products={products} />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
