import Image from "next/image";
import { brecholeiras } from "./data";

export function FeaturedBrecholeirasSection() {
  return (
    <section className="bg-[#fff0f4] py-10">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-text-primary md:text-4xl">Brecholeiras em Destaque</h2>
          <p className="text-text-secondary">Conheça as curadoras que fazem a moda circular acontecer</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {brecholeiras.map((person) => (
            <article key={person.handle} className="group text-center">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
