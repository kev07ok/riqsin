import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const submitInput = z.object({
  questionId: z.string().uuid(),
  responseText: z.string().max(2000).optional(),
  selectedOption: z.string().max(500).optional(),
});

export const submitDailyResponse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => submitInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    const { data: question, error: qErr } = await supabaseAdmin
      .from("daily_questions")
      .select("id, answer_type, options, points, active_date, is_active")
      .eq("id", data.questionId)
      .maybeSingle();
    if (qErr || !question) throw new Error("Pregunta no encontrada");
    if (!question.is_active) throw new Error("Pregunta no disponible");

    const today = new Date().toISOString().slice(0, 10);
    if (question.active_date !== today) throw new Error("Esta pregunta no es la del día");

    const { data: existing } = await supabaseAdmin
      .from("daily_responses")
      .select("id")
      .eq("user_id", userId)
      .eq("question_id", data.questionId)
      .maybeSingle();
    if (existing) throw new Error("Ya respondiste la pregunta de hoy");

    const points = question.points ?? 0;

    const { error: insErr } = await supabaseAdmin.from("daily_responses").insert({
      user_id: userId,
      question_id: data.questionId,
      response_text: data.responseText ?? null,
      selected_option: data.selectedOption ?? null,
      points_earned: points,
    });
    if (insErr) throw insErr;

    // Update streak
    const { data: streak } = await supabaseAdmin
      .from("user_streaks")
      .select("current_streak, longest_streak, last_response_date, total_responses, total_points")
      .eq("user_id", userId)
      .maybeSingle();

    const last = streak?.last_response_date ?? null;
    let current = streak?.current_streak ?? 0;
    if (last) {
      const lastDate = new Date(last + "T00:00:00Z");
      const todayDate = new Date(today + "T00:00:00Z");
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / 86_400_000);
      if (diffDays === 0) current = current; // same day (shouldn't happen due to unique)
      else if (diffDays === 1) current = current + 1;
      else current = 1;
    } else {
      current = 1;
    }
    const longest = Math.max(streak?.longest_streak ?? 0, current);
    const totalResponses = (streak?.total_responses ?? 0) + 1;
    const totalPoints = (streak?.total_points ?? 0) + points;

    const { error: sErr } = await supabaseAdmin
      .from("user_streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: current,
          longest_streak: longest,
          last_response_date: today,
          total_responses: totalResponses,
          total_points: totalPoints,
        },
        { onConflict: "user_id" },
      );
    if (sErr) throw sErr;

    return { ok: true, pointsEarned: points, currentStreak: current, longestStreak: longest };
  });