import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/legal-page";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — RIQSIN" },
      { name: "description", content: "Cómo RIQSIN recopila, utiliza y protege tus datos personales." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Política de privacidad"
      sections={[
        { title: "Datos que se pueden recopilar", body: [
          "Datos identificatorios básicos: nombre, correo electrónico.",
          "Datos de compra proporcionados a los procesadores de pago.",
          "Datos técnicos: dirección IP, tipo de dispositivo y navegador.",
        ]},
        { title: "Finalidad del tratamiento", body: [
          "Brindar acceso a los contenidos adquiridos.",
          "Enviar comunicaciones relacionadas con el servicio.",
          "Mejorar la experiencia del sitio y de los productos.",
          "Cumplir obligaciones legales y contractuales.",
        ]},
        { title: "Formularios y comunicaciones", body: "Al enviar un formulario o suscribirte a una comunicación, autorizás el tratamiento de tus datos con las finalidades indicadas. Podés solicitar la baja en cualquier momento." },
        { title: "Servicios de terceros", body: "El sitio puede utilizar servicios de terceros (procesadores de pago, hosting, herramientas de analítica). Cada uno cuenta con sus propias políticas de privacidad, que también resultan aplicables." },
        { title: "Cookies", body: "El sitio puede utilizar cookies técnicas o de analítica para su correcto funcionamiento y para comprender el uso general del sitio. Podés configurar tu navegador para bloquearlas." },
        { title: "Seguridad", body: "Se aplican medidas técnicas y organizativas razonables para proteger los datos. Ningún sistema es completamente invulnerable, por lo que no puede garantizarse una seguridad absoluta." },
        { title: "Conservación de datos", body: "Los datos se conservan mientras sean necesarios para las finalidades indicadas o para cumplir obligaciones legales." },
        { title: "Derechos del usuario", body: "Podés ejercer los derechos de acceso, rectificación, actualización, supresión y oposición sobre tus datos personales, conforme a la normativa aplicable." },
        { title: "Contacto", body: "Para ejercer tus derechos o realizar consultas sobre privacidad, podés escribirnos a través de los canales oficiales publicados en el sitio." },
      ]}
    />
  ),
});