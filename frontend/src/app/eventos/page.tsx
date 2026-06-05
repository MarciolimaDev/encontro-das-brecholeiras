import type { Metadata } from "next";
import { EventCard } from "@/components/events/EventCard";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { getPublicEvents } from "@/lib/public-events";

export const metadata: Metadata = {
  title: "Eventos | Encontro das Brecholeiras",
  description: "Próximos eventos, feirinhas e festivais do Encontro das Brecholeiras.",
};

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background py-14">
          <div className="mx-auto max-w-container px-6">
            <div className="mb-10 max-w-3xl">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
                Agenda
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold text-text-primary md:text-5xl">
                Próximos Eventos
              </h1>
              <p className="mt-3 text-text-secondary">
                Acompanhe as feirinhas, festivais e encontros publicados pelo painel administrativo.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard event={event} key={event.id} tone={index % 2 === 0 ? "primary" : "secondary"} />
              ))}
            </div>

            {events.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
                <p className="font-display text-2xl font-bold text-text-primary">Nenhum evento publicado no momento.</p>
                <p className="mt-2 text-text-secondary">Quando um evento for publicado no admin, ele aparece nesta página.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
