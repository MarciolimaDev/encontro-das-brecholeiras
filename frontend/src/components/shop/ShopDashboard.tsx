import type { ReactNode } from "react";
import { Icon } from "@/components/home/Icon";
import { ShopShell } from "./ShopShell";
import type { ShopData } from "./types";

export type ShopDashboardData = ShopData;

export function ShopDashboard({ data }: { data: ShopDashboardData }) {
  const userName = `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email;

  return (
    <ShopShell active="overview" data={data}>
      <section>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Overview</h1>
        <p className="mt-1 text-sm text-[#574147] md:text-base">Resumo da sua loja e status do cadastro no Encontro das Brecholeiras.</p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon="user" label="Responsável" value={userName} />
        <SummaryCard icon="tag" label="Produtos" value={String(data.brand.products_count)} />
        <SummaryCard icon="leaf" label="Segmento" value={data.brand.segment.name} />
        <SummaryCard icon="location" label="Localização" value={[data.address.neighborhood, data.address.city, data.address.uf].filter(Boolean).join(", ") || "Não informado"} />
      </section>

      <section className="rounded-2xl border border-[#debec6] bg-white p-6 shadow-sm">
        <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-dark">
          {data.brand.status_label}
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">{data.brand.name}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#574147]">{data.brand.description}</p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Dados da loja">
          <Detail label="Instagram" value={data.brand.instagram ? `@${data.brand.instagram}` : ""} />
          <Detail label="WhatsApp" value={data.profile.whatsapp} />
          <Detail label="E-mail" value={data.user.email} />
          <Detail label="Slug público" value={data.brand.slug} />
        </Panel>

        <Panel title="Cadastro">
          <Detail label="Status da inscrição" value={data.application.status_label} />
          <Detail label="Enviado em" value={data.application.created_at} />
          <Detail label="Experiência" value={data.brand.application.experience} multiline />
          <Detail label="Estrutura para expor" value={data.brand.application.exposition_structure} multiline />
        </Panel>
      </section>
    </ShopShell>
  );
}

function SummaryCard({ icon, label, value }: { icon: "leaf" | "location" | "tag" | "user"; label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#debec6] bg-white p-5 shadow-sm">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-[#574147]">{label}</p>
      <h3 className="mt-1 font-display text-xl font-extrabold">{value || "Não informado"}</h3>
    </article>
  );
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-xl border border-[#debec6] bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Detail({ label, multiline = false, value }: { label: string; multiline?: boolean; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#8b7077]">{label}</p>
      <p className={multiline ? "mt-1 whitespace-pre-line text-sm leading-6 text-[#25181b]" : "mt-1 text-sm font-semibold text-[#25181b]"}>
        {value || "Não informado"}
      </p>
    </div>
  );
}
