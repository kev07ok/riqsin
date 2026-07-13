import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/legal-page";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal — RIQSIN" },
      { name: "description", content: "Aviso legal y alcance educativo de los contenidos de RIQSIN." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Aviso legal"
      sections={[
        { title: "Carácter educativo", body: "Los contenidos publicados y comercializados por RIQSIN tienen finalidad educativa y de desarrollo personal." },
        { title: "No sustituye asesoramiento profesional", body: "El material no reemplaza la atención médica, psicológica, psiquiátrica, nutricional, financiera ni ningún otro tipo de asesoramiento profesional." },
        { title: "Resultados", body: "Los resultados dependen de múltiples factores personales y del nivel de aplicación individual. No se garantizan transformaciones específicas, ganancias económicas ni resultados médicos o terapéuticos." },
        { title: "Referencias a psicología y neurociencia", body: "Las referencias a conceptos de psicología, neurociencia y disciplinas afines se realizan con finalidad divulgativa y práctica, y no constituyen prestaciones profesionales de esas disciplinas." },
        { title: "Responsabilidad del usuario", body: "El usuario es responsable de la forma en que aplica los contenidos y de las decisiones personales que tome a partir de ellos." },
      ]}
    />
  ),
});