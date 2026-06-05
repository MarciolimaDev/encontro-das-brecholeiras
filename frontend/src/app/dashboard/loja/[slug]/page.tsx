import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShopDashboard } from "@/components/shop/ShopDashboard";
import type { ShopData } from "@/components/shop/types";

type ShopDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Painel da Loja | Encontro das Brecholeiras",
  description: "Painel administrativo da loja da brecholeira.",
};

export default async function ShopDashboardPage({ params }: ShopDashboardPageProps) {
  const { slug } = await params;
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("shop_access_token")?.value;

  if (!backendUrl || !token) {
    redirect(`/login?next=/dashboard/loja/${slug}`);
  }

  const response = await fetch(`${backendUrl}/api/auth/shop/me/?slug=${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect(`/login?next=/dashboard/loja/${slug}`);
  }

  const data = (await response.json()) as ShopData;

  return <ShopDashboard data={data} />;
}
