import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "../../../data/site";

// Sirve la circular en PDF forzando la descarga (Content-Disposition: attachment).
// Así funciona igual en desktop, móvil e incógnito, sin depender del atributo
// `download` del navegador ni abrir el visor de PDF integrado.
export const Route = createFileRoute("/api/public/circular")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = siteConfig.circularPdfUrl;
        if (!source) return new Response("Not found", { status: 404 });

        const absolute = source.startsWith("http")
          ? source
          : new URL(source, new URL(request.url).origin).toString();

        const upstream = await fetch(absolute);
        if (!upstream.ok || !upstream.body) {
          return new Response("PDF no disponible", { status: 502 });
        }

        const fileName = siteConfig.circularPdfFileName || "circular.pdf";
        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set(
          "Content-Disposition",
          `attachment; filename="${fileName}"`,
        );
        const length = upstream.headers.get("content-length");
        if (length) headers.set("Content-Length", length);
        headers.set("Cache-Control", "public, max-age=3600");

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
