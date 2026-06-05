import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminMembersList } from "@/components/admin/AdminMembersList";
import type { AdminMembersData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Membros | Encontro das Brecholeiras",
  description: "Listagem de membros da Associação Encontro das Brecholeiras.",
};

export default async function AdminMembersPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login?next=/admin/membros");
  }

  const response = await fetch(`${backendUrl}/api/admin/members/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login?next=/admin/membros");
  }

  const data = (await response.json()) as AdminMembersData;

  return <AdminMembersList data={data} />;
}
