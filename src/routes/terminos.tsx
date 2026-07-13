import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/legal-page";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones — RIQSIN" },
      { name: "description", content: "Términos y condiciones de uso del sitio y los contenidos de RIQSIN." },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: () => (
    <LegalPage
      title="Términos y condiciones"
      sections={[
        { title: "Aceptación de los términos", body: "El uso del sitio y de los contenidos de RIQSIN implica la aceptación plena de los presentes términos y condiciones. Si no estás de acuerdo con alguno de sus puntos, debés abstenerte de utilizar el sitio y sus servicios." },
        { title: "Naturaleza educativa del contenido", body: "Los materiales publicados y comercializados por RIQSIN tienen fines exclusivamente educativos y de desarrollo personal. No constituyen asesoramiento médico, psicológico, psiquiátrico, financiero ni profesional de ninguna índole." },
        { title: "Condiciones de acceso", body: "El acceso a los contenidos pagos requiere el registro y/o el pago correspondiente. El usuario se compromete a brindar información veraz y actualizada al momento de realizar cualquier compra." },
        { title: "Uso permitido", body: "El usuario podrá utilizar los materiales de forma personal, limitada, no exclusiva e intransferible, únicamente con fines de estudio y aplicación individual." },
        { title: "Conductas prohibidas", body: [
          "Reproducir, distribuir o comercializar los contenidos sin autorización.",
          "Compartir credenciales o accesos con terceros.",
          "Utilizar los materiales para fines ilícitos o contrarios a la buena fe.",
          "Realizar ingeniería inversa, modificar o crear obras derivadas.",
        ]},
        { title: "Propiedad intelectual", body: "Los textos, manuales, ejercicios, diseños, marcas, logotipos y materiales audiovisuales pertenecen a su titular, salvo indicación expresa en contrario." },
        { title: "Precios y medios de pago", body: "Los precios se expresan en la moneda indicada en cada nivel. Los pagos se procesan a través de proveedores externos, cuyas condiciones también resultan aplicables." },
        { title: "Disponibilidad de contenidos", body: "RIQSIN podrá modificar, actualizar o dar de baja contenidos por razones técnicas, comerciales o de mejora, sin que ello genere obligación de compensación adicional cuando no afecte derechos ya adquiridos." },
        { title: "Limitación de responsabilidad", body: "RIQSIN no garantiza resultados específicos derivados de la aplicación de los contenidos. La responsabilidad por el uso de la información recae en el usuario." },
        { title: "Modificaciones del servicio", body: "Los presentes términos podrán actualizarse en cualquier momento. La versión vigente será la publicada en el sitio con la fecha de última actualización indicada." },
        { title: "Contacto", body: "Para consultas relacionadas con estos términos, podés escribirnos a través de los canales oficiales publicados en el sitio." },
      ]}
    />
  ),
});