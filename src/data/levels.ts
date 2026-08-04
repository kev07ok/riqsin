export type LevelStatus = "disponible" | "en proceso" | "por invitación";

export interface Level {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  duration: string;
  price: string;
  status: LevelStatus;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  audience: string[];
  objectives: string[];
  includes: string[];
  topics: string[];
  subtopics?: string[];
  materials?: string[];
  access?: string;
  faq?: { question: string; answer: string }[];
  paymentUrl: string;
}

// Editá aquí los precios, descripciones, temas y (en el futuro) los enlaces
// de pago (paymentUrl) de cada nivel. Dejá paymentUrl vacío hasta integrar
// Mercado Pago; el botón mostrará "Compra disponible próximamente".
export const levels: Level[] = [
  {
    id: 1,
    slug: "despertar",
    name: "Despertar",
    subtitle: "El inicio del autoconocimiento",
    duration: "1 mes",
    price: "$30.000 ARS",
    status: "en proceso",
    tagline: "El inicio del autoconocimiento.",
    shortDescription:
      "Comprendé cómo funciona tu mente, reconocé los patrones que dirigen tu conducta y construí las primeras bases de una vida más consciente y disciplinada.",
    fullDescription:
      "Despertar es el punto de entrada al Método RIQSIN. Este nivel busca que la persona deje de actuar completamente en automático y comience a observar su mente, sus decisiones, sus emociones y sus hábitos. Antes de intentar controlar o transformar una conducta, es necesario comprender de dónde surge.",
    audience: [],
    objectives: [
      "Que la persona comprenda su situación actual, identifique qué necesita cambiar y dé sus primeros pasos con una estructura concreta.",
    ],
    includes: [
      "Manual digital de aproximadamente 30 páginas.",
      "Planillas imprimibles.",
      "Herramientas de autoevaluación.",
      "Seguimiento inicial de hábitos.",
      "Primer desafío de disciplina RIQSIN.",
    ],
    topics: [
      "Qué significa conocerse a uno mismo.",
      "Cómo funciona el cerebro humano.",
      "La ilusión de la motivación.",
      "La verdadera naturaleza de la disciplina.",
      "Hábitos y comportamiento humano.",
      "Identidad personal.",
      "Procrastinación.",
      "Dopamina.",
      "Toma de decisiones.",
    ],
    subtopics: [
      "Neuroplasticidad.",
      "Sistema de recompensa.",
      "Sesgos cognitivos.",
      "Gratificación instantánea.",
      "Autoconciencia.",
      "Autoevaluación.",
      "Construcción inicial de hábitos.",
      "Eliminación de malos hábitos.",
      "Gestión emocional básica.",
      "Primer desafío RIQSIN.",
    ],
    access: "Acceso inmediato tras la compra, disponible de por vida.",
    faq: [
      {
        question: "¿Necesito experiencia previa?",
        answer: "No. Este nivel está pensado para quienes recién comienzan.",
      },
      {
        question: "¿Cuánto tiempo por día necesito?",
        answer: "Entre 15 y 30 minutos diarios son suficientes.",
      },
    ],
    paymentUrl: "",
  },
  {
    id: 2,
    slug: "fundamentos",
    name: "Fundamentos",
    subtitle: "Las bases del cambio",
    duration: "1 mes",
    price: "$50.000 ARS",
    status: "en proceso",
    tagline: "Las bases del cambio.",
    shortDescription:
      "Construí hábitos sólidos, organizá tu tiempo y desarrollá sistemas personales que no dependan únicamente de la motivación.",
    fullDescription:
      "Fundamentos desarrolla las herramientas necesarias para sostener cambios en la vida cotidiana. Trabaja sobre la creación de rutinas, la organización, la constancia, el control emocional y el diseño de sistemas que permitan actuar incluso cuando disminuye la motivación.",
    audience: [],
    objectives: [
      "Convertir las primeras intenciones de cambio en una estructura diaria ordenada, medible y sostenible.",
    ],
    includes: [
      "Manual digital de aproximadamente 75 páginas.",
      "Sistemas de planificación.",
      "Herramientas de seguimiento.",
      "Ejercicios prácticos.",
      "Recursos para construir rutinas sostenibles.",
    ],
    topics: [
      "Formación avanzada de hábitos.",
      "Disciplina cotidiana.",
      "Productividad.",
      "Organización.",
      "Gestión del tiempo.",
      "Psicología conductual.",
      "Control emocional.",
      "Voluntad.",
      "Sistemas personales.",
      "Autoconfianza.",
    ],
    subtopics: [
      "Bucle del hábito.",
      "Recompensa y castigo.",
      "Rutinas.",
      "Sistemas de seguimiento.",
      "Agenda y planificación.",
      "Gestión de energía.",
      "Construcción de identidad.",
      "Constancia.",
      "Eliminación de distracciones.",
      "Gestión del entorno.",
      "Hábitos de alto rendimiento.",
      "Responsabilidad personal.",
    ],
    paymentUrl: "",
  },
  {
    id: 3,
    slug: "construccion",
    name: "Construcción",
    subtitle: "Diseñando una nueva identidad",
    duration: "1 mes",
    price: "$70.000 ARS",
    status: "en proceso",
    tagline: "Diseñando una nueva identidad.",
    shortDescription:
      "Profundizá en la psicología de tu conducta y convertí hábitos aislados en una identidad y un sistema de vida.",
    fullDescription:
      "Construcción trabaja sobre la identidad, el autocontrol, la resiliencia y la creación de sistemas personales más avanzados. Este nivel busca que los hábitos dejen de sentirse como obligaciones externas y comiencen a formar parte de la persona que el alumno está construyendo.",
    audience: [],
    objectives: [
      "Construir una identidad coherente con los hábitos, decisiones y objetivos que la persona desea mantener.",
    ],
    includes: [
      "Manual digital de aproximadamente 150 páginas.",
      "Ejercicios de cambio de identidad.",
      "Sistemas avanzados de objetivos.",
      "Herramientas de autocontrol.",
      "Evaluaciones de progreso personal.",
    ],
    topics: [
      "Psicología profunda.",
      "Neurociencia aplicada.",
      "Cambio de identidad.",
      "Dominio de hábitos.",
      "Productividad avanzada.",
      "Autocontrol.",
      "Liderazgo personal.",
      "Resiliencia.",
      "Pensamiento estratégico.",
      "Sistemas de vida.",
    ],
    subtopics: [
      "Corteza prefrontal.",
      "Sistema límbico.",
      "Dopamina avanzada.",
      "Adicciones conductuales.",
      "Mecanismos de recompensa.",
      "Sesgos psicológicos.",
      "Hábitos compuestos.",
      "Sistemas de objetivos.",
      "Filosofía estoica.",
      "Mentalidad de crecimiento.",
      "Gestión del fracaso.",
      "Gestión del estrés.",
      "Toma de decisiones complejas.",
      "Construcción de propósito.",
      "Entorno social.",
    ],
    paymentUrl: "",
  },
  {
    id: 4,
    slug: "transformacion",
    name: "Transformación",
    subtitle: "Reprogramando la mente",
    duration: "2 meses",
    price: "$100.000 ARS",
    status: "en proceso",
    tagline: "Reprogramando la mente.",
    shortDescription:
      "Identificá creencias, patrones emocionales y condicionamientos que limitan tu evolución personal.",
    fullDescription:
      "Transformación profundiza en la neurociencia del comportamiento, la psicología evolutiva, las creencias inconscientes y la gestión emocional avanzada. El objetivo es comprender patrones más profundos y trabajar sobre la forma en que la persona interpreta, enfrenta y construye su vida.",
    audience: [],
    objectives: [
      "Revisar los patrones internos que condicionan la conducta y construir una visión más consciente, estable y profunda.",
    ],
    includes: [
      "Manual digital de aproximadamente 100 páginas.",
      "Ejercicios de revisión de creencias.",
      "Herramientas de regulación emocional.",
      "Construcción de visión personal.",
      "Actividades de reflexión y aplicación.",
    ],
    topics: [
      "Neurociencia del comportamiento.",
      "Psicología evolutiva.",
      "Creencias limitantes.",
      "Reprogramación mental.",
      "Filosofía de vida.",
      "Relaciones humanas.",
      "Propósito.",
      "Espiritualidad.",
      "Liderazgo.",
      "Alto rendimiento.",
    ],
    subtopics: [
      "Sistema nervioso.",
      "Mecanismos de supervivencia.",
      "Trauma y aprendizaje.",
      "Creencias inconscientes.",
      "Psicología social.",
      "Persuasión.",
      "Influencia.",
      "Gestión emocional avanzada.",
      "Resiliencia extrema.",
      "Construcción de visión.",
      "Filosofía existencial.",
      "Significado y propósito.",
    ],
    paymentUrl: "",
  },
  {
    id: 5,
    slug: "maestria",
    name: "Maestría",
    subtitle: "El dominio de uno mismo",
    duration: "3 meses",
    price: "$140.000 ARS",
    status: "en proceso",
    tagline: "El dominio de uno mismo.",
    shortDescription:
      "Integrá disciplina, propósito, liderazgo y visión de largo plazo para alcanzar un nivel superior de dominio personal.",
    fullDescription:
      "Maestría representa la integración de todo el recorrido anterior. Trabaja sobre el propósito de vida, la excelencia personal, la toma de decisiones estratégicas, el liderazgo y la construcción de un impacto que trascienda los objetivos inmediatos.",
    audience: [],
    objectives: [
      "Integrar los conocimientos y herramientas del método en una vida con dirección, excelencia, liderazgo y propósito.",
    ],
    includes: [
      "Manual digital de aproximadamente 100 páginas.",
      "Actividades de propósito y misión personal.",
      "Herramientas de liderazgo.",
      "Planificación de largo plazo.",
      "Sistema de integración personal.",
    ],
    topics: [
      "Propósito de vida.",
      "Trascendencia.",
      "Liderazgo avanzado.",
      "Filosofía.",
      "Psicología aplicada.",
      "Desarrollo humano.",
      "Creación de sistemas.",
      "Influencia.",
      "Legado.",
      "Excelencia personal.",
    ],
    subtopics: [
      "Psicología del éxito.",
      "Toma de decisiones estratégicas.",
      "Liderazgo.",
      "Gestión de equipos.",
      "Propósito.",
      "Misión personal.",
      "Impacto social.",
      "Construcción de legado.",
      "Sabiduría práctica.",
      "Maestría emocional.",
      "Maestría cognitiva.",
      "Visión de largo plazo.",
    ],
    paymentUrl: "",
  },
  {
    id: 6,
    slug: "legado",
    name: "Legado",
    subtitle: "La evolución continúa",
    duration: "Personalizada",
    price: "Por invitación",
    status: "por invitación",
    tagline: "La evolución continúa.",
    shortDescription:
      "Una etapa exclusiva de acompañamiento personalizado, aplicación avanzada e impacto duradero.",
    fullDescription:
      "Legado no posee un manual escrito tradicional. Consiste en un proceso de acompañamiento personalizado y mentoría directa, orientado a la aplicación práctica, el desarrollo personal avanzado y la construcción de un impacto duradero.",
    audience: [],
    objectives: [
      "Transformar el crecimiento personal en liderazgo, servicio, impacto y legado.",
    ],
    includes: [
      "Acompañamiento personalizado.",
      "Mentoría directa.",
      "Evaluación individual.",
      "Desarrollo de proyectos y sistemas propios.",
      "Seguimiento estratégico.",
    ],
    topics: [],
    paymentUrl: "",
  },
];

export function getLevelBySlug(slug: string): Level | undefined {
  return levels.find((l) => l.slug === slug);
}
