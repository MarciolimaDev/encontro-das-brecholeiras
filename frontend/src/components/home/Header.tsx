import Image from "next/image";
import { logoUrl, navItems } from "./data";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-container items-center justify-between gap-6 px-6">
        <a className="flex min-w-0 items-center gap-4" href="#">
          <Image
            src={logoUrl}
            alt="Brecholeiras Logo"
            width={132}
            height={48}
            priority
            className="h-12 w-auto"
            style={{ width: "auto" }}
          />
          <span className="hidden font-display text-2xl font-bold text-primary sm:inline">Brecholeiras</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item, index) => (
            <a
              key={item}
              className={
                index === 0
                  ? "border-b-2 border-primary pb-1 text-sm font-semibold text-primary"
                  : "text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
              }
              href="#"
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="/cadastro"
          className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark active:scale-95"
        >
          Quero Participar
        </a>
      </div>
    </header>
  );
}
