import type { Metadata } from "next";
import { BrecholeirasPage } from "@/components/brecholeiras/BrecholeirasPage";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { getPublicBrecholeiras } from "@/lib/public-events";

export const metadata: Metadata = {
  title: "Brecholeiras | Encontro das Brecholeiras",
  description: "Conheça as curadoras e brechós ativos do coletivo Encontro das Brecholeiras.",
};

export default async function PublicBrecholeirasPage() {
  const brands = await getPublicBrecholeiras();

  return (
    <>
      <Header />
      <BrecholeirasPage brands={brands} />
      <Footer />
    </>
  );
}
