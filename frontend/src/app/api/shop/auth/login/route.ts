import { NextResponse } from "next/server";

const accessCookie = "shop_access_token";
const refreshCookie = "shop_refresh_token";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    return NextResponse.json({ detail: "BACKEND_API_URL não configurada." }, { status: 500 });
  }

  const payload = await request.json();
  const response = await fetch(`${backendUrl}/api/auth/shop/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({ detail: "Resposta inválida do backend." }));

  if (!response.ok) {
    return NextResponse.json({ detail: data.detail ?? "Não foi possível autenticar." }, { status: response.status });
  }

  const result = NextResponse.json({ user: data.user, brand: data.brand });
  const secure = process.env.NODE_ENV === "production";

  result.cookies.set(accessCookie, data.access, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure,
  });
  result.cookies.set(refreshCookie, data.refresh, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return result;
}
