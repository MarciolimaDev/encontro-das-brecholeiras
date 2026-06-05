import Image from "next/image";
import Link from "next/link";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, type PublicProduct } from "@/lib/public-events";

export function ProductDetailPage({ product }: { product: PublicProduct }) {
  const imageSrc = product.image || fallbackEventImage;
  const brandImage = product.brand.owner.profile_photo || product.brand.logo || fallbackEventImage;
  const location = [product.brand.city, product.brand.uf].filter(Boolean).join(", ");

  return (
    <main className="pt-20">
      <section className="bg-background py-10">
        <div className="mx-auto max-w-container px-6">
          <Link className="text-sm font-bold text-primary transition hover:text-primary-dark" href="/produtos">
            Voltar para produtos
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-[#ffe8ed]">
                <Image
                  src={imageSrc}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  priority
                  unoptimized={isBackendMediaUrl(imageSrc)}
                />
              </div>
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {product.category.name && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{product.category.name}</span>}
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-extrabold text-secondary-dark">{product.status_label}</span>
                </div>

                <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-text-primary">{product.title}</h1>
                <p className="mt-4 font-display text-3xl font-extrabold text-primary">{product.price}</p>

                <div className="mt-6 border-t border-border pt-6">
                  <h2 className="font-display text-xl font-bold text-text-primary">Descrição</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-secondary">
                    {product.description || "Produto cadastrado pela loja. Entre em contato com o brechó para conferir disponibilidade e detalhes."}
                  </p>
                </div>
              </article>

              <article className="rounded-3xl border border-border bg-[#fff0f4] p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-primary bg-white p-1">
                    <Image
                      src={brandImage}
                      alt={product.brand.owner.name || product.brand.name}
                      fill
                      className="rounded-full object-cover p-1"
                      sizes="80px"
                      unoptimized={isBackendMediaUrl(brandImage)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Brechó</p>
                    <h2 className="mt-1 truncate font-display text-2xl font-extrabold text-text-primary">{product.brand.name}</h2>
                    {product.brand.instagram && <p className="mt-1 truncate text-sm font-bold text-primary">@{product.brand.instagram}</p>}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-text-secondary">
                  <InfoRow label="Responsável" value={product.brand.owner.name || "Não informado"} />
                  <InfoRow label="Segmento" value={product.brand.segment || "Não informado"} />
                  <InfoRow label="Localização" value={location || "Não informada"} />
                  <InfoRow label="Produtos ativos" value={`${product.brand.products_count} produtos`} />
                </div>

                {product.brand.description && (
                  <p className="mt-5 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-text-secondary">{product.brand.description}</p>
                )}
              </article>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3">
      <span className="font-semibold">{label}</span>
      <strong className="text-right text-text-primary">{value}</strong>
    </div>
  );
}
