import { createFileRoute } from "@tanstack/react-router";

async function processNotification(paymentId: string) {
  const { getPayment } = await import("@/lib/pagos.server");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const payment = await getPayment(paymentId);
  const pedidoId = payment.external_reference;
  if (!pedidoId) return;

  const estado =
    payment.status === "approved"
      ? "approved"
      : payment.status === "rejected" || payment.status === "cancelled"
        ? "rejected"
        : "pending";

  await supabaseAdmin
    .from("pedidos")
    .update({ estado, payment_id: payment.id })
    .eq("id", pedidoId);
}

export const Route = createFileRoute("/api/public/webhook-mp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const raw = await request.text();
          let body: Record<string, any> = {};
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = {};
          }

          const paymentId =
            body?.data?.id ??
            body?.resource?.toString().split("/").pop() ??
            url.searchParams.get("data.id") ??
            url.searchParams.get("id");

          const type = body?.type ?? body?.topic ?? url.searchParams.get("type") ?? "payment";

          // Solo nos interesan notificaciones de pagos; el resto se confirma con 200.
          if (paymentId && String(type).includes("payment")) {
            await processNotification(String(paymentId));
          }
          return new Response("ok", { status: 200 });
        } catch (error) {
          console.error("[webhook-mp]", error);
          // 200 evita reintentos infinitos por errores no recuperables.
          return new Response("ok", { status: 200 });
        }
      },
      GET: async () => new Response("ok", { status: 200 }),
    },
  },
});