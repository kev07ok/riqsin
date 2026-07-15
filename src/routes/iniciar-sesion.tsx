import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/iniciar-sesion")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [{ title: "Iniciar sesión — RIQSIN" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTo = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/perfil";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: redirectTo as string as "/" });
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return setError(result.error.message);
    if (result.redirected) return;
    navigate({ to: redirectTo as string as "/" });
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border/60 bg-white/70 p-8 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.15)] backdrop-blur-xl animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-muted-foreground">Volvé a tu proceso.</p>

        <button
          type="button"
          onClick={onGoogle}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white/60"
        >
          <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.4 2.4 30 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 6.9-10 6.9-17.5z"/><path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.7L2.5 13.3A24 24 0 000 24c0 3.9.9 7.6 2.5 10.7l7.9-6z"/><path fill="#34A853" d="M24 48c6 0 11-2 14.7-5.4l-7.6-5.9c-2.1 1.4-4.7 2.3-7.1 2.3-6.3 0-11.7-3.7-13.6-9.1l-7.9 6C6.5 42.6 14.6 48 24 48z"/></svg>
          Continuar con Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground/70">
          <div className="h-px flex-1 bg-border" />o<div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Correo electrónico" type="email" value={email} onChange={setEmail} required autoComplete="email" />
          <Field label="Contraseña" type="password" value={password} onChange={setPassword} required autoComplete="current-password" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/recuperar-contrasena" className="hover:text-foreground">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tenés cuenta? <Link to="/registro" className="font-medium text-foreground hover:underline">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange, required, autoComplete }: { label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
      />
    </label>
  );
}