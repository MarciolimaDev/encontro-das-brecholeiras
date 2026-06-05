import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getBackendContext() {
  const backendUrl = process.env.BACKEND_API_URL;
  const token = (await cookies()).get("shop_access_token")?.value;

  if (!backendUrl) {
    return { error: NextResponse.json({ detail: "BACKEND_API_URL não configurada." }, { status: 500 }) };
  }
  if (!token) {
    return { error: NextResponse.json({ detail: "Não autenticado." }, { status: 401 }) };
  }

  return { backendUrl, token };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const context = await getBackendContext();
  if (context.error) return context.error;

  const { slug } = await params;
  const formData = await request.formData();
  const response = await fetch(`${context.backendUrl}/api/shop/${slug}/settings/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${context.token}`,
    },
    body: formData,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ detail: "Resposta inválida do backend." }));

  return NextResponse.json(data, { status: response.status });
}
