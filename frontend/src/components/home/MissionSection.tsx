import { missions } from "./data";
import { Icon } from "./Icon";

export function MissionSection() {
  return (
    <section id="missao" className="bg-white py-10">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-primary md:text-4xl">Nossa Missão</h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-secondary" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {missions.map((mission) => (
            <article
              key={mission.title}
              className="rounded-xl border border-border bg-surface p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <div
                className={
                  mission.tone === "primary"
                    ? "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary"
                    : "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20 text-4xl text-secondary-dark"
                }
              >
                <Icon name={mission.icon} className="h-9 w-9" />
              </div>
              <h3 className="mb-2 font-display text-2xl font-bold text-text-primary">{mission.title}</h3>
              <p className="leading-6 text-text-secondary">{mission.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
