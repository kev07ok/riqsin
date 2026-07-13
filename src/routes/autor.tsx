import { createFileRoute } from "@tanstack/react-router";
import { author } from "../data/author";

export const Route = createFileRoute("/autor")({
  head: () => ({
    meta: [
      { title: "Sobre el autor — RIQSIN" },
      {
        name: "description",
        content:
          "Kevin Arozamena, creador y autor del Método RIQSIN: autoconocimiento, disciplina, hábitos y propósito.",
      },
      { property: "og:title", content: "Sobre el autor — RIQSIN" },
      {
        property: "og:description",
        content: "Creador y autor del Método RIQSIN.",
      },
    ],
  }),
  component: AutorPage,
});

function AutorPage() {
  const hasEducation = author.education.length > 0;
  const hasExperience = author.experience.length > 0;
  const hasCollaborators = author.collaborators.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-20 sm:py-24 animate-fade-in">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Sobre el autor
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        {author.name}
      </h1>
      <p className="mt-4 text-lg text-gradient-brand sm:text-xl">{author.role}</p>

      <section className="mt-10 space-y-5 rounded-3xl border border-border bg-white/60 p-8 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md">
        {author.biography.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/80 sm:text-lg">
            {p}
          </p>
        ))}
      </section>

      {/* Formación y experiencia */}
      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Formación y experiencia
        </h2>

        {hasEducation ? (
          <ul className="mt-4 space-y-3">
            {author.education.map((e, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-white/50 p-5 backdrop-blur-sm"
              >
                <p className="font-medium text-foreground">{e.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {e.institution} · {e.year}
                </p>
                {e.credentialUrl && (
                  <a
                    href={e.credentialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-block text-sm text-brand-blue hover:underline"
                  >
                    Ver credencial
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm italic text-muted-foreground">
            Información en actualización.
          </p>
        )}

        {hasExperience && (
          <ul className="mt-6 space-y-3">
            {author.experience.map((e, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-white/50 p-5 backdrop-blur-sm"
              >
                <p className="font-medium text-foreground">
                  {e.role} — {e.organization}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {e.period}
                </p>
                <p className="mt-2 text-sm text-foreground/80">{e.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {hasCollaborators && (
        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Colaboradores
          </h2>
          <ul className="mt-4 space-y-3">
            {author.collaborators.map((c, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border bg-white/50 p-5 backdrop-blur-sm"
              >
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.role}</p>
                <p className="mt-2 text-sm text-foreground/80">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Principios del autor
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {author.principles.map((p) => (
            <li
              key={p}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white/50 px-5 py-4 text-sm text-foreground/80 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 rounded-2xl border border-border bg-brand-yellow-subtle/40 p-5 text-sm leading-relaxed text-foreground/80">
        {author.disclaimer}
      </p>
    </main>
  );
}