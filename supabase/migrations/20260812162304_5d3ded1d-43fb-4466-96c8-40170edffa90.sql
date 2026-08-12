CREATE TABLE public.niveles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  precio numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.niveles TO anon, authenticated;
GRANT ALL ON public.niveles TO service_role;
ALTER TABLE public.niveles ENABLE ROW LEVEL SECURITY;

CREATE POLICY niveles_public_read ON public.niveles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY niveles_admin_write ON public.niveles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_niveles_updated BEFORE UPDATE ON public.niveles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.compra_estado AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nivel_id uuid NOT NULL REFERENCES public.niveles(id) ON DELETE RESTRICT,
  estado public.compra_estado NOT NULL DEFAULT 'pending',
  preference_id text,
  payment_id text,
  monto numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX compras_user_idx ON public.compras (user_id);
CREATE INDEX compras_nivel_idx ON public.compras (nivel_id);

GRANT SELECT ON public.compras TO authenticated;
GRANT ALL ON public.compras TO service_role;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;

CREATE POLICY compras_select_own ON public.compras FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_compras_updated BEFORE UPDATE ON public.compras
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.niveles (nombre, precio) VALUES
  ('despertar', 30000),
  ('fundamentos', 50000),
  ('construccion', 70000),
  ('transformacion', 100000),
  ('maestria', 140000);