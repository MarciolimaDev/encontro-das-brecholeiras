import Image from "next/image";
import { heroImage } from "./data";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      <Image src={heroImage} alt="Feira de moda circular" fill priority className="object-cover brightness-50" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c]/80 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-container items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <span className="mb-4 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-[#1c1c1c]">
            Circular &amp; Sustentável
          </span>
          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Moda Circular, Consumo Consciente e Comunidade
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-8 text-[#fff3f7]">
            Transformando a maneira como consumimos moda através de uma rede vibrante de empreendedoras e entusiastas do
            reuso.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="rounded-full bg-primary px-10 py-4 font-display text-2xl font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-primary-dark"
              href="#newsletter"
            >
              Quero Participar
            </a>
            <a
              className="rounded-full border-2 border-white px-10 py-4 font-display text-2xl font-bold text-white transition hover:bg-white/10"
              href="#missao"
            >
              Saiba Mais
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
