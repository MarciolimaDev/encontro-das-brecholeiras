"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { ShopShell } from "./ShopShell";
import type { ShopData } from "./types";

export function ShopAccountForm({ data }: { data: ShopData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/shop/${data.brand.slug}/account`, {
        method: "PATCH",
        body: formData,
      });
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        setError(responseData?.detail ?? "Não foi possível salvar sua conta.");
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
    <ShopShell active="account" data={data}>
      <section>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Minha conta</h1>
        <p className="mt-1 text-sm text-[#574147] md:text-base">Atualize seus dados de acesso, contato, endereço e foto de perfil.</p>
      </section>

      <form className="max-w-5xl rounded-xl border border-[#debec6] bg-white p-6 shadow-sm" onSubmit={submit}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-primary/10 text-lg font-bold text-primary">
            {data.profile.profile_photo ? (
              <Image alt="" className="object-cover" fill sizes="80px" src={data.profile.profile_photo} unoptimized={isBackendMediaUrl(data.profile.profile_photo)} />
            ) : (
              data.user.first_name.slice(0, 1).toUpperCase()
            )}
          </div>
          <Field label="Foto de perfil" className="w-full sm:max-w-sm">
            <input accept="image/*" className={inputClass} name="profile_photo" type="file" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome">
            <input className={inputClass} defaultValue={data.user.first_name} name="first_name" />
          </Field>
          <Field label="Sobrenome">
            <input className={inputClass} defaultValue={data.user.last_name} name="last_name" />
          </Field>
          <Field label="E-mail">
            <input className={inputClass} defaultValue={data.user.email} name="email" type="email" />
          </Field>
          <Field label="Telefone / WhatsApp">
            <input className={inputClass} defaultValue={data.profile.whatsapp} name="whatsapp" />
          </Field>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-[#25181b]">Endereço</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
            <Field label="CEP" className="md:col-span-2">
              <input className={inputClass} defaultValue={data.address.cep} name="cep" />
            </Field>
            <Field label="Rua" className="md:col-span-4">
              <input className={inputClass} defaultValue={data.address.street} name="street" />
            </Field>
            <Field label="Número" className="md:col-span-1">
              <input className={inputClass} defaultValue={data.address.number} name="number" />
            </Field>
            <Field label="Bairro" className="md:col-span-3">
              <input className={inputClass} defaultValue={data.address.neighborhood} name="neighborhood" />
            </Field>
            <Field label="Cidade" className="md:col-span-2">
              <input className={inputClass} defaultValue={data.address.city} name="city" />
            </Field>
            <Field label="UF" className="md:col-span-1">
              <input className={`${inputClass} uppercase`} defaultValue={data.address.uf} maxLength={2} name="uf" />
            </Field>
            <Field label="Complemento" className="md:col-span-5">
              <input className={inputClass} defaultValue={data.address.complement} name="complement" />
            </Field>
          </div>
        </div>

        {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}
        <button className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Salvando..." : "Salvar minha conta"}
        </button>
      </form>
    </ShopShell>
  );
}

const inputClass = "w-full rounded-lg border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <label className={`flex flex-col gap-2 ${className}`}><span className="text-sm font-bold text-[#574147]">{label}</span>{children}</label>;
}
