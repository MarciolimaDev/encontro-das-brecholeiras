import Image from "next/image";
import Link from "next/link";
import { logoUrl, navItems } from "./data";

const navHref: Record<string, string> = {
  "InÃ­cio": "/",
  Eventos: "/eventos",
  Brecholeiras: "/brecholeiras",
  Produtos: "/produtos",
  "Sobre NÃ³s": "/#sobre",
};

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-container items-center justify-between gap-6 px-6">
        <Link className="flex min-w-0 items-center gap-4" href="/">
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
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item, index) => (
            <Link
              key={item}
              className={
                index === 0
                  ? "border-b-2 border-primary pb-1 text-sm font-semibold text-primary"
                  : "text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
              }
              href={navHref[item] ?? "/"}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/cadastro"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark active:scale-95 sm:inline-flex"
          >
            Quero Participar
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white active:scale-95"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
