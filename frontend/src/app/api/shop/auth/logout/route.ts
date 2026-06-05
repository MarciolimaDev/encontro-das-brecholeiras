import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.delete("shop_access_token");
  response.cookies.delete("shop_refresh_token");

  return response;
}
