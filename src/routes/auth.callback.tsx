import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Iniciando sesión — RIQSIN" },
      { name: "description", content: "Validando tu acceso a RIQSIN." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CallbackPage,
});

function safePath(value: string | null): string {
  if (!value) return "/perfil";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/perfil";
}

function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const errDesc = url.searchParams.get("error_description") ?? hash.get("error_description");
      if (errDesc) {
        setError(errDesc);
        return;
      }

      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && !cancelled) {
          setError(error.message);
          return;
        }
      }

      // Give detectSessionInUrl / setSession a moment to land.
      for (let i = 0; i < 20; i += 1) {
        const { data } = await supabase.auth.getSession();
        if (data.session) break;
        await new Promise((r) => setTimeout(r, 150));
      }
      if (cancelled) return;

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("No pudimos completar el inicio de sesión. Intentá de nuevo.");
        return;
      }

      const dest = safePath(sessionStorage.getItem("riqsin:redirect"));
      sessionStorage.removeItem("riqsin:redirect");
      navigate({ to: dest as "/", replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      {error ? (
        <>
          <h1 className="text-2xl font-semibold text-foreground">No pudimos iniciar sesión</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <a
            href="/iniciar-sesion"
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            Volver a iniciar sesión
          </a>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Validando tu acceso…</p>
      )}
    </main>
  );
}