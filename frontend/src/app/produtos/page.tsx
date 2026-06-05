import type { Metadata } from "next";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { ProductsPage } from "@/components/products/ProductsPage";
import { getPublicProducts } from "@/lib/public-events";

export const metadata: Metadata = {
  title: "Produtos | Encontro das Brecholeiras",
  description: "Catálogo de produtos ativos cadastrados pelas brecholeiras do coletivo.",
};

export default async function PublicProductsPage() {
  const products = await getPublicProducts({ all: true });

  return (
    <>
      <Header />
      <ProductsPage products={products} />
      <Footer />
    </>
  );
}
