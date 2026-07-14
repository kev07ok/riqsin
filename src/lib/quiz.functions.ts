import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const submitInput = z.object({
  quizId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionId: z.string().uuid().nullable(),
      }),
    )
    .min(1),
});

export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => submitInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    const { data: quiz, error: qErr } = await supabaseAdmin
      .from("quizzes")
      .select("id, module_id, passing_percentage, max_attempts, is_active")
      .eq("id", data.quizId)
      .maybeSingle();
    if (qErr || !quiz) throw new Error("Evaluación no encontrada");
    if (!quiz.is_active) throw new Error("Evaluación no disponible");

    const { count: previousAttempts } = await supabaseAdmin
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("quiz_id", quiz.id);
    const attemptNumber = (previousAttempts ?? 0) + 1;
    if (attemptNumber > quiz.max_attempts) {
      throw new Error(`Superaste el máximo de ${quiz.max_attempts} intentos`);
    }

    // Load correct options for the quiz's questions
    const { data: questions, error: qsErr } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, quiz_options(id, is_correct)")
      .eq("quiz_id", quiz.id);
    if (qsErr) throw qsErr;
    const correctByQuestion = new Map<string, Set<string>>();
    for (const q of questions ?? []) {
      const correct = new Set<string>();
      for (const opt of (q as any).quiz_options ?? []) {
        if (opt.is_correct) correct.add(opt.id);
      }
      correctByQuestion.set(q.id, correct);
    }
    const totalQuestions = correctByQuestion.size;
    if (totalQuestions === 0) throw new Error("La evaluación no tiene preguntas");

    // Score
    let score = 0;
    const gradedAnswers = data.answers.map((a) => {
      const correct = correctByQuestion.get(a.questionId);
      const isCorrect = !!(a.selectedOptionId && correct?.has(a.selectedOptionId));
      if (isCorrect) score += 1;
      return { ...a, isCorrect };
    });
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= quiz.passing_percentage;

    // Create attempt
    const { data: attempt, error: aErr } = await supabaseAdmin
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quiz.id,
        score,
        total_questions: totalQuestions,
        percentage,
        passed,
        attempt_number: attemptNumber,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (aErr || !attempt) throw aErr ?? new Error("No se pudo guardar el intento");

    if (gradedAnswers.length) {
      const { error: ansErr } = await supabaseAdmin.from("quiz_answers").insert(
        gradedAnswers.map((a) => ({
          attempt_id: attempt.id,
          question_id: a.questionId,
          selected_option_id: a.selectedOptionId,
          is_correct: a.isCorrect,
        })),
      );
      if (ansErr) throw ansErr;
    }

    // Update module progress: best score, status
    const { data: prev } = await supabaseAdmin
      .from("user_module_progress")
      .select("best_score, status, completed_at")
      .eq("user_id", userId)
      .eq("module_id", quiz.module_id)
      .maybeSingle();

    const bestScore = Math.max(prev?.best_score ?? 0, percentage);
    const newStatus: "not_started" | "in_progress" | "completed" =
      passed || prev?.status === "completed" ? "completed" : "in_progress";
    const completedAt = passed
      ? (prev?.completed_at ?? new Date().toISOString())
      : (prev?.completed_at ?? null);

    await supabaseAdmin
      .from("user_module_progress")
      .upsert(
        {
          user_id: userId,
          module_id: quiz.module_id,
          best_score: bestScore,
          status: newStatus,
          completed_at: completedAt,
        },
        { onConflict: "user_id,module_id" },
      );

    // Recompute level progress
    const { data: modRow } = await supabaseAdmin
      .from("modules")
      .select("level_id")
      .eq("id", quiz.module_id)
      .single();
    if (modRow?.level_id) {
      const { count: totalMods } = await supabaseAdmin
        .from("modules")
        .select("id", { count: "exact", head: true })
        .eq("level_id", modRow.level_id)
        .eq("is_active", true);
      const { count: doneMods } = await supabaseAdmin
        .from("user_module_progress")
        .select("id, modules!inner(level_id)", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed")
        .eq("modules.level_id", modRow.level_id);
      const total = totalMods ?? 0;
      const done = doneMods ?? 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      await supabaseAdmin
        .from("user_level_progress")
        .upsert(
          {
            user_id: userId,
            level_id: modRow.level_id,
            progress_percentage: pct,
            completed_modules: done,
            completed_at: pct >= 100 ? new Date().toISOString() : null,
          },
          { onConflict: "user_id,level_id" },
        );
    }

    return {
      ok: true,
      attemptId: attempt.id,
      score,
      totalQuestions,
      percentage,
      passed,
      attemptNumber,
      maxAttempts: quiz.max_attempts,
    };
  });