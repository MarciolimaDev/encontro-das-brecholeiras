"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { brecholeiras } from "./data";

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

export function FeaturedBrecholeirasSection() {
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
          {brecholeiras.map((person) => (
            <motion.article
              key={person.handle}
              variants={item}
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="group text-center"
            >
              <div
                className={
                  person.tone === "primary"
                    ? "relative mb-4 h-32 w-32 rounded-full border-4 border-primary p-1 transition group-hover:scale-105"
                    : "relative mb-4 h-32 w-32 rounded-full border-4 border-secondary-dark p-1 transition group-hover:scale-105"
                }
              >
                <Image src={person.image} alt={person.name} fill className="rounded-full object-cover p-1" sizes="128px" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{person.name}</h3>
              <p className="text-xs text-primary">{person.handle}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
