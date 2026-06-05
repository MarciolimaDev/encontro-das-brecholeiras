"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/home/Icon";
import { isBackendMediaUrl } from "@/lib/images";
import type { ShopData } from "./types";

export function ShopShell({ active, children, data }: { active: "account" | "overview" | "products" | "settings"; children: ReactNode; data: ShopData }) {
  const router = useRouter();
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const items = [
    { id: "overview", label: "Overview", icon: "dashboard", href: `/dashboard/loja/${data.brand.slug}` },
    { id: "products", label: "Produtos", icon: "tag", href: `/dashboard/loja/${data.brand.slug}/produtos`, badge: String(data.brand.products_count) },
    { id: "settings", label: "Configurações", icon: "settings", href: `/dashboard/loja/${data.brand.slug}/configuracoes` },
  ] as const;
  const accountItems = [
    { id: "account", label: "Minha conta", icon: "user", href: `/dashboard/loja/${data.brand.slug}/minha-conta` },
  ] as const;

  const logout = async () => {
    await fetch("/api/shop/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#fff8f8] text-[#25181b]">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-[#debec6] bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-[#debec6] px-6">
          <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-primary/10 text-primary">
            {data.brand.logo ? (
              <Image alt="" className="object-cover" fill sizes="40px" src={data.brand.logo} unoptimized={isBackendMediaUrl(data.brand.logo)} />
            ) : (
              <Icon name="hanger" className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-extrabold tracking-tight">{data.brand.name}</h1>
            <p className="truncate text-xs font-semibold text-[#574147]">Painel da loja</p>
          </div>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          <div>
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8b7077]">Minha loja</p>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  className={
                    active === item.id
                      ? "flex items-center gap-3 rounded-lg border-l-4 border-primary bg-[#ffe8ed] px-3 py-3 text-sm font-bold text-primary"
                      : "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#574147] transition hover:bg-[#ffe8ed]"
                  }
                  href={item.href}
                  key={item.id}
                >
                  <ShopNavIcon name={item.icon} />
                  {item.label}
                  {"badge" in item && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8b7077]">Minha conta</p>
            <div className="space-y-2">
              {accountItems.map((item) => (
                <Link
                  className={
                    active === item.id
                      ? "flex items-center gap-3 rounded-lg border-l-4 border-primary bg-[#ffe8ed] px-3 py-3 text-sm font-bold text-primary"
                      : "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#574147] transition hover:bg-[#ffe8ed]"
                  }
                  href={item.href}
                  key={item.id}
                >
                  <ShopNavIcon name={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="border-t border-[#debec6] p-4">
          <div className="rounded-xl bg-[#fff0f2] p-3">
            <p className="truncate text-sm font-bold">{userName}</p>
            <p className="truncate text-xs text-[#574147]">{data.user.email}</p>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#debec6] bg-white px-4 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{data.brand.status_label}</p>
            <h2 className="font-display text-xl font-extrabold">{data.brand.name}</h2>
          </div>
          <button className="rounded-full border border-[#debec6] px-4 py-2 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={logout} type="button">
            Sair
          </button>
        </header>

        <div className="space-y-8 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

function ShopNavIcon({ name }: { name: "dashboard" | "settings" | "tag" | "user" }) {
  if (name === "tag") return <Icon name="tag" className="h-5 w-5" />;
  if (name === "user") return <Icon name="user" className="h-5 w-5" />;
  if (name === "settings") return <Icon name="sparkles" className="h-5 w-5" />;
  return <Icon name="public" className="h-5 w-5" />;
}
