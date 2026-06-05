"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { AdminIcon } from "./AdminIcon";
import { navigation } from "./data";
import type { AdminEvent, AdminEventsData } from "./types";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8Xhq3EKSpWZ60K3oa-hqQS_krY2C0XJou9YnjjSr79APKCU8xw70KzQE5WN2snqJ8XY83rX8y5EdkmlWB5pqMMJMbjsrrIq-4gjeGGErjU1oMjhDWdTgQQO1dQdT3mzGQtrtwTHHrlOc6UFctu08IEjcibYtxQEveTfNifGCCSPOJqKgIePLeyZ4A_L2-EZjGNFnp0L3Jyn8Jml5fUjTJQoVoBdP_9L-yWyVXDelOcmkUkEKxIXeeLE81DgX0CogmmjZ2-AHamTw";

type EventFormState = {
  title: string;
  description: string;
  event_type: string;
  location: string;
  city: string;
  uf: string;
  start_date: string;
  end_date: string;
  status: string;
  is_featured: boolean;
  registration_open: boolean;
};

const initialForm: EventFormState = {
  title: "",
  description: "",
  event_type: "EVENT",
  location: "",
  city: "",
  uf: "",
  start_date: "",
  end_date: "",
  status: "DRAFT",
  is_featured: false,
  registration_open: false,
};

const roleLabels: Record<string, string> = {
  super_admin: "Admin Principal",
  admin: "Admin",
  brecholeira: "Brecholeira",
};

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

export function AdminEventsManager({ data }: { data: AdminEventsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const queryNew = searchParams.get("novo");
  const queryEventId = searchParams.get("evento");
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(() =>
    queryEventId ? data.events.find((event) => event.id === queryEventId) ?? null : null,
  );
  const [isModalOpen, setIsModalOpen] = useState(() => queryNew === "1" || Boolean(queryEventId && selectedEvent));
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const roleLabel = data.user.is_staff ? roleLabels[data.user.role] || "Admin" : roleLabels[data.user.role] || data.user.role;
  const moderationItems = [
    { label: "Fila de Aprovação", icon: "shield", href: "/admin/aprovacoes", badge: String(data.metrics.pending_approvals) },
    { label: "Garimpos Reportados", icon: "report", badge: "0", badgeTone: "green" },
  ] satisfies { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];
  const metrics = [
    { label: "Total de eventos", value: formatNumber(data.metrics.total_events), icon: "calendar", tone: "pink" },
    { label: "Publicados", value: formatNumber(data.metrics.published), icon: "dashboard", tone: "green" },
    { label: "Rascunhos", value: formatNumber(data.metrics.drafts), icon: "edit", tone: "pink" },
    { label: "Inscrições abertas", value: formatNumber(data.metrics.registration_open), icon: "members", tone: "green" },
  ] satisfies { label: string; value: string; icon: ComponentProps<typeof AdminIcon>["name"]; tone: "pink" | "green" }[];
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.events;

    return data.events.filter((event) =>
      [event.title, event.location, event.city, event.uf, event.status_label, event.event_type_label].join(" ").toLowerCase().includes(query),
    );
  }, [data.events, search]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: AdminEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    if (queryNew || queryEventId) {
      router.replace("/admin/eventos", { scroll: false });
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
          <SidebarGroup title="Navegação principal" items={navigation.map((item) => ({ ...item, active: item.href === "/admin/eventos" }))} />
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
                placeholder="Buscar eventos por nome, local ou status..."
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
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Gestão de Eventos</h2>
              <p className="mt-1 text-sm text-[#574147] md:text-base">Crie, edite e acompanhe eventos, feirinhas e festivais.</p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark" onClick={openCreateModal} type="button">
              <AdminIcon name="add" className="h-4 w-4" />
              Criar evento
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
              <h3 className="font-display text-xl font-bold">Eventos cadastrados</h3>
              <span className="text-sm font-semibold text-[#574147]">{filteredEvents.length} encontrados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-white font-semibold text-[#574147]">
                  <tr>
                    <th className="px-6 py-4">Evento</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Local</th>
                    <th className="px-6 py-4">Início</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#debec6]">
                  {filteredEvents.map((event) => (
                    <tr className="transition hover:bg-[#fff8f8]" key={event.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#25181b]">{event.title}</p>
                        <p className="line-clamp-1 max-w-md text-xs font-semibold text-[#574147]">{event.description}</p>
                      </td>
                      <td className="px-6 py-4 text-[#574147]">{event.event_type_label}</td>
                      <td className="px-6 py-4 text-[#574147]">{[event.location, event.city, event.uf].filter(Boolean).join(", ")}</td>
                      <td className="px-6 py-4 text-[#574147]">{event.start_date}</td>
                      <td className="px-6 py-4">
                        <span className={event.status === "PUBLISHED" ? "rounded-full bg-[#00881f]/10 px-3 py-1 text-xs font-bold text-[#006b16]" : "rounded-full bg-[#F2B544]/15 px-3 py-1 text-xs font-bold text-[#9A5A00]"}>
                          {event.status_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20" onClick={() => openEditModal(event)} type="button">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm font-semibold text-[#574147]" colSpan={6}>
                        Nenhum evento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {isModalOpen && (
        <EventFormModal
          event={selectedEvent}
          onClose={closeModal}
          onSaved={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            if (queryNew || queryEventId) {
              router.replace("/admin/eventos", { scroll: false });
            }
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function EventFormModal({ event, onClose, onSaved }: { event: AdminEvent | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<EventFormState>(
    event
      ? {
          title: event.title,
          description: event.description,
          event_type: event.event_type,
          location: event.location,
          city: event.city,
          uf: event.uf,
          start_date: event.start_date_input,
          end_date: event.end_date_input,
          status: event.status,
          is_featured: event.is_featured,
          registration_open: event.registration_open,
        }
      : initialForm,
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      if (bannerFile) {
        payload.append("banner", bannerFile);
      }

      const response = await fetch(event ? `/api/admin/events/${event.id}` : "/api/admin/events", {
        method: event ? "PATCH" : "POST",
        body: payload,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail ?? "Não foi possível salvar o evento.");
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
      <form className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#debec6] bg-white shadow-2xl" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#debec6] bg-[#fff8f8] px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">{event ? "Editar evento" : "Novo evento"}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#25181b]">{event ? event.title : "Criar evento"}</h2>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#debec6] text-lg font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Título" className="md:col-span-2">
              <input className={inputClass} onChange={(inputEvent) => set("title", inputEvent.target.value)} value={form.title} />
            </Field>
            <Field label="Descrição" className="md:col-span-2">
              <textarea className={`${inputClass} min-h-28 resize-none`} onChange={(inputEvent) => set("description", inputEvent.target.value)} value={form.description} />
            </Field>
            <Field label="Banner" className="md:col-span-2">
              <div className="rounded-xl border border-dashed border-[#debec6] bg-[#fff8f8] p-4">
                {event?.banner && !bannerFile && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#8b7077]">Banner atual</p>
                    <div className="relative h-40 overflow-hidden rounded-lg border border-[#debec6]">
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="(min-width: 768px) 680px, 100vw"
                        src={event.banner}
                        unoptimized={isBackendMediaUrl(event.banner)}
                      />
                    </div>
                  </div>
                )}
                <input
                  accept="image/*"
                  className="block w-full text-sm text-[#574147] file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-primary-dark"
                  onChange={(inputEvent) => setBannerFile(inputEvent.target.files?.[0] ?? null)}
                  type="file"
                />
                <p className="mt-2 text-xs font-semibold text-[#8b7077]">
                  {bannerFile ? `Selecionado: ${bannerFile.name}` : "Use uma imagem horizontal para melhor resultado."}
                </p>
              </div>
            </Field>
            <Field label="Tipo">
              <select className={inputClass} onChange={(inputEvent) => set("event_type", inputEvent.target.value)} value={form.event_type}>
                <option value="EVENT">Evento</option>
                <option value="FAIR">Feirinha</option>
                <option value="FESTIVAL">Festival</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={inputClass} onChange={(inputEvent) => set("status", inputEvent.target.value)} value={form.status}>
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="FINISHED">Finalizado</option>
              </select>
            </Field>
            <Field label="Local" className="md:col-span-2">
              <input className={inputClass} onChange={(inputEvent) => set("location", inputEvent.target.value)} value={form.location} />
            </Field>
            <Field label="Cidade">
              <input className={inputClass} onChange={(inputEvent) => set("city", inputEvent.target.value)} value={form.city} />
            </Field>
            <Field label="UF">
              <input className={`${inputClass} uppercase`} maxLength={2} onChange={(inputEvent) => set("uf", inputEvent.target.value.toUpperCase())} value={form.uf} />
            </Field>
            <Field label="Início">
              <input className={inputClass} onChange={(inputEvent) => set("start_date", inputEvent.target.value)} type="datetime-local" value={form.start_date} />
            </Field>
            <Field label="Término">
              <input className={inputClass} onChange={(inputEvent) => set("end_date", inputEvent.target.value)} type="datetime-local" value={form.end_date} />
            </Field>
            <label className="flex items-center gap-3 rounded-xl border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm font-bold text-[#574147]">
              <input checked={form.is_featured} className="h-4 w-4 accent-[#E94E8A]" onChange={(inputEvent) => set("is_featured", inputEvent.target.checked)} type="checkbox" />
              Evento em destaque
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm font-bold text-[#574147]">
              <input checked={form.registration_open} className="h-4 w-4 accent-[#E94E8A]" onChange={(inputEvent) => set("registration_open", inputEvent.target.checked)} type="checkbox" />
              Inscrições abertas
            </label>
          </div>

          {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#debec6] bg-[#fff8f8] px-6 py-5 sm:flex-row sm:justify-end">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147] transition hover:border-primary hover:text-primary" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60" disabled={saving} type="submit">
            {saving ? "Salvando..." : "Salvar evento"}
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
