"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { AdminIcon } from "./AdminIcon";
import { navigation } from "./data";
import type { AdminBrand, AdminBrandsData } from "./types";

const roleLabels: Record<string, string> = {
  super_admin: "Admin Principal",
  admin: "Admin",
  brecholeira: "Brecholeira",
};

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-[#00881f]/10 text-[#006b16]",
  INACTIVE: "bg-[#ffdad6] text-[#ba1a1a]",
  PENDING: "bg-[#F2B544]/15 text-[#9A5A00]",
  REJECTED: "bg-[#ffdad6] text-[#ba1a1a]",
};

export function AdminBrandsManager({ approvalOnly = false, data }: { approvalOnly?: boolean; data: AdminBrandsData }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [reviewBrand, setReviewBrand] = useState<AdminBrand | null>(null);
  const [loadingBrandId, setLoadingBrandId] = useState<number | null>(null);
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const roleLabel = data.user.is_staff ? roleLabels[data.user.role] || "Admin" : roleLabels[data.user.role] || data.user.role;
  const moderationItems = [
    { label: "Fila de Aprovação", icon: "shield", href: "/admin/aprovacoes", active: approvalOnly, badge: String(data.metrics.pending) },
    { label: "Garimpos Reportados", icon: "report", badge: "0", badgeTone: "green" },
  ] satisfies { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];
  const metrics = [
    { label: "Total de brechôs", value: formatNumber(data.metrics.total_brands), icon: "eco", tone: "pink" },
    { label: "Ativos", value: formatNumber(data.metrics.active), icon: "dashboard", tone: "green" },
    { label: "Inativos", value: formatNumber(data.metrics.inactive), icon: "warning", tone: "pink" },
    { label: "Pendentes", value: formatNumber(data.metrics.pending), icon: "shield", tone: "green" },
  ] satisfies { label: string; value: string; icon: ComponentProps<typeof AdminIcon>["name"]; tone: "pink" | "green" }[];

  const filteredBrands = useMemo(() => {
    const brands = approvalOnly ? data.brands.filter((brand) => brand.status === "PENDING") : data.brands;
    const query = search.trim().toLowerCase();
    if (!query) return brands;

    return brands.filter((brand) =>
      [brand.name, brand.instagram, brand.description, brand.status_label, brand.segment.name, brand.owner.name, brand.owner.email]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [approvalOnly, data.brands, search]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const updateBrandStatus = async (brand: AdminBrand, action: "activate" | "deactivate" | "approve" | "reject") => {
    setLoadingBrandId(brand.id);

    try {
      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setReviewBrand(null);
        router.refresh();
      }
    } finally {
      setLoadingBrandId(null);
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
          <SidebarGroup title="Navegação principal" items={navigation.map((item) => ({ ...item, active: !approvalOnly && item.href === "/admin/brechos" }))} />
          <SidebarGroup title="Moderação" items={moderationItems} />
        </nav>

        <div className="border-t border-[#debec6] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#fff0f2] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              {userName.slice(0, 1).toUpperCase()}
            </div>
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
                placeholder="Buscar brechôs por nome, segmento ou responsável..."
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
          <section>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">{approvalOnly ? "Fila de Aprovação" : "Brechôs"}</h2>
            <p className="mt-1 text-sm text-[#574147] md:text-base">
              {approvalOnly ? "Analise apenas brechós pendentes de aprovação." : "Gerencie brechós cadastrados, segmentos e status de disponibilidade."}
            </p>
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
              <h3 className="font-display text-xl font-bold">{approvalOnly ? "Brechós pendentes" : "Brechôs cadastrados"}</h3>
              <span className="text-sm font-semibold text-[#574147]">{filteredBrands.length} encontrados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="bg-white font-semibold text-[#574147]">
                  <tr>
                    <th className="px-6 py-4">Brechó</th>
                    <th className="px-6 py-4">Responsável</th>
                    <th className="px-6 py-4">Segmento</th>
                    <th className="px-6 py-4">Instagram</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#debec6]">
                  {filteredBrands.map((brand) => (
                    <tr className="transition hover:bg-[#fff8f8]" key={brand.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#25181b]">{brand.name}</p>
                        <p className="line-clamp-1 max-w-md text-xs font-semibold text-[#574147]">{brand.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#25181b]">{brand.owner.name}</p>
                        <p className="text-xs text-[#574147]">{brand.owner.email}</p>
                      </td>
                      <td className="px-6 py-4 text-[#574147]">{brand.segment.name}</td>
                      <td className="px-6 py-4 text-[#574147]">{brand.instagram ? `@${brand.instagram}` : "Não informado"}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[brand.status] ?? statusClasses.PENDING}`}>
                          {brand.status_label}
                        </span>
                      </td>
                      <td className="space-x-2 px-6 py-4 text-right">
                        <button
                          className="rounded-lg bg-[#F2B544]/15 px-3 py-1.5 text-xs font-bold text-[#9A5A00] transition hover:bg-[#F2B544]/25"
                          onClick={() => setReviewBrand(brand)}
                          type="button"
                        >
                          Visualizar
                        </button>
                        <button
                          className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                          onClick={() => setSelectedBrand(brand)}
                          type="button"
                        >
                          Editar
                        </button>
                        {brand.status === "ACTIVE" ? (
                          <button
                            className="rounded-lg bg-[#ffdad6]/40 px-3 py-1.5 text-xs font-bold text-[#ba1a1a] transition hover:bg-[#ffdad6] disabled:opacity-60"
                            disabled={loadingBrandId === brand.id}
                            onClick={() => updateBrandStatus(brand, "deactivate")}
                            type="button"
                          >
                            {loadingBrandId === brand.id ? "Desativando..." : "Desativar"}
                          </button>
                        ) : (
                          <button
                            className="rounded-lg bg-[#00881f]/10 px-3 py-1.5 text-xs font-bold text-[#006b16] transition hover:bg-[#00881f]/20 disabled:opacity-60"
                            disabled={loadingBrandId === brand.id}
                            onClick={() => updateBrandStatus(brand, "activate")}
                            type="button"
                          >
                            {loadingBrandId === brand.id ? "Ativando..." : "Ativar"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredBrands.length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm font-semibold text-[#574147]" colSpan={6}>
                        Nenhum brechó encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {selectedBrand && (
        <BrandEditModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
          onSaved={() => {
            setSelectedBrand(null);
            router.refresh();
          }}
          segments={data.segments}
        />
      )}

      {reviewBrand && (
        <BrandReviewModal
          brand={reviewBrand}
          loadingBrandId={loadingBrandId}
          onClose={() => setReviewBrand(null)}
          onUpdateStatus={updateBrandStatus}
        />
      )}
    </div>
  );
}

function BrandReviewModal({
  brand,
  loadingBrandId,
  onClose,
  onUpdateStatus,
}: {
  brand: AdminBrand;
  loadingBrandId: number | null;
  onClose: () => void;
  onUpdateStatus: (brand: AdminBrand, action: "activate" | "deactivate" | "approve" | "reject") => Promise<void>;
}) {
  const isLoading = loadingBrandId === brand.id;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#25181b]/40 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#debec6] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#debec6] bg-[#fff8f8] px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Análise de brechó</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#25181b]">{brand.name}</h2>
            <p className="text-sm font-semibold text-[#574147]">{brand.segment.name} • {brand.status_label}</p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#debec6] text-lg font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ReviewCard title="Brechó">
              <Detail label="Nome" value={brand.name} />
              <Detail label="Instagram" value={brand.instagram ? `@${brand.instagram}` : ""} />
              <Detail label="Segmento" value={brand.segment.name} />
              <Detail label="Status" value={brand.status_label} />
              <Detail label="Descrição" value={brand.description} multiline />
            </ReviewCard>

            <ReviewCard title="Responsável">
              <Detail label="Nome" value={brand.owner.name} />
              <Detail label="E-mail" value={brand.owner.email} />
              <Detail label="WhatsApp" value={brand.owner.whatsapp} />
            </ReviewCard>

            <ReviewCard title="Questionário / Formulário" className="lg:col-span-2">
              <Detail label="Status da inscrição" value={brand.application.status_label} />
              <Detail label="Enviado em" value={brand.application.created_at} />
              <Detail label="Atividades de interesse" value={brand.application.activities_interest} multiline />
              <Detail label="Experiência" value={brand.application.experience} multiline />
              <Detail label="Estrutura para expor" value={brand.application.exposition_structure} multiline />
              <Detail label="Feira anterior" value={brand.application.previous_fair} multiline />
              <Detail label="Como conheceu" value={brand.application.how_did_you_know} />
              <Detail label="Ciência da regra" value={brand.application.prohibition_acknowledgement ? "Sim" : "Não"} />
              <Detail label="Consentimento de dados" value={brand.application.data_consent ? "Sim" : "Não"} />
              <Detail label="Comunicações" value={brand.application.communication_consent ? "Sim" : "Não"} />
            </ReviewCard>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#debec6] bg-[#fff8f8] px-6 py-5 sm:flex-row sm:justify-end">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            Fechar
          </button>
          <button
            className="rounded-full bg-[#ffdad6] px-5 py-2.5 text-sm font-bold text-[#ba1a1a] transition hover:bg-[#ffc7c0] disabled:opacity-60"
            disabled={isLoading}
            onClick={() => onUpdateStatus(brand, "reject")}
            type="button"
          >
            {isLoading ? "Rejeitando..." : "Rejeitar"}
          </button>
          <button
            className="rounded-full bg-[#00881f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#006b16] disabled:opacity-60"
            disabled={isLoading}
            onClick={() => onUpdateStatus(brand, "approve")}
            type="button"
          >
            {isLoading ? "Aprovando..." : "Aprovar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandEditModal({
  brand,
  onClose,
  onSaved,
  segments,
}: {
  brand: AdminBrand;
  onClose: () => void;
  onSaved: () => void;
  segments: AdminBrandsData["segments"];
}) {
  const [form, setForm] = useState({
    name: brand.name,
    instagram: brand.instagram,
    description: brand.description,
    segment_id: String(brand.segment.id),
    status: brand.status,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail ?? "Não foi possível salvar o brechó.");
        return;
      }

      onSaved();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#25181b]/40 px-4 py-8 backdrop-blur-sm">
      <form className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#debec6] bg-white shadow-2xl" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#debec6] bg-[#fff8f8] px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Editar brechó</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#25181b]">{brand.name}</h2>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#debec6] text-lg font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
          <Field label="Nome do brechó" className="md:col-span-2">
            <input className={inputClass} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} value={form.name} />
          </Field>
          <Field label="Instagram">
            <input className={inputClass} onChange={(event) => setForm((previous) => ({ ...previous, instagram: event.target.value }))} value={form.instagram} />
          </Field>
          <Field label="Segmento">
            <select className={inputClass} onChange={(event) => setForm((previous) => ({ ...previous, segment_id: event.target.value }))} value={form.segment_id}>
              {segments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status" className="md:col-span-2">
            <select className={inputClass} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))} value={form.status}>
              <option value="PENDING">Pendente</option>
              <option value="ACTIVE">Ativa</option>
              <option value="INACTIVE">Inativa</option>
              <option value="REJECTED">Rejeitada</option>
            </select>
          </Field>
          <Field label="Descrição" className="md:col-span-2">
            <textarea className={`${inputClass} min-h-28 resize-none`} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} value={form.description} />
          </Field>

          {error && <div className="rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary md:col-span-2">{error}</div>}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#debec6] bg-[#fff8f8] px-6 py-5 sm:flex-row sm:justify-end">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60" disabled={saving} type="submit">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-bold text-[#574147]">{label}</span>
      {children}
    </label>
  );
}

function ReviewCard({ children, className = "", title }: { children: ReactNode; className?: string; title: string }) {
  return (
    <section className={`rounded-xl border border-[#debec6] bg-[#fff8f8] p-5 ${className}`}>
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
              <span className={item.badgeTone === "green" ? "ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white" : "ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white"}>{item.badge}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
