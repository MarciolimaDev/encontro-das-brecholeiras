import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";
import type { AdminCategoriesData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Categorias | Encontro das Brecholeiras",
  description: "Gestão administrativa das categorias de produtos.",
};

export default async function AdminCategoriesPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login?next=/admin/categorias");
  }

  const response = await fetch(`${backendUrl}/api/admin/categories/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login?next=/admin/categorias");
  }

  const data = (await response.json()) as AdminCategoriesData;

  return <AdminCategoriesManager data={data} />;
}
