import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("Sin comenzar");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
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
        setFullName(p.full_name ?? "");
        await resolveAvatar(p.avatar_url);
      }
      const { data: prog } = await supabase
        .from("user_level_progress")
        .select("progress_percentage, levels(name, position)")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (prog?.levels) {
        const lv = prog.levels as unknown as { name: string };
        setCurrentLevel(lv.name);
        setPercent(Number(prog.progress_percentage) || 0);
      }
    })();
  }, []);

  async function resolveAvatar(url: string | null) {
    if (!url) { setAvatarPreview(null); return; }
    // If it's an http(s) URL (Google), use directly. Otherwise treat as storage path.
    if (/^https?:\/\//.test(url)) {
      setAvatarPreview(url);
      return;
    }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(url, 60 * 60);
    setAvatarPreview(data?.signedUrl ?? null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        public_alias: alias.trim() || null,
        full_name: fullName.trim() || null,
      })
      .eq("id", u.user.id);
    setSaving(false);
    setStatus(error ? error.message : "Cambios guardados correctamente ✓");
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 5 * 1024 * 1024) { setStatus("La imagen supera los 5 MB"); return; }
    setUploading(true);
    setStatus(null);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (up.error) { setUploading(false); setStatus(up.error.message); return; }
    const { error } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", userId);
    if (error) { setUploading(false); setStatus(error.message); return; }
    await resolveAvatar(path);
    setProfile((p) => ({ ...p, avatar_url: path }));
    setUploading(false);
    setStatus("Foto de perfil actualizada ✓");
  }

  const initial = (fullName || profile.full_name || email || "R").trim().charAt(0).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 animate-fade-in">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cuenta</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Mi perfil
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Tu información personal, el estado de tu cuenta y tu avance dentro del método RIQSIN.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Tarjeta de identidad */}
        <section className="lg:col-span-1 rounded-3xl border border-border/60 bg-white/70 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt=""
                className="h-28 w-28 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-green text-4xl font-semibold text-white">
                {initial}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-4 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-foreground transition hover:bg-white/70 disabled:opacity-60"
            >
              {uploading ? "Subiendo..." : "Cambiar foto"}
            </button>
            <p className="mt-5 text-xl font-semibold text-foreground">
              {fullName || profile.full_name || "Sin nombre"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-brand-green-subtle px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Cuenta activa
            </span>
          </div>

          <div className="mt-8 space-y-3">
            <Info label="Miembro desde" value={createdAt ? new Date(createdAt).toLocaleDateString("es-AR") : "—"} />
            <Info label="Nivel actual" value={currentLevel} />
            <Info label="Progreso del nivel activo" value={`${Math.round(percent)}%`} />
          </div>
        </section>

        {/* Formulario y datos */}
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border/60 bg-white/70 p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground">Datos personales</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Editá tu información y cómo te ven los demás dentro de la plataforma.
            </p>
            <form onSubmit={onSave} className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground/80">Nombre completo</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Kevin Arozamena"
                  maxLength={80}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </label>
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
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
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
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Estado del método</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{currentLevel}</p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-green to-brand-yellow transition-all"
                  style={{ width: `${Math.round(percent)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{Math.round(percent)}% completado</p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Fecha de registro</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {createdAt ? new Date(createdAt).toLocaleDateString("es-AR") : "—"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Gracias por acompañar este proceso.</p>
            </div>
          </div>
        </section>
      </div>
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