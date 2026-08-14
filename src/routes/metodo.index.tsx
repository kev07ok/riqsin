import { createFileRoute, Link } from "@tanstack/react-router";
import { levels, type LevelStatus } from "../data/levels";
import { toRoman } from "../data/site";

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
  if (status === "en proceso") return "En desarrollo";
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

      {/* Pilares */}
      <section className="mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Los pilares
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            ¿Por qué RIQSIN?
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              style={{ animationDelay: `${i * 60}ms` }}
              className="rounded-2xl border border-border bg-white/60 p-6 backdrop-blur-md animate-fade-in"
            >
              <PillarIcon name={p.icon} className="h-6 w-6 text-brand-blue" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                {p.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recorrido */}
      <section className="mt-20">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {levels.map((l, i) => (
            <div key={l.slug} className="flex items-center gap-3">
              <span
                className="inline-flex h-10 min-w-[2.75rem] items-center justify-center rounded-full border border-border bg-white/70 px-3 text-sm font-semibold tracking-wider text-foreground backdrop-blur-md"
                title={l.name}
              >
                {toRoman(l.id)}
              </span>
              {i < levels.length - 1 && (
                <span aria-hidden="true" className="text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-col gap-8">
        {levels.map((level, i) => (
          <article
            key={level.slug}
            style={{ animationDelay: `${i * 60}ms` }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-white/60 p-10 sm:p-12 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)] animate-fade-in"
          >
            {/* Línea de degradado en hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow transition-transform duration-500 group-hover:scale-x-100"
            />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Nivel {toRoman(level.id)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyles(level.status)}`}
              >
                {statusLabel(level.status)}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {level.name}
            </h2>
            <p className="mt-1 text-base text-gradient-brand">{level.subtitle}</p>

            {level.id !== 2 && level.id !== 3 && level.id !== 4 && level.id !== 5 && (
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                {level.shortDescription}
              </p>
            )}
            <div className="mt-8 flex items-center justify-end border-t border-border/60 pt-6">
              <Link
                to="/metodo/$slug"
                params={{ slug: level.slug }}
                className="inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors group-hover:text-brand-blue"
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

const PILLARS = [
  {
    title: "Autoconocimiento",
    icon: "eye" as const,
    description:
      "Comprender tu mente, tus decisiones y los patrones que dirigen tu vida.",
  },
  {
    title: "Disciplina",
    icon: "compass" as const,
    description:
      "Aprender a actuar con dirección incluso cuando la motivación desaparece.",
  },
  {
    title: "Sistemas",
    icon: "grid" as const,
    description:
      "Construir estructuras que faciliten el progreso y reduzcan la dependencia de la fuerza de voluntad.",
  },
  {
    title: "Propósito",
    icon: "target" as const,
    description:
      "Darles una dirección más profunda y consciente a tus acciones.",
  },
];

function PillarIcon({ name, className }: { name: "eye" | "compass" | "grid" | "target"; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "eye") return (
    <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
  );
  if (name === "compass") return (
    <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" /></svg>
  );
  if (name === "grid") return (
    <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
  );
  return (
    <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>
  );
}