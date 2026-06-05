"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type ReactNode } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { AdminIcon } from "./AdminIcon";
import { flaggedItems, navigation } from "./data";
import type { AdminDashboardData } from "./types";

type PendingApproval = AdminDashboardData["pending_approvals"][number];

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8Xhq3EKSpWZ60K3oa-hqQS_krY2C0XJou9YnjjSr79APKCU8xw70KzQE5WN2snqJ8XY83rX8y5EdkmlWB5pqMMJMbjsrrIq-4gjeGGErjU1oMjhDWdTgQQO1dQdT3mzGQtrtwTHHrlOc6UFctu08IEjcibYtxQEveTfNifGCCSPOJqKgIePLeyZ4A_L2-EZjGNFnp0L3Jyn8Jml5fUjTJQoVoBdP_9L-yWyVXDelOcmkUkEKxIXeeLE81DgX0CogmmjZ2-AHamTw";

const toneClasses = {
  pink: "bg-primary/10 text-primary",
  green: "bg-secondary/25 text-secondary-dark",
  emerald: "bg-[#00881f]/10 text-[#006b16]",
};

const roleLabels: Record<string, string> = {
  super_admin: "Admin Principal",
  admin: "Admin",
  brecholeira: "Brecholeira",
};

const fallbackEventImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrW9iRft_HVcwsVfL-IWKAZdBxoGqqzWXMvhMnbnbcQd76swjvJiTnES37vgHvgmU7Z7oaReQuHVwWbFD1JDZs6Q1rjXR1QO6IBm8b6-QCpHqgeomKcASkKvwj2qbdoCnzGEI_5Q_Y-aKx6cP-j3ftagoSAlIK5kvCdNQiIMzfkgEGw8RB4ea9t3ncEVwBo21JTY1RfGWnolQAUIJXztbvqAlzlNzJVczU9Cpj82mD7KGnxo3XorCx7SewkLoa3Orz4Jy1tINtVAml";

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const roleLabel = data.user.is_staff ? roleLabels[data.user.role] || "Admin" : roleLabels[data.user.role] || data.user.role;
  const metrics = [
    { label: "Total de Membros", value: formatNumber(data.metrics.total_members), icon: "personAdd", tone: "pink", detail: "Ativos" },
    { label: "Eventos Ativos", value: formatNumber(data.metrics.active_events), icon: "calendar", tone: "green", detail: "Publicados" },
    { label: "Têxtil Salvo", value: `${formatNumber(data.metrics.textile_saved_kg)}kg`, icon: "eco", tone: "emerald", detail: "Estimado" },
    { label: "Novos Cadastros", value: formatNumber(data.metrics.new_registrations), icon: "members", tone: "pink", detail: "Pendentes" },
  ] satisfies {
    label: string;
    value: string;
    icon: ComponentProps<typeof AdminIcon>["name"];
    tone: keyof typeof toneClasses;
    detail: string;
  }[];
  const moderationItems = [
    { label: "Fila de Aprovação", icon: "shield", href: "/admin/aprovacoes", badge: String(data.metrics.new_registrations) },
    { label: "Garimpos Reportados", icon: "report", badge: "0", badgeTone: "green" },
  ] satisfies { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const updateApprovalStatus = async (approval: PendingApproval, action: "approve" | "reject") => {
    setActionLoading(action);

    try {
      const response = await fetch(`/api/admin/member-applications/${approval.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        return;
      }

      setSelectedApproval(null);
      router.refresh();
    } finally {
      setActionLoading(null);
    }
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
          <SidebarGroup title="Navegação principal" items={navigation.map((item) => ({ ...item, active: item.href === "/admin" }))} />
          <SidebarGroup title="Moderação" items={moderationItems} />

          <div>
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8b7077]">Configurações</p>
            <a className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#574147] transition hover:bg-[#ffe8ed]" href="#">
              <AdminIcon name="settings" className="h-5 w-5" />
              Configuração do Sistema
            </a>
          </div>
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
                placeholder="Buscar membros, eventos ou relatórios..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button aria-label="Notificações" className="relative grid h-10 w-10 place-items-center rounded-full text-[#574147] transition hover:bg-[#fff0f2]">
              <AdminIcon name="bell" className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>
            <button aria-label="Ajuda" className="hidden h-10 w-10 place-items-center rounded-full text-[#574147] transition hover:bg-[#fff0f2] sm:grid">
              <AdminIcon name="help" className="h-5 w-5" />
            </button>
            <button className="rounded-full border border-[#debec6] px-4 py-2 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={logout} type="button">
              Sair
            </button>
          </div>
        </header>

        <div className="space-y-8 p-4 md:p-8">
          <section>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Painel Administrativo</h2>
            <p className="mt-1 text-sm text-[#574147] md:text-base">Bem-vindo(a), {data.user.first_name || userName}. Veja o movimento da comunidade de moda circular hoje.</p>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article className="rounded-xl border border-[#debec6] bg-white p-6 shadow-[0_4px_20px_rgba(174,28,94,0.04)] transition hover:-translate-y-0.5" key={metric.label}>
                <div className="mb-4 flex items-start justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-lg ${toneClasses[metric.tone]}`}>
                    <AdminIcon className="h-5 w-5" name={metric.icon} />
                  </div>
                  <span className={metric.tone === "pink" ? "text-sm font-bold text-[#006b16]" : "text-sm font-semibold text-[#574147]"}>{metric.detail}</span>
                </div>
                <p className="text-sm font-semibold text-[#574147]">{metric.label}</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{metric.value}</h3>
              </article>
            ))}
          </section>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <section className="space-y-4 xl:col-span-2">
              <SectionHeading action="Ver tudo" title="Aprovações Pendentes" />
              <div className="overflow-hidden rounded-xl border border-[#debec6] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-[#fff0f2] font-semibold text-[#574147]">
                      <tr>
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Marca</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#debec6]">
                      {data.pending_approvals.map((approval) => (
                        <tr className="transition hover:bg-[#fff0f2]/60" key={approval.id}>
                          <td className="px-6 py-4 font-semibold">{approval.name}</td>
                          <td className="px-6 py-4 text-[#574147]">{approval.brand}</td>
                          <td className="px-6 py-4 text-[#574147]">{approval.date}</td>
                          <td className="space-x-2 px-6 py-4 text-right">
                            <button
                              className="rounded-lg bg-[#F2B544]/15 px-3 py-1.5 text-xs font-bold text-[#9A5A00] transition hover:bg-[#F2B544]/25"
                              onClick={() => setSelectedApproval(approval)}
                              type="button"
                            >
                              Revisar
                            </button>
                            <button className="rounded-lg bg-[#00881f]/10 px-3 py-1.5 text-xs font-bold text-[#006b16] transition hover:bg-[#00881f]/20" onClick={() => updateApprovalStatus(approval, "approve")} type="button">
                              Aprovar
                            </button>
                            <button className="rounded-lg bg-[#ffdad6]/40 px-3 py-1.5 text-xs font-bold text-[#ba1a1a] transition hover:bg-[#ffdad6]" onClick={() => updateApprovalStatus(approval, "reject")} type="button">
                              Rejeitar
                            </button>
                          </td>
                        </tr>
                      ))}
                      {data.pending_approvals.length === 0 && (
                        <tr>
                          <td className="px-6 py-8 text-center text-sm font-semibold text-[#574147]" colSpan={4}>
                            Nenhuma aprovação pendente no momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeading action="Laboratório" actionTone="green" title="Itens Sinalizados" />
              <div className="space-y-4">
                {flaggedItems.map((item) => (
                  <article className="flex gap-4 rounded-xl border border-[#debec6] bg-[#f5dde1]/30 p-4" key={item.title}>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ffdad6]/60 text-[#ba1a1a]">
                      <AdminIcon name="warning" className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-[#574147]">{item.text}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.actions.map((action) => (
                          <button className="rounded-md border border-[#debec6] bg-white px-3 py-1 text-[11px] font-bold transition hover:border-primary hover:text-primary" key={action}>
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="space-y-4 pb-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-xl font-bold">Próximos Eventos da Comunidade</h3>
              <button
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark"
                onClick={() => router.push("/admin/eventos?novo=1")}
                type="button"
              >
                <AdminIcon name="add" className="h-4 w-4" />
                Criar Novo Evento
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.events.map((event) => (
                <article className="group overflow-hidden rounded-xl border border-[#debec6] bg-white" key={event.id}>
                  <div className="relative h-36 bg-[#ffe8ed]">
                    <Image
                      alt=""
                      className="object-cover opacity-85"
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      src={event.image || fallbackEventImage}
                      unoptimized={isBackendMediaUrl(event.image || fallbackEventImage)}
                    />
                    <span className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-extrabold text-primary backdrop-blur">{event.date}</span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-display font-bold transition group-hover:text-primary">{event.title}</h4>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#574147]">
                      <AdminIcon name="location" className="h-3.5 w-3.5" />
                      {event.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#debec6] pt-4">
                      <div className="flex -space-x-2">
                        <span className="h-6 w-6 rounded-full border-2 border-white bg-[#f5dde1]" />
                        <span className="h-6 w-6 rounded-full border-2 border-white bg-[#debec6]" />
                        <span className="h-6 w-6 rounded-full border-2 border-white bg-[#cef064]" />
                        <span className="grid h-6 w-8 place-items-center rounded-full border-2 border-white bg-[#fff0f2] text-[8px] font-bold">+{event.attendees}</span>
                      </div>
                      <button
                        className="rounded-lg bg-[#F2B544]/15 px-3 py-1.5 text-xs font-bold text-[#9A5A00] transition hover:bg-[#F2B544]/25"
                        onClick={() => router.push(`/admin/eventos?evento=${event.id}`)}
                        type="button"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {data.events.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#debec6] bg-white p-8 text-center text-sm font-semibold text-[#574147] md:col-span-2 xl:col-span-3">
                  Nenhum evento publicado encontrado.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedApproval && (
        <ApprovalReviewModal
          actionLoading={actionLoading}
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onUpdateStatus={updateApprovalStatus}
        />
      )}
    </div>
  );
}

function ApprovalReviewModal({
  actionLoading,
  approval,
  onClose,
  onUpdateStatus,
}: {
  actionLoading: "approve" | "reject" | null;
  approval: PendingApproval;
  onClose: () => void;
  onUpdateStatus: (approval: PendingApproval, action: "approve" | "reject") => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#25181b]/40 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#debec6] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#debec6] bg-[#fff8f8] px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Revisão de cadastro</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#25181b]">{approval.name}</h2>
            <p className="text-sm font-semibold text-[#574147]">{approval.brand} • enviado em {approval.date}</p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#debec6] text-lg font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ReviewCard title="Cliente">
              <Detail label="Nome" value={approval.name} />
              <Detail label="E-mail" value={approval.customer.email} />
              <Detail label="CPF" value={approval.customer.cpf} />
              <Detail label="WhatsApp" value={approval.customer.whatsapp} />
              <Detail label="Nascimento" value={approval.customer.birth_date} />
              <Detail label="Gênero" value={approval.customer.gender} />
            </ReviewCard>

            <ReviewCard title="Endereço">
              <Detail label="CEP" value={approval.address.cep} />
              <Detail label="Rua" value={`${approval.address.street}, ${approval.address.number}`} />
              <Detail label="Bairro" value={approval.address.neighborhood} />
              <Detail label="Cidade/UF" value={`${approval.address.city}/${approval.address.uf}`} />
              <Detail label="Complemento" value={approval.address.complement} />
            </ReviewCard>

            <ReviewCard title="Marca">
              <Detail label="Nome" value={approval.brand_details.name} />
              <Detail label="Instagram" value={approval.brand_details.instagram ? `@${approval.brand_details.instagram}` : ""} />
              <Detail label="Segmento" value={approval.brand_details.segment} />
              <Detail label="Status" value={approval.brand_details.status} />
              <Detail label="Descrição" value={approval.brand_details.description} multiline />
            </ReviewCard>

            <ReviewCard title="Inscrição">
              <Detail label="Atividades de interesse" value={approval.application.activities_interest} multiline />
              <Detail label="Experiência" value={approval.application.experience} multiline />
              <Detail label="Estrutura para expor" value={approval.application.exposition_structure} multiline />
              <Detail label="Feira anterior" value={approval.application.previous_fair} />
              <Detail label="Como conheceu" value={approval.application.how_did_you_know} />
              <Detail label="Ciência da regra" value={approval.application.prohibition_acknowledgement ? "Sim" : "Não"} />
              <Detail label="Consentimento de dados" value={approval.application.data_consent ? "Sim" : "Não"} />
              <Detail label="Comunicações" value={approval.application.communication_consent ? "Sim" : "Não"} />
            </ReviewCard>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#debec6] bg-[#fff8f8] px-6 py-5 sm:flex-row sm:justify-end">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            Fechar
          </button>
          <button
            className="rounded-full bg-[#ffdad6] px-5 py-2.5 text-sm font-bold text-[#ba1a1a] transition hover:bg-[#ffc7c0] disabled:opacity-60"
            disabled={Boolean(actionLoading)}
            onClick={() => onUpdateStatus(approval, "reject")}
            type="button"
          >
            {actionLoading === "reject" ? "Rejeitando..." : "Rejeitar cadastro"}
          </button>
          <button
            className="rounded-full bg-[#00881f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#006b16] disabled:opacity-60"
            disabled={Boolean(actionLoading)}
            onClick={() => onUpdateStatus(approval, "approve")}
            type="button"
          >
            {actionLoading === "approve" ? "Aprovando..." : "Aprovar cadastro"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-[#debec6] bg-[#fff8f8] p-5">
      <h3 className="mb-4 font-display text-lg font-extrabold text-[#25181b]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Detail({ label, multiline = false, value }: { label: string; multiline?: boolean; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#8b7077]">{label}</p>
      <p className={multiline ? "mt-1 whitespace-pre-line text-sm leading-6 text-[#25181b]" : "mt-1 text-sm font-semibold text-[#25181b]"}>
        {value || "Não informado"}
      </p>
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
              <span className={item.badgeTone === "green" ? "ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white" : "ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white"}>
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ title, action, actionTone = "pink" }: { title: string; action: string; actionTone?: "pink" | "green" }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <button className={actionTone === "green" ? "text-sm font-bold text-secondary-dark hover:underline" : "text-sm font-bold text-primary hover:underline"}>{action}</button>
    </div>
  );
}
