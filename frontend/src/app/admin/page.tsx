import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { AdminDashboardData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Painel Administrativo | Encontro das Brecholeiras",
  description: "Dashboard administrativo da Associação Encontro das Brecholeiras.",
};

export default async function AdminPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login");
  }

  const response = await fetch(`${backendUrl}/api/admin/dashboard/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login");
  }

  const data = (await response.json()) as AdminDashboardData;

  return <AdminDashboard data={data} />;
}
