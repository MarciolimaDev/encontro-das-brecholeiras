import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShopSettingsForm } from "@/components/shop/ShopSettingsForm";
import type { ShopData } from "@/components/shop/types";

type ShopSettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Configurações da Loja | Encontro das Brecholeiras",
  description: "Configurações do brechó.",
};

export default async function ShopSettingsPage({ params }: ShopSettingsPageProps) {
  const { slug } = await params;
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("shop_access_token")?.value;

  if (!backendUrl || !token) {
    redirect(`/login?next=/dashboard/loja/${slug}/configuracoes`);
  }

  const response = await fetch(`${backendUrl}/api/auth/shop/me/?slug=${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect(`/login?next=/dashboard/loja/${slug}/configuracoes`);
  }

  const data = (await response.json()) as ShopData;

  return <ShopSettingsForm data={data} />;
}
