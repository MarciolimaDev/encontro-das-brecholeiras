"use client";

import { motion } from "framer-motion";
import { missions } from "./data";
import { Icon } from "./Icon";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function MissionSection() {
  return (
    <section id="missao" className="bg-white py-14">
      <div className="mx-auto max-w-container px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={item}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 font-display text-3xl font-bold text-primary md:text-4xl">Nossa Missão</h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-secondary" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
          className="grid gap-6 md:grid-cols-3"
        >
          {missions.map((mission) => (
            <motion.article
              key={mission.title}
              variants={item}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="rounded-xl border border-border bg-surface p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={
                  mission.tone === "primary"
                    ? "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                    : "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20 text-secondary-dark"
                }
              >
                <Icon name={mission.icon} className="h-9 w-9" />
              </div>
              <h3 className="mb-2 font-display text-2xl font-bold text-text-primary">{mission.title}</h3>
              <p className="leading-6 text-text-secondary">{mission.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
