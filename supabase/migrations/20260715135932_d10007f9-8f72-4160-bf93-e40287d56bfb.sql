
-- 1) Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS theme_preference text NOT NULL DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_theme_preference_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_theme_preference_check
  CHECK (theme_preference IN ('light','dark','system'));

-- 2) Update handle_new_user to capture avatar + google name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, public_alias, show_in_leaderboard, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    NULLIF(NEW.raw_user_meta_data->>'public_alias', ''),
    false,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  );

  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  IF lower(NEW.email) = 'kevinarozamena10@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Backfill avatar_url for existing google users
UPDATE public.profiles p
SET avatar_url = COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
FROM auth.users u
WHERE p.id = u.id
  AND p.avatar_url IS NULL
  AND (u.raw_user_meta_data->>'avatar_url' IS NOT NULL OR u.raw_user_meta_data->>'picture' IS NOT NULL);

-- 4) Seed the 6 canonical levels used by the front-end (idempotent)
INSERT INTO public.levels (slug, name, position, total_modules, is_active) VALUES
  ('despertar',       'Despertar',       1, 0, true),
  ('fundamentos',     'Fundamentos',     2, 0, true),
  ('construccion',    'Construcción',    3, 0, true),
  ('transformacion',  'Transformación',  4, 0, true),
  ('maestria',        'Maestría',        5, 0, true),
  ('legado',          'Legado',          6, 0, true)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      position = EXCLUDED.position,
      is_active = true;
