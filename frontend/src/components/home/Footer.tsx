"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { logoUrl } from "./data";
import { Icon } from "./Icon";

const quickLinks = ["Início", "Eventos", "Produtos"];
const institutionalLinks = ["Termos de Uso", "Privacidade", "Contato"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#f5dde1]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-container flex-col items-center justify-between gap-10 px-6 py-10 md:flex-row"
      >
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt="Logo Footer"
              width={110}
              height={40}
              className="h-10 w-auto grayscale"
              style={{ width: "auto" }}
            />
            <span className="font-display text-2xl font-bold text-primary">Brecholeiras</span>
          </div>
          <p className="max-w-sm text-center leading-6 text-text-secondary md:text-left">
            © 2024 Associação Encontro das Brecholeiras. Moda Circular e Sustentável.
          </p>
          <div className="flex gap-4 text-primary">
            {(["public", "camera", "mail"] as const).map((icon) => (
              <motion.a key={icon} whileHover={{ y: -3, scale: 1.08 }} className="transition" href="#">
                <Icon name={icon} className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <FooterLinks title="Links Rápidos" links={quickLinks} />
          <FooterLinks title="Institucional" links={institutionalLinks} />
        </div>
      </motion.div>
      <div className="border-t border-border py-4 text-center">
        <p className="text-xs text-text-secondary/60">Desenvolvido com carinho para a moda sustentável.</p>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">{title}</h2>
      {links.map((link) => (
        <a key={link} className="text-text-secondary transition hover:text-primary" href="#">
          {link}
        </a>
      ))}
    </div>
  );
}
