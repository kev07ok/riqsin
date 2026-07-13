import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/legal-page";

export const Route = createFileRoute("/reembolsos")({
  head: () => ({
    meta: [
      { title: "Política de compra y reembolsos — RIQSIN" },
      { name: "description", content: "Condiciones de compra y política de reembolsos de RIQSIN." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Política de compra y reembolsos"
      sections={[
        { title: "Condiciones previas a la compra", body: "Las condiciones definitivas de cada producto o nivel se mostrarán con claridad antes de confirmar la compra." },
        { title: "Productos digitales", body: "Los productos digitales podrán tener condiciones particulares, indicadas al momento de la compra, en función de su naturaleza descargable o de acceso inmediato." },
        { title: "Procesamiento de pagos", body: "Los pagos se procesan mediante proveedores externos. Las condiciones y políticas de dichos proveedores también resultan aplicables al usuario." },
        { title: "Revisión de casos", body: [
          "Pedidos duplicados serán revisados y regularizados.",
          "Fallas de acceso serán atendidas y solucionadas.",
          "Cobros incorrectos serán analizados de buena fe.",
        ]},
        { title: "Derechos del consumidor", body: "Ninguna disposición de esta política eliminará ni limitará los derechos legales obligatorios que correspondan al usuario en su calidad de consumidor conforme a la normativa aplicable." },
        { title: "Solicitudes", body: "Toda solicitud vinculada a compras deberá canalizarse a través de los medios oficiales publicados en el sitio, indicando los datos de la operación." },
      ]}
    />
  ),
});