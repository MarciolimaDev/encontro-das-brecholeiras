"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { ShopShell } from "./ShopShell";
import type { ShopData, ShopProduct, ShopProductCategory } from "./types";

export function ShopProductsManager({ categories, data, products }: { categories: ShopProductCategory[]; data: ShopData; products: ShopProduct[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  return (
    <ShopShell active="products" data={data}>
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#25181b]">Produtos</h1>
          <p className="mt-1 text-sm text-[#574147] md:text-base">Cadastre e acompanhe os produtos do seu brechó.</p>
        </div>
        <button className="inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark" onClick={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }} type="button">
          Novo produto
        </button>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article className="overflow-hidden rounded-xl border border-[#debec6] bg-white" key={product.id}>
            <div className="relative h-44 bg-[#ffe8ed]">
              {product.photo ? (
                <Image alt="" className="object-cover" fill sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" src={product.photo} unoptimized={isBackendMediaUrl(product.photo)} />
              ) : (
                <div className="grid h-full place-items-center text-sm font-bold text-primary">Sem foto</div>
              )}
            </div>
            <div className="p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary-dark">{product.status_label}</span>
                  {product.category.name && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{product.category.name}</span>}
                </div>
                <span className="font-display text-lg font-extrabold">R$ {product.price.replace(".", ",")}</span>
              </div>
              <h3 className="font-display text-xl font-bold">{product.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#574147]">{product.description || "Sem descrição"}</p>
              <div className="mt-5 flex justify-end">
                <button
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                  type="button"
                >
                  Editar
                </button>
              </div>
            </div>
          </article>
        ))}
        {products.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#debec6] bg-white p-8 text-center text-sm font-semibold text-[#574147] md:col-span-2 xl:col-span-3">
            Nenhum produto cadastrado.
          </div>
        )}
      </section>

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSaved={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
            router.refresh();
          }}
          categories={categories}
          slug={data.brand.slug}
        />
      )}
    </ShopShell>
  );
}

function ProductModal({ categories, onClose, onSaved, product, slug }: { categories: ShopProductCategory[]; onClose: () => void; onSaved: () => void; product: ShopProduct | null; slug: string }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(product ? `/api/shop/${slug}/products/${product.id}` : `/api/shop/${slug}/products`, {
        method: product ? "PATCH" : "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail ?? "Não foi possível salvar o produto.");
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
      <form className="w-full max-w-2xl rounded-2xl border border-[#debec6] bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">{product ? "Editar produto" : "Novo produto"}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">{product ? product.title : "Cadastrar produto"}</h2>
          </div>
          <button className="text-xl font-bold text-[#574147]" onClick={onClose} type="button">×</button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome" className="md:col-span-2"><input className={inputClass} defaultValue={product?.title ?? ""} name="title" /></Field>
          <Field label="Preço"><input className={inputClass} defaultValue={product?.price.replace(".", ",") ?? ""} name="price" placeholder="89,90" /></Field>
          <Field label="Categoria">
            <select className={inputClass} name="category_id" defaultValue={product?.category.id ?? ""}>
              <option value="" disabled>Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} name="status" defaultValue={product?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Ativo</option>
              <option value="DRAFT">Rascunho</option>
              <option value="SOLD">Vendido</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </Field>
          <Field label="Foto" className="md:col-span-2"><input accept="image/*" className={inputClass} name="photo" type="file" /></Field>
          <Field label="Descrição" className="md:col-span-2"><textarea className={`${inputClass} min-h-28 resize-none`} defaultValue={product?.description ?? ""} name="description" /></Field>
        </div>
        {error && <div className="mt-5 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-full border border-[#debec6] px-5 py-2.5 text-sm font-bold text-[#574147]" onClick={onClose} type="button">Cancelar</button>
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? "Salvando..." : product ? "Salvar alterações" : "Salvar produto"}</button>
        </div>
      </form>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-[#debec6] bg-[#fff8f8] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <label className={`flex flex-col gap-2 ${className}`}><span className="text-sm font-bold text-[#574147]">{label}</span>{children}</label>;
}
