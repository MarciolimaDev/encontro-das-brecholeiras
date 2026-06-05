import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShopProductsManager } from "@/components/shop/ShopProductsManager";
import type { ShopData, ShopProduct, ShopProductCategory } from "@/components/shop/types";

type ShopProductsPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Produtos da Loja | Encontro das Brecholeiras",
  description: "Cadastro e gestão de produtos do brechó.",
};

export default async function ShopProductsPage({ params }: ShopProductsPageProps) {
  const { slug } = await params;
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("shop_access_token")?.value;

  if (!backendUrl || !token) {
    redirect(`/login?next=/dashboard/loja/${slug}/produtos`);
  }

  const response = await fetch(`${backendUrl}/api/shop/${slug}/products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect(`/login?next=/dashboard/loja/${slug}/produtos`);
  }

  const data = (await response.json()) as { shop: ShopData; categories: ShopProductCategory[]; products: ShopProduct[] };

  return <ShopProductsManager categories={data.categories} data={data.shop} products={data.products} />;
}
