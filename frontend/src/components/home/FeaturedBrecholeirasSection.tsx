"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, type PublicFeaturedBrand } from "@/lib/public-events";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturedBrecholeirasSection({ brands }: { brands: PublicFeaturedBrand[] }) {
  return (
    <section className="bg-[#fff0f4] py-14">
      <div className="mx-auto max-w-container px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={item}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold text-text-primary md:text-4xl">
            Brecholeiras em Destaque
          </h2>
          <p className="text-text-secondary">Conheça as curadoras que fazem a moda circular acontecer</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
          className="flex flex-wrap justify-center gap-10"
        >
          {brands.map((brand, index) => {
            const imageSrc = brand.owner.profile_photo || brand.logo || fallbackEventImage;

            return (
              <motion.article
                key={brand.id}
                variants={item}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="group flex w-40 flex-col items-center text-center"
              >
                <div
                  className={
                    index % 2 === 0
                      ? "relative mx-auto mb-4 h-32 w-32 shrink-0 rounded-full border-4 border-primary p-1 transition group-hover:scale-105"
                      : "relative mx-auto mb-4 h-32 w-32 shrink-0 rounded-full border-4 border-secondary-dark p-1 transition group-hover:scale-105"
                  }
                >
                  <Image
                    src={imageSrc}
                    alt={brand.name}
                    fill
                    className="rounded-full object-cover p-1"
                    sizes="128px"
                    unoptimized={isBackendMediaUrl(imageSrc)}
                  />
                </div>
                <h3 className="min-h-10 w-full text-balance text-sm font-semibold leading-5 text-text-primary">{brand.owner.name || brand.name}</h3>
                <p className="mt-1 w-full truncate text-xs text-primary">{brand.instagram ? `@${brand.instagram}` : brand.name}</p>
              </motion.article>
            );
          })}
          {brands.length === 0 && (
            <motion.div
              variants={item}
              className="rounded-xl border border-dashed border-border bg-white px-6 py-10 text-center"
            >
              <p className="font-display text-xl font-bold text-text-primary">Nenhuma brecholeira em destaque ainda.</p>
              <p className="mt-2 text-sm text-text-secondary">Brechós ativos com produtos cadastrados aparecem aqui automaticamente.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
