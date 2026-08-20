import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const pedidoSchema = z.object({
  nivel: z.string().min(1),
  email: z.string().email(),
  nombre: z.string().min(2).max(120),
});

/**
 * Crea la preferencia de pago en Mercado Pago para un comprador invitado
 * (sin necesidad de cuenta) y registra el pedido como pendiente.
 */
export const crearPago = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => pedidoSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPreference } = await import("./pagos.server");

    const { data: nivel, error: nivelErr } = await supabaseAdmin
      .from("niveles")
      .select("id, nombre, precio")
      .eq("nombre", data.nivel)
      .maybeSingle();
    if (nivelErr) throw nivelErr;
    if (!nivel) throw new Error("Ese nivel no está disponible para compra");

    const { data: pedido, error: pedidoErr } = await supabaseAdmin
      .from("pedidos")
      .insert({
        email: data.email.trim().toLowerCase(),
        nombre: data.nombre.trim(),
        nivel_slug: nivel.nombre,
        estado: "pending",
        monto: nivel.precio,
      })
      .select("id")
      .single();
    if (pedidoErr || !pedido) throw pedidoErr ?? new Error("No se pudo registrar el pedido");

    const url = new URL(getRequest().url);
    const origin = `${url.protocol}//${url.host}`;

    const pref = await createPreference({
      title: `RIQSIN — Nivel ${nivel.nombre}`,
      amount: Number(nivel.precio),
      externalReference: pedido.id,
      email: data.email.trim().toLowerCase(),
      origin,
      notificationUrl: `${origin}/api/public/webhook-mp`,
    });

    await supabaseAdmin.from("pedidos").update({ preference_id: pref.id }).eq("id", pedido.id);

    return { initPoint: pref.init_point };
  });
