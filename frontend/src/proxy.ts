import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginRoute = pathname === "/admin/login";
  const isShopDashboardRoute = pathname.startsWith("/dashboard/loja/");
  const hasAdminToken = Boolean(request.cookies.get("admin_access_token")?.value);
  const hasShopToken = Boolean(request.cookies.get("shop_access_token")?.value);

  if (isAdminRoute && !isLoginRoute && !hasAdminToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isShopDashboardRoute && !hasShopToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/loja/:path*"],
};
