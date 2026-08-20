import { createFileRoute, Link } from "@tanstack/react-router";
import { siteConfig } from "../data/site";

export const Route = createFileRoute("/gracias")({
  head: () => ({
    meta: [
      { title: "Compra recibida — RIQSIN" },
      {
        name: "description",
        content:
          "Recibimos tu compra del Método RIQSIN. Te enviamos el material por correo electrónico.",
      },
      { property: "og:title", content: "Compra recibida — RIQSIN" },
      {
        property: "og:description",
        content: "Recibimos tu compra del Método RIQSIN. Te enviamos el material por correo.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GraciasPage,
});

function GraciasPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center animate-fade-in">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Gracias
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Recibimos tu compra.
      </h1>
      <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
        En cuanto Mercado Pago confirme el pago, te enviamos el material del nivel al correo
        electrónico que indicaste. Si tenés alguna duda, escribinos por Instagram.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={siteConfig.instagramOfficialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-all duration-300 hover:scale-[1.02]"
        >
          Escribinos {siteConfig.instagramOfficialHandle}
        </a>
        <Link
          to="/metodo"
          className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/10"
        >
          Volver al método
        </Link>
      </div>
    </main>
  );
}
