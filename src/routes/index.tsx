import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "../assets/riqsin-logo-transparent.png.asset.json";

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

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* Subtle ambient background glow in brand colors */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-green/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[25rem] w-[25rem] rounded-full bg-brand-yellow/8 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center animate-fade-in">
        {/* Logo with glass base */}
        <div className="group mb-10 rounded-[2rem] bg-white/60 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl ring-1 ring-white/80 transition-transform duration-500 hover:scale-[1.02]">
          <img
            src={logoAsset.url}
            alt="RIQSIN logo"
            className="h-44 w-auto sm:h-52 md:h-60 drop-shadow-2xl"
          />
        </div>

        {/* Main title */}
        <h1 className="text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          RIQSIN
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg font-medium tracking-wide text-gradient-brand sm:text-xl md:text-2xl">
          Conócete. Contrólate. Evoluciona.
        </p>

        {/* Quote */}
        <blockquote className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            “Todo cambio externo comienza con el autoconocimiento, continúa con el autocontrol y culmina con la evolución personal”
          </p>
          <footer className="mt-3 text-sm font-medium text-foreground/80">
            — Kevin Arozamena
          </footer>
        </blockquote>

        {/* Coming soon */}
        <p className="mt-10 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
          Próximamente
        </p>

        {/* Instagram button */}
        <a
          href="https://www.instagram.com/kev07_ok/"
          target="_blank"
          rel="noreferrer noopener"
          className="mt-12 inline-flex items-center gap-3 rounded-full border border-border bg-white/70 px-8 py-3.5 text-sm font-medium text-foreground shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-brand-blue/40 hover:bg-white hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <InstagramIcon className="h-4 w-4" />
          Seguinos en Instagram
        </a>
      </div>

      {/* Footer hint */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} RIQSIN
        </p>
      </footer>
    </main>
  );
}
