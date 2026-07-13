import { createFileRoute, Link } from "@tanstack/react-router";
import { levels, type LevelStatus } from "../data/levels";

export const Route = createFileRoute("/metodo/")({
  head: () => ({
    meta: [
      { title: "El Método RIQSIN — Niveles" },
      {
        name: "description",
        content:
          "Un proceso progresivo para conocerte, controlarte y evolucionar. Descubrí los seis niveles del método RIQSIN.",
      },
      { property: "og:title", content: "El Método RIQSIN — Niveles" },
      {
        property: "og:description",
        content:
          "Un proceso progresivo para conocerte, controlarte y evolucionar.",
      },
    ],
  }),
  component: MetodoIndex,
});

function statusStyles(status: LevelStatus) {
  switch (status) {
    case "disponible":
      return "bg-brand-green-subtle text-brand-green";
    case "por invitación":
      return "bg-brand-yellow-subtle text-foreground/80";
    default:
      return "bg-brand-blue-subtle text-brand-blue";
  }
}

function statusLabel(status: LevelStatus) {
  if (status === "en proceso") return "Próximamente";
  if (status === "por invitación") return "Por invitación";
  return "Disponible";
}

function MetodoIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center animate-fade-in">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          El método
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          El Método RIQSIN
        </h1>
        <p className="mt-5 text-lg text-gradient-brand sm:text-xl">
          Un proceso progresivo para conocerte, controlarte y evolucionar.
        </p>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          RIQSIN está organizado en niveles. Cada etapa desarrolla una base
          necesaria para avanzar hacia la siguiente. No se trata de consumir
          información rápidamente, sino de aplicar, medir y construir un sistema
          personal.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level, i) => (
          <article
            key={level.slug}
            style={{ animationDelay: `${i * 60}ms` }}
            className="group relative flex flex-col rounded-3xl border border-border bg-white/60 p-8 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Nivel {String(level.id).padStart(2, "0")}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyles(level.status)}`}
              >
                {statusLabel(level.status)}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {level.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{level.duration}</p>
            <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/70">
              {level.shortDescription}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
              <span className="text-sm font-medium text-foreground">
                {level.price}
              </span>
              <Link
                to="/metodo/$slug"
                params={{ slug: level.slug }}
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand-blue"
              >
                Ver nivel
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}