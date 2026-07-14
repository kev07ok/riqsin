import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/recuperar-contrasena")({
  head: () => ({ meta: [{ title: "Recuperar contraseña — RIQSIN" }] }),
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMsg(null); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return setError(error.message);
    setMsg("Si el correo existe, te enviamos un enlace para restablecer tu contraseña.");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border/60 bg-white/70 p-8 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.15)] backdrop-blur-xl animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">Te enviaremos un enlace por correo.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Correo electrónico</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60">
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link to="/iniciar-sesion" className="hover:text-foreground">← Volver a iniciar sesión</Link>
        </p>
      </div>
    </main>
  );
}