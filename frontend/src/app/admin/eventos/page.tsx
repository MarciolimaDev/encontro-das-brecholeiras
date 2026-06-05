import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminEventsManager } from "@/components/admin/AdminEventsManager";
import type { AdminEventsData } from "@/components/admin/types";

export const metadata: Metadata = {
  title: "Gestão de Eventos | Encontro das Brecholeiras",
  description: "Gestão administrativa de eventos, feirinhas e festivais.",
};

export default async function AdminEventsPage() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl || !token) {
    redirect("/admin/login?next=/admin/eventos");
  }

  const response = await fetch(`${backendUrl}/api/admin/events/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/admin/login?next=/admin/eventos");
  }

  const data = (await response.json()) as AdminEventsData;

  return <AdminEventsManager data={data} />;
}
