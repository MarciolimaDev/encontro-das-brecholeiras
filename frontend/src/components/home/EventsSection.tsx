"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import type { PublicEvent } from "@/lib/public-events";

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

export function EventsSection({ events }: { events: PublicEvent[] }) {
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
          <Link className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline" href="/eventos">
            Ver todos os eventos <span aria-hidden="true">-&gt;</span>
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event, index) => (
            <motion.article
              key={event.id}
              variants={item}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <EventCard event={event} tone={index % 2 === 0 ? "primary" : "secondary"} />
            </motion.article>
          ))}
          {events.length === 0 && (
            <motion.div
              variants={item}
              className="rounded-xl border border-dashed border-border bg-background px-6 py-10 text-center md:col-span-2 lg:col-span-3"
            >
              <p className="font-display text-xl font-bold text-text-primary">Nenhum evento publicado no momento.</p>
              <p className="mt-2 text-sm text-text-secondary">Assim que um evento for publicado no painel, ele aparece aqui automaticamente.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
