// Server-only helpers for Mercado Pago.
const MP_API = "https://api.mercadopago.com";

function token(): string {
  const t = process.env["MERCADOPAGO_ACCESS_TOKEN"];
  if (!t) throw new Error("Falta configurar MERCADOPAGO_ACCESS_TOKEN");
  return t;
}

export interface MpPreference {
  id: string;
  init_point: string;
}

export async function createPreference(args: {
  title: string;
  amount: number;
  externalReference: string;
  email: string;
  origin: string;
  notificationUrl: string;
}): Promise<MpPreference> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: args.title,
          quantity: 1,
          currency_id: "ARS",
          unit_price: args.amount,
        },
      ],
      external_reference: args.externalReference,
      payer: { email: args.email },
      notification_url: args.notificationUrl,
      back_urls: {
        success: `${args.origin}/gracias`,
        pending: `${args.origin}/gracias`,
        failure: `${args.origin}/metodo`,
      },
      auto_return: "approved",
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    console.error("[MP] preference error", json);
    throw new Error("No se pudo crear la preferencia de pago");
  }
  const initPoint = (json["init_point"] ?? json["sandbox_init_point"]) as string | undefined;
  if (!initPoint) throw new Error("Mercado Pago no devolvió init_point");
  return { id: String(json["id"]), init_point: initPoint };
}

export interface MpPayment {
  id: string;
  status: string;
  external_reference: string | null;
  transaction_amount: number | null;
}

export async function getPayment(paymentId: string): Promise<MpPayment> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    console.error("[MP] payment lookup error", json);
    throw new Error("No se pudo consultar el pago");
  }
  return {
    id: String(json["id"]),
    status: String(json["status"] ?? ""),
    external_reference: (json["external_reference"] as string | null) ?? null,
    transaction_amount: (json["transaction_amount"] as number | null) ?? null,
  };
}