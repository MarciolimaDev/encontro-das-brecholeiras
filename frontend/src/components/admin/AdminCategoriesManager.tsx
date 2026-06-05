"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { AdminIcon } from "./AdminIcon";
import { navigation } from "./data";
import type { AdminCategoriesData, AdminProductCategory } from "./types";

const roleLabels: Record<string, string> = {
  super_admin: "Admin Principal",
  admin: "Admin",
  brecholeira: "Brecholeira",
};

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

export function AdminCategoriesManager({ data }: { data: AdminCategoriesData }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AdminProductCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;
  const roleLabel = data.user.is_staff ? roleLabels[data.user.role] || "Admin" : roleLabels[data.user.role] || data.user.role;
  const moderationItems = [
    { label: "Fila de Aprovação", icon: "shield", href: "/admin/aprovacoes", badge: String(data.metrics.pending_approvals) },
    { label: "Garimpos Reportados", icon: "report", badge: "0", badgeTone: "green" },
  ] satisfies { label: string; icon: ComponentProps<typeof AdminIcon>["name"]; active?: boolean; badge?: string; badgeTone?: "green"; href?: string }[];
  const metrics = [
    { label: "Categorias", value: formatNumber(data.metrics.total_categories), icon: "tag", tone: "pink" },
    { label: "Ativas", value: formatNumber(data.metrics.active), icon: "shield", tone: "green" },
    { label: "Inativas", value: formatNumber(data.metrics.inactive), icon: "warning", tone: "pink" },
  ] satisfies { label: string; value: string; icon: ComponentProps<typeof AdminIcon>["name"]; tone: "pink" | "green" }[];
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.categories;
    return data.categories.filter((category) => [category.name, category.description].join(" ").toLowerCase().includes(query));
  }, [data.categories, search]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: AdminProductCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const toggleCategory = async (category: AdminProductCategory) => {
    await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: category.is_active ? "deactivate" : "activate" }),
    });
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
          <SidebarGroup title="Navegação principal" items={navigation.map((item) => ({ ...item, active: item.href === "/admin/categorias" }))} />
          <SidebarGroup title="Moderação" items={moderationItems} />
        </nav>

        <div className="border-t border-[#debec6] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#fff0f2] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">{userName.slice(0, 1).toUpperCase()}</div>
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
                placeholder="Buscar categorias..."
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
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Categorias</h2>
              <p className="mt-1 text-sm text-[#574147] md:text-base">Crie as categorias que as brecholeiras usarão ao cadastrar produtos.</p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark" onClick={openCreateModal} type="button">
              <AdminIcon name="add" className="h-4 w-4" />
              Nova categoria
            </button>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              <h3 className="font-display text-xl font-bold">Categorias cadastradas</h3>
              <span className="text-sm font-semibold text-[#574147]">{filteredCategories.length} encontradas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-white font-semibold text-[#574147]">
                  <tr>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Produtos</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#debec6]">
                  {filteredCategories.map((category) => (
                    <tr className="transition hover:bg-[#fff8f8]" key={category.id}>
                      <td className="px-6 py-4 font-bold text-[#25181b]">{category.name}</td>
                      <td className="px-6 py-4 text-[#574147]">{category.description || "Sem descrição"}</td>
                      <td className="px-6 py-4 text-[#574147]">{category.products_count}</td>
                      <td className="px-6 py-4">
                        <span className={category.is_active ? "rounded-full bg-[#00881f]/10 px-3 py-1 text-xs font-bold text-[#006b16]" : "rounded-full bg-[#E25555]/10 px-3 py-1 text-xs font-bold text-[#B51D1D]"}>
                          {category.is_active ? "Ativa" : "Inativa"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20" onClick={() => openEditModal(category)} type="button">
                            Editar
                          </button>
                          <button className={category.is_active ? "rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100" : "rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100"} onClick={() => toggleCategory(category)} type="button">
                            {category.is_active ? "Desativar" : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm font-semibold text-[#574147]" colSpan={5}>
                        Nenhuma categoria encontrada.
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
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          onSaved={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, onClose, onSaved }: { category: AdminProductCategory | null; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
      };
      const response = await fetch(category ? `/api/admin/categories/${category.id}` : "/api/admin/categories", {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail ?? "Não foi possível salvar a categoria.");
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
      <form className="w-full max-w-xl rounded-2xl border border-[#debec6] bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">{category ? "Editar categoria" : "Nova categoria"}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">{category ? category.name : "Criar categoria"}</h2>
          </div>
          <button className="text-xl font-bold text-[#574147]" onClick={onClose} type="button">×</button>
        </div>

        <div className="space-y-4">
          <Field label="Nome">
            <input className={inputClass} defaultValue={category?.name ?? ""} name="name" />
          </Field>
          <Field label="Descrição">
            <textarea className={`${inputClass} min-h-28 resize-none`} defaultValue={category?.description ?? ""} name="description" />
          </Field>
        </div>

        {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147]" onClick={onClose} type="button">Cancelar</button>
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? "Salvando..." : "Salvar categoria"}</button>
        </div>
      </form>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className="flex flex-col gap-2"><span className="text-sm font-bold text-[#574147]">{label}</span>{children}</label>;
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
