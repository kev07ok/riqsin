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

      let { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        const code = url.searchParams.get("code");

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError && !cancelled) {
            setError(sessionError.message);
            return;
          }
          sessionData = data;
        } else if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError && !cancelled) {
            const current = await supabase.auth.getSession();
            if (!current.data.session) {
              setError(exchangeError.message);
              return;
            }
            sessionData = current.data;
          } else {
            sessionData = data;
          }
        }
      }

      for (let i = 0; i < 20 && !sessionData.session; i += 1) {
        await new Promise((r) => setTimeout(r, 150));
        const current = await supabase.auth.getSession();
        sessionData = current.data;
      }
      if (cancelled) return;

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
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