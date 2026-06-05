import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShopAccountForm } from "@/components/shop/ShopAccountForm";
import type { ShopData } from "@/components/shop/types";

type ShopAccountPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Minha Conta | Encontro das Brecholeiras",
  description: "Dados da conta da brecholeira.",
};

export default async function ShopAccountPage({ params }: ShopAccountPageProps) {
  const { slug } = await params;
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("shop_access_token")?.value;

  if (!backendUrl || !token) {
    redirect(`/login?next=/dashboard/loja/${slug}/minha-conta`);
  }

  const response = await fetch(`${backendUrl}/api/auth/shop/me/?slug=${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect(`/login?next=/dashboard/loja/${slug}/minha-conta`);
  }

  const data = (await response.json()) as ShopData;

  return <ShopAccountForm data={data} />;
}
