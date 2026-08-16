
-- 1) Access helper: approved purchase for the level (niveles.nombre == levels.slug)
CREATE OR REPLACE FUNCTION public.has_level_access(_user_id uuid, _level_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND (
    public.has_role(_user_id, 'admin'::app_role)
    OR EXISTS (
      SELECT 1
      FROM public.compras c
      JOIN public.niveles n ON n.id = c.nivel_id
      JOIN public.levels l ON l.slug = n.nombre
      WHERE c.user_id = _user_id
        AND c.estado = 'approved'::compra_estado
        AND l.id = _level_id
    )
  )
$$;

REVOKE ALL ON FUNCTION public.has_level_access(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_level_access(uuid, uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_module_access(_user_id uuid, _module_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.modules m
    WHERE m.id = _module_id
      AND public.has_level_access(_user_id, m.level_id)
  )
$$;

REVOKE ALL ON FUNCTION public.has_module_access(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_module_access(uuid, uuid) TO authenticated, service_role;

-- 2) Paid content requires purchase
DROP POLICY IF EXISTS lessons_auth_read ON public.lessons;
CREATE POLICY lessons_auth_read ON public.lessons
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (is_active = true AND public.has_module_access(auth.uid(), module_id))
);

DROP POLICY IF EXISTS quizzes_auth_read ON public.quizzes;
CREATE POLICY quizzes_auth_read ON public.quizzes
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (is_active = true AND public.has_module_access(auth.uid(), module_id))
);

DROP POLICY IF EXISTS questions_auth_read ON public.quiz_questions;
CREATE POLICY questions_auth_read ON public.quiz_questions
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = quiz_questions.quiz_id
      AND q.is_active = true
      AND public.has_module_access(auth.uid(), q.module_id)
  )
);

-- 3) Leaderboard: expose only alias/avatar via a dedicated view
DROP POLICY IF EXISTS profiles_public_leaderboard ON public.profiles;

CREATE OR REPLACE VIEW public.leaderboard_public
WITH (security_invoker = false) AS
  SELECT id, public_alias, avatar_url
  FROM public.profiles
  WHERE show_in_leaderboard = true;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- 4) Remove unneeded EXECUTE on SECURITY DEFINER helper
REVOKE EXECUTE ON FUNCTION public.get_quiz_options_for_question(uuid) FROM authenticated;
