import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Restablecer contraseña — RIQSIN" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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