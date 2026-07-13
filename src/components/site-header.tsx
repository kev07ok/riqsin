import { Link } from "@tanstack/react-router";
import logoAsset from "../assets/riqsin-logo-transparent.png.asset.json";

export function SiteHeader() {
  const linkBase =
    "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground";
  const activeClass = "text-foreground";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="RIQSIN" className="h-8 w-auto" />
          <span className="text-sm font-semibold tracking-[0.2em] text-foreground">
            RIQSIN
          </span>
        </Link>
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: activeClass }} className={linkBase}>
            Inicio
          </Link>
          <Link to="/metodo" activeProps={{ className: activeClass }} className={linkBase}>
            El método
          </Link>
          <a
            href="https://www.instagram.com/kev07_ok/"
            target="_blank"
            rel="noreferrer noopener"
            className={linkBase}
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground/70 sm:flex-row">
        <p>© {new Date().getFullYear()} RIQSIN. Todos los derechos reservados.</p>
        <p className="tracking-[0.2em] uppercase">Conócete · Contrólate · Evoluciona</p>
      </div>
    </footer>
  );
}