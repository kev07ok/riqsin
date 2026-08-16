
REVOKE EXECUTE ON FUNCTION public.has_level_access(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_module_access(uuid, uuid) FROM anon;

DROP VIEW IF EXISTS public.leaderboard_public;
CREATE VIEW public.leaderboard_public
WITH (security_invoker = true) AS
  SELECT id, public_alias, avatar_url
  FROM public.profiles
  WHERE show_in_leaderboard = true;

-- Column-level grants: public audience can only read alias/avatar columns
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, public_alias, avatar_url, show_in_leaderboard) ON public.profiles TO anon;

CREATE POLICY profiles_public_leaderboard ON public.profiles
FOR SELECT TO anon
USING (show_in_leaderboard = true);

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;
