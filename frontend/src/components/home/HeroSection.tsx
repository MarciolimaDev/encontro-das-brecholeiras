"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Icon } from "./Icon";

const heroShoppingImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80";

const stats = [
  { icon: "groups", value: "+300", label: "Brecholeiras conectadas", tone: "primary" },
  { icon: "tag", value: "+10 mil", label: "Peças circulando histórias", tone: "secondary" },
  { icon: "heart", value: "Eventos", label: "que fortalecem a comunidade", tone: "primary" },
  { icon: "leaf", value: "Moda circular", label: "que cuida de pessoas e do planeta", tone: "secondary" },
] as const;

export function HeroSection() {
  return (
    <section className="bg-[#FAF8F5]">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="font-display text-6xl font-bold leading-none text-gray-900 lg:text-7xl">
                Moda que
                <span className="block text-[#E85A7C]">transforma.</span>
              </h1>
              <div className="flex items-center gap-2">
                <Icon name="leaf" className="h-6 w-6 text-[#8AB661]" />
                <Icon name="leaf" className="h-5 w-5 text-[#8AB661]" />
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p className="text-lg">Conectamos brecholeiras, fortalecemos sonhos</p>
              <p className="text-lg">
                e impulsionamos o <span className="font-semibold text-[#8AB661]">consumo consciente</span>
              </p>
              <p className="text-lg">no Acre e além.</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#newsletter"
                className="inline-flex h-12 items-center rounded-full bg-[#E85A7C] px-8 text-sm font-bold text-white shadow-lg shadow-[#E85A7C]/20 transition hover:-translate-y-1 hover:bg-[#d84d6d]"
              >
                Quero participar
                <Icon name="arrow" className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#eventos"
                className="inline-flex h-12 items-center rounded-full border-2 border-[#8AB661] px-8 text-sm font-semibold text-[#8AB661] transition hover:bg-[#8AB661]/10"
              >
                <Icon name="calendar" className="mr-2 h-5 w-5" />
                Ver próximos eventos
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div className="text-center" key={stat.label}>
                  <Icon
                    name={stat.icon}
                    className={
                      stat.tone === "primary"
                        ? "mx-auto mb-2 h-10 w-10 text-[#E85A7C]"
                        : "mx-auto mb-2 h-10 w-10 text-[#8AB661]"
                    }
                  />
                  <div
                    className={
                      stat.value === "Eventos" || stat.value === "Moda circular"
                        ? "text-lg font-bold text-gray-900"
                        : "text-3xl font-bold text-gray-900"
                    }
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -top-10 right-10 z-10">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                <div className="text-center">
                  <Icon name="leaf" className="mx-auto mb-1 h-8 w-8 text-[#8AB661]" />
                  <p className="text-xs font-semibold uppercase text-[#8AB661]">Recicle</p>
                  <p className="text-xs font-semibold uppercase text-[#8AB661]">Reinvente</p>
                  <p className="text-xs font-semibold uppercase text-[#8AB661]">Moda com Propósito</p>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={heroShoppingImage}
                alt="Mulher comprando de forma sustentável"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E85A7C]">
                  <Icon name="groups" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-bold text-gray-900">Juntas somos mais fortes!</h2>
                  <p className="text-sm text-gray-700">
                    Uma rede colaborativa que valoriza o trabalho, a criatividade e o empreendedorismo feminino.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-12 bg-[#8AB661] py-6">
        <div className="mx-auto max-w-container px-6">
          <div className="flex items-center justify-center gap-4 text-white">
            <Icon name="leaf" className="h-6 w-6" />
            <p className="text-lg">
              Menos descarte, mais propósito. Menos impacto, <span className="font-bold">mais futuro.</span>
            </p>
            <Icon name="heart" className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
