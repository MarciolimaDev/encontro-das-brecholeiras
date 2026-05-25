"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { events } from "./data";
import { Icon } from "./Icon";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function EventsSection() {
  return (
    <section id="eventos" className="bg-surface py-14">
      <div className="mx-auto max-w-container px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={item}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Próximos Eventos</h2>
            <p className="text-text-secondary">Marque no seu calendário nossos festivais de moda</p>
          </div>
          <a className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline" href="#">
            Ver todos os eventos <span aria-hidden="true">-&gt;</span>
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event) => (
            <motion.article
              key={event.title}
              variants={item}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -7 }}
              className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                />
                <div
                  className={
                    event.tone === "primary"
                      ? "absolute left-4 top-4 rounded-lg bg-primary px-4 py-1 text-center text-white shadow-md"
                      : "absolute left-4 top-4 rounded-lg bg-secondary-dark px-4 py-1 text-center text-white shadow-md"
                  }
                >
                  <span className="block text-lg font-bold">{event.day}</span>
                  <span className="block text-xs uppercase">{event.month}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-display text-2xl font-bold text-text-primary">{event.title}</h3>
                <p className="mb-4 flex items-center gap-1 text-sm font-semibold text-text-secondary">
                  <Icon name="location" className="h-4 w-4" />
                  {event.location}
                </p>
                <button className="w-full rounded-full border-2 border-primary py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                  Ver Detalhes
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
