import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getLevelBySlug, levels } from "../data/levels";

export const Route = createFileRoute("/metodo/$slug")({
  loader: ({ params }) => {
    const level = getLevelBySlug(params.slug);
    if (!level) throw notFound();
    return { level };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Nivel no encontrado — RIQSIN" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const l = loaderData.level;
    const title = `${l.name} — El Método RIQSIN`;
    return {
      meta: [
        { title },
        { name: "description", content: l.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: l.shortDescription },
      ],
    };
  },
  component: LevelPage,
  notFoundComponent: LevelNotFound,
  errorComponent: LevelError,
});

function LevelPage() {
  const { level } = Route.useLoaderData();
  const isLegado = level.slug === "legado";
  const hasPayment = level.paymentUrl.trim().length > 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24 animate-fade-in">
      <Link
        to="/metodo"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> Todos los niveles
      </Link>

      <header className="mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Nivel {String(level.id).padStart(2, "0")}
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {level.name}
        </h1>
        <p className="mt-4 text-lg text-gradient-brand sm:text-xl">
          {level.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">Duración:</span> {level.duration}
          </span>
          <span>
            <span className="font-medium text-foreground">Precio:</span> {level.price}
          </span>
        </div>
      </header>

      <section className="mt-10 rounded-3xl border border-border bg-white/60 p-8 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
          {level.fullDescription}
        </p>
      </section>

      <Section title="A quién está dirigido" items={level.audience} />
      <Section title="Objetivos" items={level.objectives} />
      <Section title="Qué incluye" items={level.includes} />
      <Section title="Temas principales" items={level.topics} />
      {level.materials && level.materials.length > 0 && (
        <Section title="Materiales incluidos" items={level.materials} />
      )}

      {level.access && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Forma de acceso
          </h2>
          <p className="mt-3 text-base text-foreground/80">{level.access}</p>
        </div>
      )}

      {level.faq && level.faq.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Preguntas frecuentes
          </h2>
          <div className="mt-4 space-y-4">
            {level.faq.map((f) => (
              <div
                key={f.question}
                className="rounded-2xl border border-border bg-white/50 p-5 backdrop-blur-sm"
              >
                <p className="font-medium text-foreground">{f.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-4 border-t border-border/60 pt-10 sm:flex-row sm:justify-between">
        <Link
          to="/metodo"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Volver a todos los niveles
        </Link>

        {isLegado ? (
          <span className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-brand-yellow/40 bg-brand-yellow-subtle px-8 py-3.5 text-sm font-medium text-foreground">
            Acceso por invitación
          </span>
        ) : hasPayment ? (
          <a
            href={level.paymentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)]"
          >
            Comprar este nivel
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-border bg-muted px-8 py-3.5 text-sm font-medium text-muted-foreground"
          >
            Compra disponible próximamente
          </span>
        )}
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base text-foreground/80"
          >
            <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LevelNotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center animate-fade-in">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Nivel no encontrado
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Este nivel no existe.
      </h1>
      <p className="mt-4 text-muted-foreground">
        Puede que el enlace esté mal escrito o que este nivel aún no forme parte
        del método.
      </p>
      <Link
        to="/metodo"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-all duration-300 hover:scale-[1.02]"
      >
        Volver a los niveles
      </Link>
      <p className="mt-8 text-xs text-muted-foreground">
        Niveles disponibles:{" "}
        {levels.map((l, i) => (
          <span key={l.slug}>
            <Link
              to="/metodo/$slug"
              params={{ slug: l.slug }}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {l.name}
            </Link>
            {i < levels.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
    </main>
  );
}

function LevelError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Ocurrió un error</h1>
      <p className="mt-2 text-muted-foreground">
        No pudimos cargar este nivel. Probá nuevamente.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        Reintentar
      </button>
    </main>
  );
}