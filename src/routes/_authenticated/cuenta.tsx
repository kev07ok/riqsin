import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/cuenta")({
  head: () => ({ meta: [{ title: "Mi cuenta — RIQSIN" }] }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, public_alias")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile) {
        setFullName(profile.full_name ?? "");
        setAlias(profile.public_alias ?? "");
      }
    })();
  }, []);

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="animate-fade-in">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Mi cuenta</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
          Hola{fullName ? `, ${fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">{email}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card title="Mi progreso" desc="Seguí tu avance por niveles y evaluaciones.">
            <Link to="/metodo" className="text-sm font-medium text-foreground hover:underline">Ver método →</Link>
          </Card>
          <Card title="Pregunta diaria" desc="Sostené tu racha con una reflexión por día.">
            <span className="text-sm text-muted-foreground">Próximamente</span>
          </Card>
          <Card title="Comunidad" desc="Alias público: {alias}">
            <span className="text-sm text-muted-foreground">{alias || "Sin alias"}</span>
          </Card>
          <Card title="Historial" desc="Tu registro personal de actividad.">
            <span className="text-sm text-muted-foreground">Próximamente</span>
          </Card>
        </div>

        <button onClick={onSignOut} className="mt-10 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/60">
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-[0_8px_40px_-24px_rgba(0,0,0,0.15)] backdrop-blur-xl transition hover:shadow-[0_12px_48px_-20px_rgba(0,0,0,0.2)]">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}