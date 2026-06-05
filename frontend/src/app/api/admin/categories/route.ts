import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getBackendContext() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("admin_access_token")?.value;

  if (!backendUrl) {
    return { error: NextResponse.json({ detail: "BACKEND_API_URL não configurada." }, { status: 500 }) };
  }
  if (!token) {
    return { error: NextResponse.json({ detail: "Não autenticado." }, { status: 401 }) };
  }

  return { backendUrl, token };
}

export async function GET() {
  const context = await getBackendContext();
  if (context.error) return context.error;

  const response = await fetch(`${context.backendUrl}/api/admin/categories/`, {
    headers: {
      Authorization: `Bearer ${context.token}`,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ detail: "Resposta inválida do backend." }));

  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const context = await getBackendContext();
  if (context.error) return context.error;

  const body = await request.json();
  const response = await fetch(`${context.backendUrl}/api/admin/categories/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ detail: "Resposta inválida do backend." }));

  return NextResponse.json(data, { status: response.status });
}
