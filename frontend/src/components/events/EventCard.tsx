import Image from "next/image";
import Link from "next/link";
import { fallbackEventImage, type PublicEvent } from "@/lib/public-events";
import { isBackendMediaUrl } from "@/lib/images";
import { Icon } from "@/components/home/Icon";

export function EventCard({ event, tone = "primary" }: { event: PublicEvent; tone?: "primary" | "secondary" }) {
  const imageSrc = event.banner || fallbackEventImage;

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
          unoptimized={isBackendMediaUrl(imageSrc)}
        />
        <div
          className={
            tone === "primary"
              ? "absolute left-4 top-4 rounded-lg bg-primary px-4 py-1 text-center text-white shadow-md"
              : "absolute left-4 top-4 rounded-lg bg-secondary-dark px-4 py-1 text-center text-white shadow-md"
          }
        >
          <span className="block text-lg font-bold">{event.day}</span>
          <span className="block text-xs uppercase">{event.month}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {event.event_type_label}
          </span>
          {event.registration_open && (
            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-dark">
              Inscrições abertas
            </span>
          )}
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-text-primary">{event.title}</h3>
        <p className="mb-4 flex items-center gap-1 text-sm font-semibold text-text-secondary">
          <Icon name="location" className="h-4 w-4" />
          {event.location_label}
        </p>
        <Link
          className="block w-full rounded-full border-2 border-primary py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          href={`/eventos/${event.slug}`}
        >
          Ver Detalhes
        </Link>
      </div>
    </article>
  );
}
