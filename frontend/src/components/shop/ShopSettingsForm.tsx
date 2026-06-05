"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ShopShell } from "./ShopShell";
import type { ShopData } from "./types";

export function ShopSettingsForm({ data }: { data: ShopData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/shop/${data.brand.slug}/settings`, {
        method: "PATCH",
        body: formData,
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        setError(responseData?.detail ?? "Não foi possível salvar as configurações.");
        return;
      }

      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShopShell active="settings" data={data}>
      <section>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Configurações</h1>
        <p className="mt-1 text-sm text-[#574147] md:text-base">Atualize logo e informações principais do brechó.</p>
      </section>

      <form className="max-w-3xl rounded-xl border border-[#debec6] bg-white p-6 shadow-sm" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome do brechó" className="md:col-span-2">
            <input className={inputClass} defaultValue={data.brand.name} name="name" />
          </Field>
          <Field label="Instagram">
            <input className={inputClass} defaultValue={data.brand.instagram} name="instagram" />
          </Field>
          <Field label="Logo">
            <input accept="image/*" className={inputClass} name="logo" type="file" />
          </Field>
          <Field label="Descrição" className="md:col-span-2">
            <textarea className={`${inputClass} min-h-32 resize-none`} defaultValue={data.brand.description} name="description" />
          </Field>
        </div>
        {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}
        <button className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </ShopShell>
  );
}

const inputClass = "w-full rounded-lg border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <label className={`flex flex-col gap-2 ${className}`}><span className="text-sm font-bold text-[#574147]">{label}</span>{children}</label>;
}
