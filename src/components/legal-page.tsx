import type { ReactNode } from "react";
import { legalData } from "../data/legal";

export interface LegalSection {
  title: string;
  body: string | string[];
}

export function LegalPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro?: ReactNode;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:py-24 animate-fade-in">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        {legalData.brandName}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-xs text-muted-foreground">
        Documento informativo sujeto a revisión antes del lanzamiento comercial.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Última actualización: {legalData.lastUpdated}.
      </p>

      {intro && (
        <div className="mt-8 rounded-2xl border border-border bg-white/60 p-6 text-sm leading-relaxed text-foreground/80 backdrop-blur-md">
          {intro}
        </div>
      )}

      <div className="mt-10 space-y-10">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-foreground">
              {i + 1}. {s.title}
            </h2>
            {Array.isArray(s.body) ? (
              <ul className="mt-3 space-y-2">
                {s.body.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{s.body}</p>
            )}
          </section>
        ))}
      </div>

      {children}

      <div className="mt-14 space-y-1 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>Titular: {legalData.ownerName}.</p>
        {legalData.contactEmail && <p>Contacto: {legalData.contactEmail}.</p>}
        {legalData.businessAddress && <p>Domicilio: {legalData.businessAddress}.</p>}
        {legalData.taxId && <p>CUIT: {legalData.taxId}.</p>}
        <p>Jurisdicción: {legalData.country}.</p>
      </div>
    </main>
  );
}