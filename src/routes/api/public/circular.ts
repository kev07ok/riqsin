import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "../../../data/site";

// Conserva la ruta histórica sin volver a solicitar el asset desde el servidor.
export const Route = createFileRoute("/api/public/circular")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = siteConfig.circularPdfUrl;
        if (!source) return new Response("Not found", { status: 404 });

        const destination = source.startsWith("http")
          ? source
          : new URL(source, new URL(request.url).origin).toString();
        return Response.redirect(destination, 302);
      },
    },
  },
});
