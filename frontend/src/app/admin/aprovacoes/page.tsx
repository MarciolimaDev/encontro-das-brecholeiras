import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBrandsManager } from "@/components/admin/AdminBrandsManager";
import type { AdminBrandsData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Fila de Aprovação | Encontro das Brecholeiras",
  description: "Brechós pendentes de aprovação no painel administrativo.",
};

export default async function AdminApprovalsPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login?next=/admin/aprovacoes");
  }

  const response = await fetch(`${backendUrl}/api/admin/brands/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login?next=/admin/aprovacoes");
  }

  const data = (await response.json()) as AdminBrandsData;

  return <AdminBrandsManager approvalOnly data={data} />;
}
