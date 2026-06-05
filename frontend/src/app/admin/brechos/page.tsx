import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBrandsManager } from "@/components/admin/AdminBrandsManager";
import type { AdminBrandsData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Brechôs | Encontro das Brecholeiras",
  description: "Gestão administrativa dos brechós cadastrados.",
};

export default async function AdminBrandsPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login?next=/admin/brechos");
  }

  const response = await fetch(`${backendUrl}/api/admin/brands/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login?next=/admin/brechos");
  }

  const data = (await response.json()) as AdminBrandsData;

  return <AdminBrandsManager data={data} />;
}
