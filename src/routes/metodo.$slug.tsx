import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { crearPago } from "@/lib/pagos.functions";
import { getLevelBySlug, levels } from "../data/levels";
import { siteConfig, toRoman } from "../data/site";


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

function statusBadgeStyles(status: "disponible" | "en proceso" | "por invitación") {
  switch (status) {
    case "disponible":
      return "bg-brand-green-subtle text-brand-green";
    case "por invitación":
      return "bg-brand-yellow-subtle text-foreground/80";
    default:
      return "bg-brand-blue-subtle text-brand-blue";
  }
}

function statusBadgeLabel(status: "disponible" | "en proceso" | "por invitación") {
  if (status === "en proceso") return "En proceso";
  if (status === "por invitación") return "Por invitación";
  return "Disponible";
}

function LevelPage() {
  const { level } = Route.useLoaderData();
  const isLegado = level.slug === "legado";
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const iniciarPago = useServerFn(crearPago);

  async function onComprar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBuyError(null);
    setBuying(true);
    try {
      const res = await iniciarPago({ data: { nivel: level.slug, nombre, email } });
      window.location.href = res.initPoint;
    } catch (err: any) {
      setBuyError(err?.message ?? "No se pudo iniciar el pago. Intentá de nuevo.");
      setBuying(false);
    }
  }


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
          Nivel {toRoman(level.id)}
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {level.name}
        </h1>
        <p className="mt-4 text-lg text-gradient-brand sm:text-xl">
          {level.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">Precio:</span> {level.price}
          </span>
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeStyles(level.status)}`}>
            {statusBadgeLabel(level.status)}
          </span>
        </div>
      </header>

      {/* Progreso del nivel */}
      <section className="mt-10 rounded-3xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tu progreso</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{Math.round(percent)}%</p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              hasAccess
                ? "border-brand-green/40 bg-brand-green-subtle text-foreground"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {hasAccess ? "Acceso activo" : "Sin acceso"}
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow transition-all"
            style={{ width: `${Math.max(2, Math.round(percent))}%` }}
          />
        </div>
        {!hasAccess && !isLegado && level.status === "en proceso" && (
          <p className="mt-3 text-sm text-muted-foreground">
            El nivel {toRoman(level.id)} — {level.name} aún está en proceso.
            Los contenidos, módulos y evaluaciones se irán habilitando próximamente.
          </p>
        )}
        {!hasAccess && !isLegado && level.status !== "en proceso" && (
          <p className="mt-3 text-sm text-muted-foreground">
            Todavía no tenés acceso a este nivel. Podés revisar el contenido general debajo.
            Los módulos y evaluaciones se desbloquean una vez que adquirís el nivel.
          </p>
        )}
      </section>

      {/* Módulos (bloqueados si no hay acceso) */}
      {modules.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Módulos del nivel
          </h2>
          <ul className="mt-4 space-y-3">
            {modules.map((m) => (
              <li
                key={m.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white/60 p-5 backdrop-blur-sm"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {m.position}. {m.title}
                  </p>
                  {m.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  )}
                </div>
                {!hasAccess && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                    🔒 Bloqueado
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {level.id >= 2 && level.id <= 5 ? (
        <section className="mt-16 flex flex-col items-center rounded-3xl border border-border bg-white/60 px-8 py-16 text-center shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Nivel {toRoman(level.id)} — {level.name}
          </p>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Este nivel está en proceso.
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Para más información, seguí nuestro Instagram oficial.
          </p>
          <a
            href={siteConfig.instagramOfficialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)]"
          >
            Seguir {siteConfig.instagramOfficialHandle}
            <span aria-hidden="true">→</span>
          </a>
        </section>
      ) : (
        <>
          <section className="mt-10 rounded-3xl border border-border bg-white/60 p-8 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md">
            <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
              {level.fullDescription}
            </p>
          </section>

          <Section title="A quién está dirigido" items={level.audience} />
          <Section title="Objetivos" items={level.objectives} />
          <Section title="Qué incluye" items={level.includes} />
          <Section title="Temas principales" items={level.topics} />
          {level.subtopics && level.subtopics.length > 0 && (
            <Section title="Subtemas" items={level.subtopics} />
          )}
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
                {level.faq.map((f: { question: string; answer: string }) => (
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
        </>
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
            Acceso únicamente por invitación
          </span>
        ) : level.id >= 2 && level.id <= 5 ? (
          <span className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-border bg-muted px-8 py-3.5 text-sm font-medium text-muted-foreground">
            Nivel en proceso
          </span>
        ) : (
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <button
              type="button"
              onClick={onComprar}
              disabled={buying}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buying ? "Redirigiendo a Mercado Pago…" : "Comprar este nivel"}
            </button>
            {buyError && <span className="text-xs text-destructive">{buyError}</span>}
          </div>
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