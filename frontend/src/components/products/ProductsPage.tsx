"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, type PublicProduct } from "@/lib/public-events";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function ProductsPage({ products }: { products: PublicProduct[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todos");
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(products.map((product) => product.category.name).filter(Boolean))).sort()], [products]);
  const brands = useMemo(() => ["Todos", ...Array.from(new Set(products.map((product) => product.brand.name).filter(Boolean))).sort()], [products]);
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "Todas" || product.category.name === category;
      const matchesBrand = brand === "Todos" || product.brand.name === brand;
      const matchesSearch =
        !query ||
        [product.title, product.description, product.category.name, product.brand.name, product.brand.instagram]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [brand, category, products, search]);

  return (
    <main className="pt-20">
      <section className="bg-background py-14">
        <div className="mx-auto max-w-container px-6">
          <motion.div initial="hidden" animate="visible" variants={container} className="max-w-3xl">
            <motion.span variants={item} className="inline-flex rounded-full bg-secondary/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-secondary-dark">
              Garimpos recentes
            </motion.span>
            <motion.h1 variants={item} className="mt-5 font-display text-4xl font-extrabold leading-tight text-text-primary md:text-5xl">
              Produtos das brecholeiras
            </motion.h1>
            <motion.p variants={item} className="mt-4 text-base leading-7 text-text-secondary">
              Explore peças cadastradas pelas lojas ativas do coletivo. Use os filtros para encontrar categorias, brechós e garimpos específicos.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-container px-6">
          <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_220px]">
            <input
              className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por produto, descrição, categoria ou brechó"
              type="search"
              value={search}
            />
            <select
              className="h-12 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-text-secondary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="h-12 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-text-secondary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              onChange={(event) => setBrand(event.target.value)}
              value={brand}
            >
              {brands.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold text-text-primary">Catálogo</h2>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
              {filteredProducts.length} produtos
            </span>
          </div>

          <motion.div initial="hidden" animate="visible" variants={container} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-background px-6 py-12 text-center">
              <p className="font-display text-2xl font-bold text-text-primary">Nenhum produto encontrado.</p>
              <p className="mt-2 text-text-secondary">Tente limpar os filtros ou buscar por outro termo.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: PublicProduct }) {
  const imageSrc = product.image || fallbackEventImage;

  return (
    <motion.article variants={item} transition={{ duration: 0.42, ease: "easeOut" }} whileHover={{ y: -5 }} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg">
      <Link className="block h-full" href={`/produtos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#ffe8ed]">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            unoptimized={isBackendMediaUrl(imageSrc)}
          />
          {product.category.name && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-primary shadow-sm">
              {product.category.name}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="truncate font-display text-base font-extrabold text-text-primary">{product.title}</h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-text-secondary">{product.description || "Produto cadastrado pela loja."}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-text-secondary">{product.brand.name}</p>
              {product.brand.instagram && <p className="truncate text-xs font-bold text-primary">@{product.brand.instagram}</p>}
            </div>
            <strong className="shrink-0 font-display text-lg font-extrabold text-primary">{product.price}</strong>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
