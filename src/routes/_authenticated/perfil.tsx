import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil — RIQSIN" }] }),
  component: PerfilPage,
});

interface Profile {
  full_name: string | null;
  public_alias: string | null;
  avatar_url: string | null;
}

function PerfilPage() {
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [profile, setProfile] = useState<Profile>({ full_name: "", public_alias: "", avatar_url: "" });
  const [alias, setAlias] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("Sin comenzar");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      setCreatedAt(u.user.created_at ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, public_alias, avatar_url")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) {
        setProfile(p);
        setAlias(p.public_alias ?? "");
      }
      const { data: prog } = await supabase
        .from("user_level_progress")
        .select("progress_percentage, levels(name, position)")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (prog?.levels) {
        // @ts-expect-error nested select
        setCurrentLevel(prog.levels.name);
        setPercent(Number(prog.progress_percentage) || 0);
      }
    })();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ public_alias: alias.trim() || null })
      .eq("id", u.user.id);
    setSaving(false);
    setStatus(error ? error.message : "Guardado");
  }

  const initial = (profile.full_name || email || "R").trim().charAt(0).toUpperCase();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 animate-fade-in">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cuenta</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Mi perfil</h1>

      <section className="mt-10 rounded-3xl border border-border/60 bg-white/70 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-border" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-green text-2xl font-semibold text-white">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-foreground">{profile.full_name || "Sin nombre"}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <form onSubmit={onSave} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-foreground/80">Nombre público</span>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej. Kevin A."
              maxLength={40}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </label>
          <Info label="Correo" value={email} />
          <Info label="Miembro desde" value={createdAt ? new Date(createdAt).toLocaleDateString("es-AR") : "—"} />
          <Info label="Nivel actual" value={currentLevel} />
          <Info label="Estado general" value={`${Math.round(percent)}% de tu nivel activo`} />
          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            {status && <span className="text-sm text-muted-foreground">{status}</span>}
          </div>
        </form>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-white/50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}