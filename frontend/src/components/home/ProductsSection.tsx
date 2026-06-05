"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, type PublicProduct } from "@/lib/public-events";
import { Icon } from "./Icon";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function ProductsSection({ products }: { products: PublicProduct[] }) {
  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-container px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={item}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Produtos Recentes</h2>
          <a className="flex w-fit items-center gap-1 rounded-full bg-secondary-dark px-6 py-2 text-sm font-semibold text-white transition hover:bg-secondary" href="/login">
            <Icon name="add" className="h-5 w-5" />
            Anunciar Produto
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {products.map((product) => {
            const imageSrc = product.image || fallbackEventImage;

            return (
              <motion.article
                key={product.id}
                variants={item}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <Link className="block" href={`/produtos/${product.id}`}>
                  <div className="scrapbook-border relative mb-2 aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={imageSrc}
                      alt={product.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(min-width: 768px) 25vw, 50vw"
                      unoptimized={isBackendMediaUrl(imageSrc)}
                    />
                    <span className="absolute right-2 top-2 rounded-full bg-secondary-dark px-2 py-1 text-[10px] font-bold text-white">
                      {product.brand.name}
                    </span>
                  </div>
                  <h3 className="truncate text-sm font-semibold text-text-primary">{product.title}</h3>
                  <p className="font-bold text-primary">{product.price}</p>
                </Link>
              </motion.article>
            );
          })}
          {products.length === 0 && (
            <motion.div
              variants={item}
              className="rounded-xl border border-dashed border-border bg-background px-6 py-10 text-center md:col-span-4"
            >
              <p className="font-display text-xl font-bold text-text-primary">Nenhum produto anunciado ainda.</p>
              <p className="mt-2 text-sm text-text-secondary">Produtos cadastrados pelas lojas ativas aparecem aqui automaticamente.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
