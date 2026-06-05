import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL não configurada." }, { status: 500 });
  }

  const token = (await cookies()).get("admin_access_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Não autenticado." }, { status: 401 });
  }

  const response = await fetch(`${backendUrl}/api/auth/admin/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ detail: "Resposta inválida do backend." }));

  return NextResponse.json(data, { status: response.status });
}
