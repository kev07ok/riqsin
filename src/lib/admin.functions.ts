import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Solo administradores");
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