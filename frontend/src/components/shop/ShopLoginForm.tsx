"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/home/Icon";

export function ShopLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/shop/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail ?? "Não foi possível entrar.");
        return;
      }

      const next = searchParams.get("next");
      router.replace(next || `/dashboard/loja/${data.brand.slug}`);
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[0_24px_80px_rgba(174,28,94,0.12)]" onSubmit={submit}>
      <div className="mb-8">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon name="hanger" className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary">Entrar na minha loja</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">Acesse o painel do seu brechó para acompanhar cadastro, status e próximos recursos da loja.</p>
      </div>

      <div className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-text-secondary">E-mail</span>
          <input
            autoComplete="email"
            className="h-12 rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            type="email"
            value={email}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-text-secondary">Senha</span>
          <input
            autoComplete="current-password"
            className="h-12 rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
            type="password"
            value={password}
          />
        </label>
      </div>

      {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}

      <button className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "Entrando..." : "Acessar minha loja"}
      </button>
    </form>
  );
}
