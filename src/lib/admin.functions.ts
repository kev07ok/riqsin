import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Solo administradores");
}

// Ensures every level has a default "General" module + quiz used for
// level-scoped questions from the admin panel.
async function ensureLevelQuiz(supabaseAdmin: any, levelId: string): Promise<string> {
  const { data: mods } = await supabaseAdmin
    .from("modules")
    .select("id, title, position")
    .eq("level_id", levelId)
    .order("position", { ascending: true });
  let module = (mods ?? []).find((m: any) => m.title === "Evaluación general");
  if (!module) {
    const nextPos = ((mods ?? []).reduce((max: number, m: any) => Math.max(max, m.position), 0)) + 1;
    const { data: ins, error } = await supabaseAdmin
      .from("modules")
      .insert({
        level_id: levelId,
        title: "Evaluación general",
        description: "Preguntas del nivel para evaluar tu progreso.",
        position: nextPos,
        is_active: true,
      })
      .select("id")
      .single();
    if (error || !ins) throw error ?? new Error("No se pudo crear el módulo");
    module = ins;
  }
  const { data: qz } = await supabaseAdmin
    .from("quizzes")
    .select("id")
    .eq("module_id", module.id)
    .maybeSingle();
  if (qz) return qz.id;
  const { data: newQz, error: qzErr } = await supabaseAdmin
    .from("quizzes")
    .insert({
      module_id: module.id,
      title: "Evaluación del nivel",
      passing_percentage: 70,
      max_attempts: 3,
      is_active: true,
    })
    .select("id")
    .single();
  if (qzErr || !newQz) throw qzErr ?? new Error("No se pudo crear la evaluación");
  return newQz.id;
}

const createDailyInput = z.object({
  questionText: z.string().min(3).max(1000),
  answerType: z.enum(["text", "single_choice"]),
  options: z.array(z.string().min(1)).optional(),
  points: z.number().int().min(0).max(10000).default(10),
  activeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createDailyQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createDailyInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("daily_questions").insert({
      question_text: data.questionText,
      answer_type: data.answerType,
      options: data.options ?? null,
      points: data.points,
      active_date: data.activeDate,
      is_active: true,
    });
    if (error) throw error;
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [users, attempts, passed, responses] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("quiz_attempts").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("passed", true),
      supabaseAdmin.from("daily_responses").select("id", { count: "exact", head: true }),
    ]);
    return {
      users: users.count ?? 0,
      attempts: attempts.count ?? 0,
      passed: passed.count ?? 0,
      dailyResponses: responses.count ?? 0,
    };
  });

// ====== QUIZ QUESTIONS CRUD (level-scoped) ======

const optionSchema = z.object({
  text: z.string().min(1).max(500),
  isCorrect: z.boolean(),
});

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });

export const listLevelsForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("levels")
      .select("id, slug, name, position")
      .order("position");
    return data ?? [];
  });

export const listLevelQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ levelId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: mods } = await supabaseAdmin
      .from("modules")
      .select("id, quizzes(id, quiz_questions(id, question_text, explanation, position, quiz_options(id, option_text, is_correct, position)))")
      .eq("level_id", data.levelId);
    const questions: Array<any> = [];
    for (const m of mods ?? []) {
      for (const q of (m as any).quizzes ?? []) {
        for (const qq of q.quiz_questions ?? []) {
          questions.push({
            id: qq.id,
            questionText: qq.question_text,
            explanation: qq.explanation,
            position: qq.position,
            options: (qq.quiz_options ?? [])
              .sort((a: any, b: any) => a.position - b.position)
              .map((o: any) => ({ id: o.id, text: o.option_text, isCorrect: o.is_correct })),
          });
        }
      }
    }
    questions.sort((a, b) => a.position - b.position);
    return questions;
  });

const createQuestionInput = z.object({
  levelId: z.string().uuid(),
  questionText: z.string().min(3).max(1000),
  explanation: z.string().max(2000).optional().default(""),
  options: z.array(optionSchema).min(2).max(6),
});

export const createLevelQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createQuestionInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (!data.options.some((o) => o.isCorrect)) {
      throw new Error("Debe haber al menos una opción correcta.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const quizId = await ensureLevelQuiz(supabaseAdmin, data.levelId);
    const { count } = await supabaseAdmin
      .from("quiz_questions")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", quizId);
    const { data: q, error } = await supabaseAdmin
      .from("quiz_questions")
      .insert({
        quiz_id: quizId,
        question_text: data.questionText,
        explanation: data.explanation || null,
        position: (count ?? 0) + 1,
      })
      .select("id")
      .single();
    if (error || !q) throw error ?? new Error("No se pudo crear la pregunta");
    const { error: oErr } = await supabaseAdmin.from("quiz_options").insert(
      data.options.map((o, i) => ({
        question_id: q.id,
        option_text: o.text,
        is_correct: o.isCorrect,
        position: i + 1,
      })),
    );
    if (oErr) throw oErr;
    return { ok: true, id: q.id };
  });

const updateQuestionInput = z.object({
  id: z.string().uuid(),
  questionText: z.string().min(3).max(1000),
  explanation: z.string().max(2000).optional().default(""),
  options: z.array(optionSchema).min(2).max(6),
});

export const updateLevelQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateQuestionInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (!data.options.some((o) => o.isCorrect)) {
      throw new Error("Debe haber al menos una opción correcta.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: uErr } = await supabaseAdmin
      .from("quiz_questions")
      .update({
        question_text: data.questionText,
        explanation: data.explanation || null,
      })
      .eq("id", data.id);
    if (uErr) throw uErr;
    await supabaseAdmin.from("quiz_options").delete().eq("question_id", data.id);
    const { error: oErr } = await supabaseAdmin.from("quiz_options").insert(
      data.options.map((o, i) => ({
        question_id: data.id,
        option_text: o.text,
        is_correct: o.isCorrect,
        position: i + 1,
      })),
    );
    if (oErr) throw oErr;
    return { ok: true };
  });

export const deleteLevelQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quiz_questions").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });