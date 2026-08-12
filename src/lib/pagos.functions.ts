import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const nivelSchema = z.object({ nivel: z.string().min(1) });

/** Crea la preferencia de pago en Mercado Pago y registra la compra como pending. */
export const crearPago = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => nivelSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPreference } = await import("./pagos.server");

    const { data: nivel, error: nivelErr } = await supabaseAdmin
      .from("niveles")
      .select("id, nombre, precio")
      .eq("nombre", data.nivel)
      .maybeSingle();
    if (nivelErr) throw nivelErr;
    if (!nivel) throw new Error("Ese nivel no está disponible para compra");

    const userId = context.userId;

    // Si ya está aprobado, no cobrar de nuevo.
    const { data: existing } = await supabaseAdmin
      .from("compras")
      .select("id, estado")
      .eq("user_id", userId)
      .eq("nivel_id", nivel.id)
      .eq("estado", "approved")
      .maybeSingle();
    if (existing) throw new Error("Ya tenés acceso a este nivel");

    const { data: compra, error: compraErr } = await supabaseAdmin
      .from("compras")
      .insert({
        user_id: userId,
        nivel_id: nivel.id,
        estado: "pending",
        monto: nivel.precio,
      })
      .select("id")
      .single();
    if (compraErr || !compra) throw compraErr ?? new Error("No se pudo registrar la compra");

    const url = new URL(getRequest().url);
    const origin = `${url.protocol}//${url.host}`;

    const pref = await createPreference({
      title: `RIQSIN — Nivel ${nivel.nombre}`,
      amount: Number(nivel.precio),
      externalReference: `${userId}|${nivel.id}|${compra.id}`,
      origin,
      notificationUrl: `${origin}/api/public/webhook-mp`,
    });

    await supabaseAdmin.from("compras").update({ preference_id: pref.id }).eq("id", compra.id);

    return { initPoint: pref.init_point };
  });

export interface NivelComprado {
  nombre: string;
  estado: string;
  createdAt: string;
  pdfs: Array<{ name: string; url: string }>;
}

/** Devuelve las compras del usuario y, para las aprobadas, links firmados a los PDFs. */
export const misNiveles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<NivelComprado[]> => {
    const { data: compras, error } = await context.supabase
      .from("compras")
      .select("estado, created_at, niveles(nombre)")
      .order("created_at", { ascending: true });
    if (error) throw error;

    const rows = (compras ?? []) as Array<{
      estado: string;
      created_at: string;
      niveles: { nombre: string } | null;
    }>;

    const approvedFolders = rows
      .filter((r) => r.estado === "approved" && r.niveles)
      .map((r) => r.niveles!.nombre);

    const pdfsByFolder = new Map<string, Array<{ name: string; url: string }>>();
    if (approvedFolders.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      for (const folder of approvedFolders) {
        const { data: files } = await supabaseAdmin.storage
          .from("niveles-pdf")
          .list(folder, { limit: 100, sortBy: { column: "name", order: "asc" } });
        const pdfs: Array<{ name: string; url: string }> = [];
        for (const f of files ?? []) {
          if (!f.name.toLowerCase().endsWith(".pdf")) continue;
          const { data: signed } = await supabaseAdmin.storage
            .from("niveles-pdf")
            .createSignedUrl(`${folder}/${f.name}`, 60 * 15);
          if (signed?.signedUrl) pdfs.push({ name: f.name, url: signed.signedUrl });
        }
        pdfsByFolder.set(folder, pdfs);
      }
    }

    return rows
      .filter((r) => r.niveles)
      .map((r) => ({
        nombre: r.niveles!.nombre,
        estado: r.estado,
        createdAt: r.created_at,
        pdfs: r.estado === "approved" ? (pdfsByFolder.get(r.niveles!.nombre) ?? []) : [],
      }));
  });

export interface CompraAdmin {
  id: string;
  nivel: string;
  estado: string;
  createdAt: string;
  monto: number | null;
  email: string | null;
  nombre: string | null;
}

/** Vista de administración: qué usuario compró qué nivel y en qué estado. */
export const listarComprasAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CompraAdmin[]> => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw roleErr;
    if (!isAdmin) throw new Error("Solo administradores");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: compras, error } = await supabaseAdmin
      .from("compras")
      .select("id, user_id, estado, monto, created_at, niveles(nombre)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;

    const rows = (compras ?? []) as Array<{
      id: string;
      user_id: string;
      estado: string;
      monto: number | null;
      created_at: string;
      niveles: { nombre: string } | null;
    }>;

    const ids = [...new Set(rows.map((r) => r.user_id))];
    const emails = new Map<string, string | null>();
    const names = new Map<string, string | null>();
    if (ids.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, public_alias")
        .in("id", ids);
      for (const p of profiles ?? []) {
        names.set(p.id, p.public_alias || p.full_name || null);
      }
      for (const id of ids) {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(id);
        emails.set(id, u?.user?.email ?? null);
      }
    }

    return rows.map((r) => ({
      id: r.id,
      nivel: r.niveles?.nombre ?? "—",
      estado: r.estado,
      createdAt: r.created_at,
      monto: r.monto === null ? null : Number(r.monto),
      email: emails.get(r.user_id) ?? null,
      nombre: names.get(r.user_id) ?? null,
    }));
  });