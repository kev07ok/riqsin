import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme, type Theme } from "@/lib/theme";

export const Route = createFileRoute("/_authenticated/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — RIQSIN" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<string>("email");
  const [alias, setAlias] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      setProvider(data.user.app_metadata?.provider ?? "email");
      const { data: p } = await supabase.from("profiles").select("public_alias").eq("id", data.user.id).maybeSingle();
      setAlias(p?.public_alias ?? "");
    })();
  }, []);

  async function saveAlias() {
    setMsg(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { error } = await supabase.from("profiles").update({ public_alias: alias.trim() || null }).eq("id", data.user.id);
    setMsg(error ? error.message : "Nombre público actualizado");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (newPassword.length < 8) return setMsg("La contraseña debe tener al menos 8 caracteres");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setMsg(error ? error.message : "Contraseña actualizada");
    if (!error) setNewPassword("");
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setMsg(error ? error.message : "Te enviamos un correo para confirmar el cambio");
    if (!error) setNewEmail("");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 animate-fade-in space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Ajustes</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Configuración</h1>
      </div>

      <Section title="Nombre público" description="Se muestra en la comunidad si activás tu visibilidad.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={40}
            className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          <button onClick={saveAlias} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90">Guardar</button>
        </div>
      </Section>

      <Section title="Apariencia" description="Elegí el tema visual de la web.">
        <div className="flex gap-2">
          {(["light", "dark", "system"] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                theme === t ? "border-foreground bg-foreground text-background" : "border-border bg-white hover:bg-white/70"
              }`}
            >
              {t === "light" ? "Claro" : t === "dark" ? "Oscuro" : "Sistema"}
            </button>
          ))}
        </div>
      </Section>

      {provider === "email" && (
        <>
          <Section title="Cambiar contraseña" description="Mínimo 8 caracteres.">
            <form onSubmit={changePassword} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                autoComplete="new-password"
                className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90">Actualizar</button>
            </form>
          </Section>

          <Section title="Cambiar correo" description={`Actual: ${email}`}>
            <form onSubmit={changeEmail} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nuevo@correo.com"
                className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90">Solicitar cambio</button>
            </form>
          </Section>
        </>
      )}

      {msg && <p className="rounded-lg border border-border bg-white/70 px-4 py-2 text-sm text-foreground/80">{msg}</p>}

      <Section title="Sesión" description="Cerrá sesión en este dispositivo.">
        <button onClick={signOut} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/60">
          Cerrar sesión
        </button>
      </Section>
    </main>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}