import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { levels as staticLevels } from "@/data/levels";

export const Route = createFileRoute("/_authenticated/progreso")({
  head: () => ({ meta: [{ title: "Mi progreso — RIQSIN" }] }),
  component: ProgresoPage,
});

interface LevelProgress {
  slug: string;
  name: string;
  position: number;
  percent: number;
  completedModules: number;
  totalModules: number;
  status: "completado" | "en_proceso" | "bloqueado";
}

function ProgresoPage() {
  const [name, setName] = useState("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [lastActivity, setLastActivity] = useState<string>("");
  const [levelsProg, setLevelsProg] = useState<LevelProgress[]>([]);
  const [quizzesApproved, setQuizzesApproved] = useState(0);
  const [quizzesPending, setQuizzesPending] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setStartedAt(u.user.created_at ?? "");

      const { data: prof } = await supabase.from("profiles").select("full_name, public_alias").eq("id", u.user.id).maybeSingle();
      setName(prof?.full_name || prof?.public_alias || (u.user.email ?? ""));

      const { data: dbLevels } = await supabase.from("levels").select("id, slug, name, position, total_modules").order("position");
      const { data: prog } = await supabase.from("user_level_progress").select("level_id, progress_percentage, completed_modules, updated_at, completed_at").eq("user_id", u.user.id);
      const { data: attempts } = await supabase.from("quiz_attempts").select("passed").eq("user_id", u.user.id);

      if (attempts) {
        setQuizzesApproved(attempts.filter((a) => a.passed).length);
        setQuizzesPending(attempts.filter((a) => !a.passed).length);
      }

      const byId = new Map((prog ?? []).map((p) => [p.level_id, p]));
      const latest = (prog ?? []).map((p) => p.updated_at).sort().at(-1);
      if (latest) setLastActivity(latest);

      const merged: LevelProgress[] = (dbLevels ?? []).map((lv) => {
        const p = byId.get(lv.id);
        const percent = Number(p?.progress_percentage ?? 0);
        const total = lv.total_modules || staticLevels.find((s) => s.slug === lv.slug)?.includes.length || 0;
        return {
          slug: lv.slug,
          name: lv.name,
          position: lv.position,
          percent,
          completedModules: p?.completed_modules ?? 0,
          totalModules: total,
          status: p?.completed_at ? "completado" : percent > 0 ? "en_proceso" : "bloqueado",
        };
      });
      setLevelsProg(merged);
    })();
  }, []);

  const totalPercent = levelsProg.length
    ? Math.round(levelsProg.reduce((s, l) => s + l.percent, 0) / levelsProg.length)
    : 0;
  const currentLevel = levelsProg.find((l) => l.status === "en_proceso") ?? levelsProg[0];
  const nextObjective =
    levelsProg.find((l) => l.status !== "completado") ?? levelsProg[levelsProg.length - 1];

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 animate-fade-in">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tu proceso</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
        Hola{name ? `, ${name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Nivel actual: <span className="font-medium text-foreground">{currentLevel?.name ?? "Aún no comenzaste"}</span>
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Progreso general" value={`${totalPercent}%`} />
        <Stat label="Evaluaciones aprobadas" value={String(quizzesApproved)} />
        <Stat label="Evaluaciones pendientes" value={String(quizzesPending)} />
        <Stat
          label="Última actividad"
          value={lastActivity ? new Date(lastActivity).toLocaleDateString("es-AR") : "—"}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Camino RIQSIN</h2>
        <p className="mt-1 text-sm text-muted-foreground">Recorré los 6 niveles del método.</p>

        <div className="mt-6 space-y-3">
          {levelsProg.map((lv, i) => (
            <div
              key={lv.slug}
              className="rounded-2xl border border-border/60 bg-white/70 p-5 backdrop-blur-xl transition hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                    lv.status === "completado"
                      ? "bg-brand-green text-white"
                      : lv.status === "en_proceso"
                      ? "gradient-brand text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {toRoman(i + 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{lv.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lv.completedModules}/{lv.totalModules || "—"} módulos · {Math.round(lv.percent)}%
                    </p>
                  </div>
                </div>
                <Link
                  to="/metodo/$slug"
                  params={{ slug: lv.slug }}
                  className="shrink-0 text-sm font-medium text-foreground hover:underline"
                >
                  Ver nivel →
                </Link>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full gradient-brand transition-all" style={{ width: `${lv.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Próximo objetivo</p>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {nextObjective ? `Avanzar en ${nextObjective.name}` : "Completaste todos los niveles"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Comenzaste el {startedAt ? new Date(startedAt).toLocaleDateString("es-AR") : "—"}.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/70 p-5 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function toRoman(n: number): string {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}