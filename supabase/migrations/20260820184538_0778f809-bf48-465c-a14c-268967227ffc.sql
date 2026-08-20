CREATE TABLE public.pedidos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  nombre text NOT NULL DEFAULT '',
  nivel_slug text NOT NULL,
  estado text NOT NULL DEFAULT 'pending',
  preference_id text,
  payment_id text,
  monto numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.pedidos TO service_role;

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_pedidos_updated BEFORE UPDATE ON public.pedidos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();