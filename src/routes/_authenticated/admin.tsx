import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listarComprasAdmin, type CompraAdmin } from "@/lib/pagos.functions";
import { levels } from "@/data/levels";
import {
  isAdmin as isAdminFn,
  listLevelsForAdmin,
  listLevelQuestions,
  createLevelQuestion,
  updateLevelQuestion,
  deleteLevelQuestion,
  adminStats,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Panel administrador — RIQSIN" }] }),
  component: AdminPage,
});

interface Option { text: string; isCorrect: boolean }
interface Question {
  id: string;
  questionText: string;
  explanation: string | null;
  position: number;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
}
interface LevelRow { id: string; slug: string; name: string; position: number }

function AdminPage() {
  const checkAdmin = useServerFn(isAdminFn);
  const getLevels = useServerFn(listLevelsForAdmin);
  const getQuestions = useServerFn(listLevelQuestions);
  const createQ = useServerFn(createLevelQuestion);
  const updateQ = useServerFn(updateLevelQuestion);
  const deleteQ = useServerFn(deleteLevelQuestion);
  const getStats = useServerFn(adminStats);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [levels, setLevels] = useState<LevelRow[]>([]);
  const [levelId, setLevelId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<{ users: number; attempts: number; passed: number; dailyResponses: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<{ questionText: string; explanation: string; options: Option[] }>({
    questionText: "",
    explanation: "",
    options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }],
  });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await checkAdmin();
        setAllowed(r.isAdmin);
        if (r.isAdmin) {
          const [ls, s] = await Promise.all([getLevels(), getStats()]);
          setLevels(ls);
          setStats(s);
          if (ls[0]) setLevelId(ls[0].id);
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!levelId) return;
    setLoading(true);
    getQuestions({ data: { levelId } })
      .then((r) => setQuestions(r as Question[]))
      .finally(() => setLoading(false));
  }, [levelId]);

  function resetForm() {
    setEditing(null);
    setForm({
      questionText: "",
      explanation: "",
      options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }],
    });
  }

  function startEdit(q: Question) {
    setEditing(q);
    setForm({
      questionText: q.questionText,
      explanation: q.explanation ?? "",
      options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      if (editing) {
        await updateQ({ data: { id: editing.id, ...form } });
      } else {
        await createQ({ data: { levelId, ...form } });
      }
      const r = await getQuestions({ data: { levelId } });
      setQuestions(r as Question[]);
      resetForm();
      setMsg("Guardado");
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    await deleteQ({ data: { id } });
    const r = await getQuestions({ data: { levelId } });
    setQuestions(r as Question[]);
  }

  if (checking) {
    return <main className="mx-auto max-w-4xl px-6 py-14 text-muted-foreground">Verificando permisos…</main>;
  }

  if (!allowed) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center animate-fade-in">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Acceso restringido</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          No tenés permisos para acceder a esta sección.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Este panel está reservado para administradores autorizados de RIQSIN. Si creés que se trata de un error, contactá al equipo.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 animate-fade-in">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Panel administrador</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Administración</h1>

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Usuarios" value={stats.users} />
          <Stat label="Intentos" value={stats.attempts} />
          <Stat label="Aprobados" value={stats.passed} />
          <Stat label="Respuestas diarias" value={stats.dailyResponses} />
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Nivel</span>
            <select
              value={levelId}
              onChange={(e) => { setLevelId(e.target.value); resetForm(); }}
              className="mt-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue"
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.position}. {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <form
          onSubmit={onSave}
          className="mt-6 space-y-4 rounded-3xl border border-border/60 bg-white/70 p-6 backdrop-blur-xl"
        >
          <h2 className="text-lg font-semibold text-foreground">
            {editing ? "Editar pregunta" : "Nueva pregunta"}
          </h2>
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Pregunta</span>
            <textarea
              value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              required
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground/80">Explicación (opcional)</span>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue"
            />
          </label>
          <div>
            <p className="text-sm font-medium text-foreground/80">Opciones (marcá la correcta)</p>
            <div className="mt-2 space-y-2">
              {form.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={o.isCorrect}
                    onChange={() => setForm({
                      ...form,
                      options: form.options.map((op, j) => ({ ...op, isCorrect: j === i })),
                    })}
                    className="h-4 w-4"
                  />
                  <input
                    value={o.text}
                    onChange={(e) => setForm({
                      ...form,
                      options: form.options.map((op, j) => j === i ? { ...op, text: e.target.value } : op),
                    })}
                    required
                    placeholder={`Opción ${i + 1}`}
                    className="flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand-blue"
                  />
                  {form.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, options: form.options.filter((_, j) => j !== i) })}
                      className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground hover:bg-white/60"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>
            {form.options.length < 6 && (
              <button
                type="button"
                onClick={() => setForm({ ...form, options: [...form.options, { text: "", isCorrect: false }] })}
                className="mt-3 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium hover:bg-white/70"
              >
                + Agregar opción
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">
              {editing ? "Guardar cambios" : "Crear pregunta"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium hover:bg-white/70"
              >
                Cancelar
              </button>
            )}
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Preguntas del nivel ({questions.length})
          </h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
          ) : questions.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Todavía no hay preguntas.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {questions.map((q) => (
                <li key={q.id} className="rounded-2xl border border-border bg-white/60 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{q.position}. {q.questionText}</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {q.options.map((o) => (
                          <li key={o.id} className={o.isCorrect ? "text-brand-green" : "text-muted-foreground"}>
                            {o.isCorrect ? "✓" : "•"} {o.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        onClick={() => startEdit(q)}
                        className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium hover:bg-white/70"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(q.id)}
                        className="rounded-full border border-destructive/40 bg-white px-4 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ComprasPanel />
      <PdfsPanel />
    </main>
  );
}

const NIVELES_COMPRABLES = levels.filter((l) => l.slug !== "legado");

function ComprasPanel() {
  const cargar = useServerFn(listarComprasAdmin);
  const [rows, setRows] = useState<CompraAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar()
      .then((r) => setRows(r))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Compras</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Qué usuario compró qué nivel y en qué estado está el pago.
      </p>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay compras registradas.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border/60 bg-white/70 backdrop-blur-xl">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Nivel</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Monto</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/40 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{r.nombre ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{r.email ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3 capitalize text-foreground/80">{r.nivel}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize text-foreground/80">{r.estado}</span>
                  </td>
                  <td className="px-5 py-3 text-foreground/80">
                    {r.monto === null ? "—" : `$${r.monto.toLocaleString("es-AR")}`}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PdfsPanel() {
  const [slug, setSlug] = useState(NIVELES_COMPRABLES[0]?.slug ?? "despertar");
  const [files, setFiles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh(folder: string) {
    const { data } = await supabase.storage
      .from("niveles-pdf")
      .list(folder, { limit: 100, sortBy: { column: "name", order: "asc" } });
    setFiles((data ?? []).filter((f) => f.name.toLowerCase().endsWith(".pdf")).map((f) => f.name));
  }

  useEffect(() => {
    refresh(slug);
  }, [slug]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    setBusy(true);
    setMsg(null);
    for (const file of selected) {
      const { error } = await supabase.storage
        .from("niveles-pdf")
        .upload(`${slug}/${file.name}`, file, { upsert: true, contentType: "application/pdf" });
      if (error) {
        setMsg(`Error subiendo ${file.name}: ${error.message}`);
        setBusy(false);
        return;
      }
    }
    await refresh(slug);
    setBusy(false);
    setMsg("Archivos subidos ✓");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onDelete(name: string) {
    if (!confirm(`¿Eliminar ${name}?`)) return;
    await supabase.storage.from("niveles-pdf").remove([`${slug}/${name}`]);
    await refresh(slug);
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Materiales (PDFs)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Subí los 6 PDFs de cada nivel. Se guardan en una carpeta privada por nivel y solo los ven los
        usuarios con la compra aprobada, mediante enlaces temporales.
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-sm font-medium text-foreground/80">Nivel</span>
          <select
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setMsg(null); }}
            className="mt-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-blue"
          >
            {NIVELES_COMPRABLES.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={onUpload}
          disabled={busy}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm"
        />
        {busy && <span className="text-sm text-muted-foreground">Subiendo…</span>}
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>

      <ul className="mt-5 space-y-2">
        {files.length === 0 ? (
          <li className="text-sm text-muted-foreground">Este nivel todavía no tiene PDFs.</li>
        ) : (
          files.map((f) => (
            <li
              key={f}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-white/60 px-4 py-3 text-sm"
            >
              <span className="truncate text-foreground">{f}</span>
              <button
                onClick={() => onDelete(f)}
                className="shrink-0 rounded-full border border-destructive/40 bg-white px-4 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/70 p-5 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}