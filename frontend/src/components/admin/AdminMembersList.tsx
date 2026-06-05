"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ComponentProps } from "react";
import { AdminIcon } from "./AdminIcon";
import { navigation } from "./data";
import type { AdminMembersData } from "./types";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8Xhq3EKSpWZ60K3oa-hqQS_krY2C0XJou9YnjjSr79APKCU8xw70KzQE5WN2snqJ8XY83rX8y5EdkmlWB5pqMMJMbjsrrIq-4gjeGGErjU1oMjhDWdTgQQO1dQdT3mzGQtrtwTHHrlOc6UFctu08IEjcibYtxQEveTfNifGCCSPOJqKgIePLeyZ4A_L2-EZjGNFnp0L3Jyn8Jml5fUjTJQoVoBdP_9L-yWyVXDelOcmkUkEKxIXeeLE81DgX0CogmmjZ2-AHamTw";

const roleLabels: Record<string, string> = {
  super_admin: "Admin Principal",
  admin: "Admin",
  brecholeira: "Brecholeira",
};

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

export function AdminMembersList({ data }: { data: AdminMembersData }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const roleLabel = data.user.is_staff ? roleLabels[data.user.role] || "Admin" : roleLabels[data.user.role] || data.user.role;
  const moderationItems = [
    { label: "Fila de Aprovação", icon: "shield", href: "/admin/aprovacoes", badge: String(data.metrics.pending_approvals) },
    { label: "Garimpos Reportados", icon: "report", badge: "0", badgeTone: "green" },
  ] satisfies { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];
  const metrics = [
    { label: "Total de membros", value: formatNumber(data.metrics.total_members), icon: "members", tone: "pink" },
    { label: "Brecholeiras", value: formatNumber(data.metrics.brecholeiras), icon: "eco", tone: "green" },
    { label: "Administradores", value: formatNumber(data.metrics.admins), icon: "shield", tone: "pink" },
    { label: "Marcas ativas", value: formatNumber(data.metrics.active_brands), icon: "dashboard", tone: "green" },
  ] satisfies { label: string; value: string; icon: ComponentProps<typeof AdminIcon>["name"]; tone: "pink" | "green" }[];
  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.members;

    return data.members.filter((member) =>
      [member.name, member.email, member.role_label, member.profile.whatsapp, member.address.city, member.brand.name]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [data.members, search]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#fff8f8] text-[#25181b]">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-[#debec6] bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-[#debec6] px-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <AdminIcon name="eco" className="h-5 w-5" />
          </div>
          <h1 className="font-display text-lg font-extrabold tracking-tight">Brecholeiras</h1>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          <SidebarGroup title="Navegação principal" items={navigation.map((item) => ({ ...item, active: item.href === "/admin/membros" }))} />
          <SidebarGroup title="Moderação" items={moderationItems} />
        </nav>

        <div className="border-t border-[#debec6] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#fff0f2] p-3">
            <Image alt="Administradora" className="rounded-full border border-[#debec6] object-cover" height={40} src={avatar} width={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{userName}</p>
              <p className="truncate text-xs text-[#574147]">{roleLabel}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#debec6] bg-white px-4 md:px-8">
          <div className="flex flex-1 items-center gap-4">
            <button aria-label="Abrir menu" className="grid h-10 w-10 place-items-center rounded-full text-[#574147] lg:hidden">
              <AdminIcon name="menu" className="h-5 w-5" />
            </button>
            <div className="relative w-full max-w-md">
              <AdminIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b7077]" name="search" />
              <input
                className="h-10 w-full rounded-full border-0 bg-[#fff0f2] pl-10 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/30"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar membros por nome, e-mail, cidade ou marca..."
                type="search"
                value={search}
              />
            </div>
          </div>

          <button className="rounded-full border border-[#debec6] px-4 py-2 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={logout} type="button">
            Sair
          </button>
        </header>

        <div className="space-y-8 p-4 md:p-8">
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Membros</h2>
              <p className="mt-1 text-sm text-[#574147] md:text-base">Lista de contas ativas cadastradas na plataforma.</p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark">
              <AdminIcon name="add" className="h-4 w-4" />
              Novo membro
            </button>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article className="rounded-xl border border-[#debec6] bg-white p-6 shadow-[0_4px_20px_rgba(174,28,94,0.04)]" key={metric.label}>
                <div className={metric.tone === "pink" ? "mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary" : "mb-4 grid h-10 w-10 place-items-center rounded-lg bg-secondary/25 text-secondary-dark"}>
                  <AdminIcon className="h-5 w-5" name={metric.icon} />
                </div>
                <p className="text-sm font-semibold text-[#574147]">{metric.label}</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{metric.value}</h3>
              </article>
            ))}
          </section>

          <section className="overflow-hidden rounded-xl border border-[#debec6] bg-white">
            <div className="flex items-center justify-between border-b border-[#debec6] bg-[#fff0f2] px-6 py-4">
              <h3 className="font-display text-xl font-bold">Todos os membros</h3>
              <span className="text-sm font-semibold text-[#574147]">{filteredMembers.length} encontrados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white font-semibold text-[#574147]">
                  <tr>
                    <th className="px-6 py-4">Membro</th>
                    <th className="px-6 py-4">Perfil</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4">Cidade</th>
                    <th className="px-6 py-4">Marca</th>
                    <th className="px-6 py-4">Entrada</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#debec6]">
                  {filteredMembers.map((member) => (
                    <tr className="transition hover:bg-[#fff8f8]" key={member.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#25181b]">{member.name || "Sem nome"}</p>
                        <p className="text-xs font-semibold text-[#574147]">{member.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{member.role_label}</span>
                      </td>
                      <td className="px-6 py-4 text-[#574147]">{member.profile.whatsapp || "Não informado"}</td>
                      <td className="px-6 py-4 text-[#574147]">{member.address.city ? `${member.address.city}/${member.address.uf}` : "Não informado"}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#25181b]">{member.brand.name || "Sem marca"}</p>
                        <p className="text-xs text-[#574147]">{member.brand.segment || "Sem segmento"}</p>
                      </td>
                      <td className="px-6 py-4 text-[#574147]">{member.date_joined}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={member.is_active ? "rounded-full bg-[#00881f]/10 px-3 py-1 text-xs font-bold text-[#006b16]" : "rounded-full bg-[#ffdad6] px-3 py-1 text-xs font-bold text-[#ba1a1a]"}>
                          {member.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm font-semibold text-[#574147]" colSpan={7}>
                        Nenhum membro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SidebarGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];
}) {
  return (
    <div>
      <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8b7077]">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <a
            className={
              item.active
                ? "flex items-center gap-3 rounded-lg border-l-4 border-primary bg-[#ffe8ed] px-3 py-3 text-sm font-bold text-primary"
                : "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#574147] transition hover:bg-[#ffe8ed]"
            }
            href={item.href ?? "#"}
            key={item.label}
          >
            <AdminIcon className="h-5 w-5" name={item.icon} />
            {item.label}
            {item.badge && (
              <span className={item.badgeTone === "green" ? "ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white" : "ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white"}>{item.badge}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
