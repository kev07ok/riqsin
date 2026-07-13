import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/legal-page";

export const Route = createFileRoute("/propiedad-intelectual")({
  head: () => ({
    meta: [
      { title: "Propiedad intelectual — RIQSIN" },
      { name: "description", content: "Titularidad y licencia de uso de los contenidos de RIQSIN." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Propiedad intelectual"
      sections={[
        { title: "Titularidad", body: "Los textos, manuales, recursos, diseños y materiales publicados por RIQSIN pertenecen a Kevin Arozamena, salvo indicación expresa en contrario." },
        { title: "Licencia de uso", body: "La compra otorga una licencia personal, limitada, no exclusiva e intransferible para el uso individual del material adquirido." },
        { title: "Usos no permitidos", body: [
          "Revender o comercializar los materiales.",
          "Compartirlos públicamente o en canales de acceso masivo.",
          "Copiar de forma masiva o sistemática.",
          "Modificarlos para su comercialización.",
          "Distribuirlos a terceros por cualquier medio.",
        ]},
        { title: "Marca y signos distintivos", body: "El nombre, logotipo y elementos gráficos de RIQSIN son utilizados por su titular. No se afirma la existencia de un registro marcario salvo que expresamente se indique lo contrario." },
        { title: "Reclamos", body: "Ante posibles infracciones de propiedad intelectual, podés comunicarte a través de los canales oficiales publicados en el sitio." },
      ]}
    />
  ),
});