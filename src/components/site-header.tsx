import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoAsset from "../assets/riqsin-logo-transparent.png.asset.json";
import { siteConfig } from "../data/site";
import { supabase } from "@/integrations/supabase/client";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="shrink-0" />
          <Link to="/" aria-label="Ir al inicio" className="flex items-center">
            <img src={logoAsset.url} alt="RIQSIN" className="h-9 w-auto sm:h-10" />
          </Link>
        </div>
        {!authed && (
          <Link
            to="/iniciar-sesion"
            className="rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-white"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-white/40 py-14 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold tracking-[0.2em] text-foreground">RIQSIN</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Conócete. Contrólate. Evoluciona.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/80">
              Navegación
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Inicio</Link></li>
              <li><Link to="/metodo" className="hover:text-foreground">El método</Link></li>
              <li><Link to="/autor" className="hover:text-foreground">Autor</Link></li>
              {siteConfig.instagramUrl && (
                <li>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-foreground"
                  >
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/80">
              Información legal
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terminos" className="hover:text-foreground">Términos y condiciones</Link></li>
              <li><Link to="/privacidad" className="hover:text-foreground">Política de privacidad</Link></li>
              <li><Link to="/reembolsos" className="hover:text-foreground">Política de compra y reembolsos</Link></li>
              <li><Link to="/propiedad-intelectual" className="hover:text-foreground">Propiedad intelectual</Link></li>
              <li><Link to="/aviso-legal" className="hover:text-foreground">Aviso legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-2 border-t border-border/60 pt-8 text-xs leading-relaxed text-muted-foreground/80">
          <p>© {year} RIQSIN. Todos los derechos reservados.</p>
          <p>Autor y titular del contenido: Kevin Arozamena.</p>
          <p>
            Queda prohibida la reproducción, distribución, comercialización, publicación o modificación total o parcial de los contenidos sin autorización expresa y por escrito de su titular.
          </p>
          <p>
            RIQSIN es un método educativo de desarrollo personal. No ofrece diagnósticos, tratamientos médicos, psicológicos, psiquiátricos, nutricionales ni garantías de resultados.
          </p>
        </div>
      </div>
    </footer>
  );
}