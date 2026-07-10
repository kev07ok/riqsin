import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function RiqsinLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RIQSIN logo"
    >
      {/* Outer ring with brand gradient */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="url(#brand-gradient)"
        strokeWidth="2"
        strokeOpacity="0.9"
      />
      {/* Inner mark */}
      <path
        d="M60 30 L60 60 L84 60"
        stroke="url(#brand-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="60" r="8" fill="url(#brand-gradient)" />
      <defs>
        <linearGradient id="brand-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-blue)" />
          <stop offset="0.5" stopColor="var(--brand-green)" />
          <stop offset="1" stopColor="var(--brand-yellow)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-20 text-center">
      {/* Subtle ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-green/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[25rem] w-[25rem] rounded-full bg-brand-yellow/6 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center animate-fade-in">
        {/* Logo */}
        <div className="mb-10">
          <RiqsinLogo className="h-24 w-24 sm:h-28 sm:w-28 glow-brand-subtle rounded-full" />
        </div>

        {/* Main title */}
        <h1 className="text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          RIQSIN
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg font-medium tracking-wide text-gradient-brand sm:text-xl md:text-2xl">
          Conócete. Contrólate. Evoluciona.
        </p>

        {/* Description */}
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          Estamos construyendo una experiencia para ayudarte a desarrollar disciplina, hábitos y sistemas que cambian vidas.
        </p>

        {/* Coming soon */}
        <p className="mt-10 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
          Próximamente
        </p>

        {/* Instagram button */}
        <a
          href="#"
          className="mt-12 inline-flex items-center gap-3 rounded-full border border-border bg-secondary/50 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-brand-blue/40 hover:bg-secondary hover:glow-brand-subtle focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
