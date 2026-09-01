import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { siteConfig } from "../data/site";
import { author } from "../data/author";
import { ParticlesBackground } from "../components/particles-background";

// Pegá aquí la URL de YouTube (formato embed) o dejá "" para mostrar un
// placeholder. Ejemplo: "https://www.youtube.com/embed/VIDEO_ID"
const videoEmbedUrl = "";

export const Route = createFileRoute("/")({
  component: Index,
});

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-20 text-center">
      {/* Subtle ambient background glow in brand colors */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-green/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[25rem] w-[25rem] rounded-full bg-brand-yellow/8 blur-[100px]" />
      </div>

      {/* Fondo animado interactivo (partículas) */}
      <ParticlesBackground />

      {/* HERO */}
      <section className="relative z-10 flex min-h-[80vh] max-w-3xl flex-col items-center justify-center animate-fade-in">
        <h1 className="text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          RIQSIN
        </h1>

        <p className="mt-6 text-lg font-medium tracking-wide text-gradient-brand sm:text-xl md:text-2xl">
          Conócete. Contrólate. Evoluciona.
        </p>

        <blockquote className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            “Todo cambio externo comienza con el autoconocimiento, continúa con el autocontrol y culmina con la evolución personal”
          </p>
          <footer className="mt-3 text-sm font-medium text-foreground/80">
            — Kevin Arozamena
          </footer>
        </blockquote>

        <p className="mt-10 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
          RIQSIN está en proceso.
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Estamos construyendo un método progresivo para ayudarte a conocerte,
          desarrollar disciplina y crear sistemas que puedas mantener en el tiempo.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/metodo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background shadow-[0_8px_30px_-10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Conocé el método
          </Link>
          <a
            href={siteConfig.instagramOfficialUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-3 rounded-full border border-border bg-white/70 px-8 py-3.5 text-sm font-medium text-foreground shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-brand-blue/40 hover:bg-white hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram {siteConfig.instagramOfficialHandle}
          </a>
          {siteConfig.circularPdfUrl ? (
            <a
              href="/api/public/circular?inline=1"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-3 rounded-full border border-border bg-white/70 px-8 py-3.5 text-sm font-medium text-foreground shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-brand-blue/40 hover:bg-white hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <DownloadIcon className="h-4 w-4" />
              Descargar Circular
            </a>
          ) : null}

        </div>
      </section>

      {/* VIDEO */}
      <section className="relative z-10 mt-24 w-full max-w-4xl animate-fade-in">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Video
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Conocé Riqsin
        </h2>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-white/60 shadow-[0_8px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md">
          <div className="relative aspect-video w-full bg-muted">
            {videoEmbedUrl ? (
              <iframe
                src={videoEmbedUrl}
                title="Conocé Riqsin"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-border bg-white/70 backdrop-blur">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-sm">Video próximamente</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SOBRE EL AUTOR */}
      <section className="relative z-10 mt-24 w-full max-w-4xl text-left animate-fade-in">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Sobre el autor
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {author.name}
        </h2>
        <p className="mt-3 text-base text-gradient-brand sm:text-lg">{author.role}</p>

        <div className="mt-8 space-y-5 rounded-3xl border border-border bg-white/60 p-8 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {author.biography.split("\n\n").map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/80 sm:text-lg">
              {p}
            </p>
          ))}
        </div>


        <p className="mt-10 rounded-2xl border border-border bg-brand-yellow-subtle/40 p-5 text-sm leading-relaxed text-foreground/80">
          {author.disclaimer}
        </p>
      </section>
    </main>
  );
}
