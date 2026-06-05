import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { ProductDetailPage } from "@/components/products/ProductDetailPage";
import { getPublicProduct } from "@/lib/public-events";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProduct(id);

  if (!product) {
    return {
      title: "Produto não encontrado | Encontro das Brecholeiras",
    };
  }

  return {
    title: `${product.title} | Encontro das Brecholeiras`,
    description: product.description || `Produto anunciado por ${product.brand.name}.`,
  };
}

export default async function PublicProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getPublicProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <ProductDetailPage product={product} />
      <Footer />
    </>
  );
}
