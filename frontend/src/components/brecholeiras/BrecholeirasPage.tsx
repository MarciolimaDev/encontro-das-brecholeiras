"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, type PublicFeaturedBrand } from "@/lib/public-events";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function BrecholeirasPage({ brands }: { brands: PublicFeaturedBrand[] }) {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("Todos");
  const segments = useMemo(() => ["Todos", ...Array.from(new Set(brands.map((brand) => brand.segment).filter(Boolean))).sort()], [brands]);
  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    return brands.filter((brand) => {
      const matchesSegment = segment === "Todos" || brand.segment === segment;
      const matchesSearch = !query || [brand.name, brand.owner.name, brand.instagram, brand.segment].join(" ").toLowerCase().includes(query);
      return matchesSegment && matchesSearch;
    });
  }, [brands, search, segment]);
  const activeProducts = brands.reduce((total, brand) => total + brand.products_count, 0);

  return (
    <main className="pt-20">
      <section className="bg-background py-14">
        <div className="mx-auto max-w-container px-6">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <motion.div initial="hidden" animate="visible" variants={container}>
              <motion.span variants={item} className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                Rede colaborativa
              </motion.span>
              <motion.h1 variants={item} className="mt-5 font-display text-4xl font-extrabold leading-tight text-text-primary md:text-5xl">
                Brecholeiras que movimentam a moda circular
              </motion.h1>
              <motion.p variants={item} className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                Conheça as curadoras e brechós ativos do coletivo. Cada perfil reúne criatividade, propósito e peças que voltam a circular com novas histórias.
              </motion.p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="grid grid-cols-2 gap-4">
              <MetricCard label="Brechós ativos" value={brands.length.toString()} />
              <MetricCard label="Produtos ativos" value={activeProducts.toLocaleString("pt-BR")} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff0f4] py-12">
        <div className="mx-auto max-w-container px-6">
          <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <input
              className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, brechó, instagram ou segmento"
              type="search"
              value={search}
            />
            <div className="flex flex-wrap gap-2">
              {segments.map((option) => (
                <button
                  className={
                    option === segment
                      ? "rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
                      : "rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-text-secondary transition hover:border-primary hover:text-primary"
                  }
                  key={option}
                  onClick={() => setSegment(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={container} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBrands.map((brand, index) => (
              <BrecholeiraCard brand={brand} index={index} key={brand.id} />
            ))}
          </motion.div>

          {filteredBrands.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
              <p className="font-display text-2xl font-bold text-text-primary">Nenhuma brecholeira encontrada.</p>
              <p className="mt-2 text-text-secondary">Tente buscar por outro nome, instagram ou segmento.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-text-secondary">{label}</p>
      <strong className="mt-2 block font-display text-3xl font-extrabold text-primary">{value}</strong>
    </article>
  );
}

function BrecholeiraCard({ brand, index }: { brand: PublicFeaturedBrand; index: number }) {
  const imageSrc = brand.owner.profile_photo || brand.logo || fallbackEventImage;

  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="group flex h-full flex-col items-center rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition hover:shadow-lg"
    >
      <div
        className={
          index % 2 === 0
            ? "relative mb-5 h-32 w-32 shrink-0 rounded-full border-4 border-primary p-1 transition group-hover:scale-105"
            : "relative mb-5 h-32 w-32 shrink-0 rounded-full border-4 border-secondary-dark p-1 transition group-hover:scale-105"
        }
      >
        <Image
          src={imageSrc}
          alt={brand.owner.name || brand.name}
          fill
          className="rounded-full object-cover p-1"
          sizes="128px"
          unoptimized={isBackendMediaUrl(imageSrc)}
        />
      </div>

      <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary-dark">{brand.segment}</span>
      <h2 className="mt-4 min-h-12 text-balance font-display text-lg font-extrabold leading-6 text-text-primary">{brand.owner.name || brand.name}</h2>
      <p className="mt-1 text-sm font-semibold text-primary">{brand.instagram ? `@${brand.instagram}` : brand.name}</p>
      <p className="mt-2 text-xs font-bold text-text-secondary">{brand.products_count} produtos ativos</p>
    </motion.article>
  );
}
