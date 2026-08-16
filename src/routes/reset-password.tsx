import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Restablecer contraseña — RIQSIN" },
      { name: "description", content: "Definí una nueva contraseña para tu cuenta RIQSIN." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const errDesc = url.searchParams.get("error_description") ?? hash.get("error_description");
      if (errDesc) {
        setLinkError(errDesc);
        return;
      }

      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && !cancelled) return setLinkError(error.message);
      } else if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
        if (error && !cancelled) return setLinkError(error.message);
      }

      for (let i = 0; i < 20; i += 1) {
        const { data } = await supabase.auth.getSession();
        if (data.session) break;
        await new Promise((r) => setTimeout(r, 150));
      }
      if (cancelled) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setLinkError("El enlace es inválido o ya expiró. Pedí uno nuevo desde “¿Olvidaste tu contraseña?”.");
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Mínimo 8 caracteres");
    if (password !== confirm) return setError("Las contraseñas no coinciden");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/perfil" });
  }

  if (linkError) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-border/60 bg-white/70 p-8 text-center shadow-[0_8px_40px_-16px_rgba(0,0,0,0.15)] backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-foreground">Enlace no válido</h1>
          <p className="mt-3 text-sm text-muted-foreground">{linkError}</p>
          <a
            href="/recuperar-contrasena"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            Pedir un nuevo enlace
          </a>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Validando el enlace…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border/60 bg-white/70 p-8 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Nueva contraseña</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Contraseña</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Confirmar contraseña</span>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60">
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </main>
  );
}