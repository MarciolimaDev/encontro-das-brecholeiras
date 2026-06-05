import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Icon } from "@/components/home/Icon";
import { isBackendMediaUrl } from "@/lib/images";
import { fallbackEventImage, getPublicEvent } from "@/lib/public-events";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEvent(slug);

  if (!event) {
    return {
      title: "Evento não encontrado | Encontro das Brecholeiras",
    };
  }

  return {
    title: `${event.title} | Encontro das Brecholeiras`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);

  if (!event) {
    notFound();
  }

  const imageSrc = event.banner || fallbackEventImage;

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background py-10 md:py-14">
          <div className="mx-auto max-w-container px-6">
            <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="/eventos">
              <Icon name="arrow-left" className="h-4 w-4" />
              Voltar para eventos
            </Link>

            <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative min-h-[320px] md:min-h-[460px]">
                <Image
                  src={imageSrc}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  unoptimized={isBackendMediaUrl(imageSrc)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-10">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide">
                      {event.event_type_label}
                    </span>
                    {event.registration_open && (
                      <span className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wide text-secondary-dark">
                        Inscrições abertas
                      </span>
                    )}
                  </div>
                  <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
                    {event.title}
                  </h1>
                </div>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-[1fr_340px] md:p-10">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary">Sobre o evento</h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-8 text-text-secondary">{event.description}</p>
                </div>

                <aside className="h-fit rounded-xl border border-border bg-background p-6">
                  <h3 className="font-display text-xl font-bold text-text-primary">Informações</h3>
                  <div className="mt-5 space-y-4 text-sm font-semibold text-text-secondary">
                    <p className="flex items-start gap-3">
                      <Icon name="calendar" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>
                        <strong className="block text-text-primary">Data e horário</strong>
                        {event.start_date_label}
                        <br />
                        até {event.end_date_label}
                      </span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="location" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>
                        <strong className="block text-text-primary">Local</strong>
                        {event.location_label}
                      </span>
                    </p>
                  </div>

                  <Link
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark"
                    href="/cadastro"
                  >
                    Quero participar
                  </Link>
                </aside>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
