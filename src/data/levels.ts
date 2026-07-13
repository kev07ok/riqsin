export type LevelStatus = "disponible" | "en proceso" | "por invitación";

export interface Level {
  id: number;
  slug: string;
  name: string;
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
  materials?: string[];
  access?: string;
  faq?: { question: string; answer: string }[];
  paymentUrl: string;
}

export const levels: Level[] = [
  {
    id: 1,
    slug: "despertar",
    name: "Despertar",
    duration: "2 semanas",
    price: "Precio a definir",
    status: "en proceso",
    tagline: "El comienzo de tu transformación.",
    shortDescription:
      "Una introducción práctica a la disciplina, la mentalidad y la construcción de hábitos.",
    fullDescription:
      "Despertar es el punto de partida del método RIQSIN. Aquí trabajamos la mentalidad inicial, los primeros hábitos y una estructura básica que te permita empezar a ordenar tu día a día sin depender de la motivación.",
    audience: [
      "Personas que quieren empezar a ordenar su vida.",
      "Personas que dependen demasiado de la motivación.",
      "Personas que necesitan una base clara y práctica.",
    ],
    objectives: [
      "Comprender cómo funcionan los hábitos.",
      "Crear una primera estructura personal.",
      "Completar un desafío inicial de disciplina.",
    ],
    includes: [
      "Guía digital.",
      "Planillas imprimibles.",
      "Seguimiento de hábitos.",
      "Primer desafío de disciplina.",
    ],
    topics: ["Mentalidad.", "Disciplina.", "Hábitos básicos.", "Seguimiento personal."],
    materials: ["Guía digital en PDF.", "Planillas de seguimiento.", "Checklist diario."],
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
    duration: "1 mes",
    price: "Precio a definir",
    status: "en proceso",
    tagline: "Construí una base que puedas sostener.",
    shortDescription:
      "Hábitos avanzados, rutinas y diferencias entre motivación y disciplina.",
    fullDescription:
      "Fundamentos te ayuda a consolidar los pilares que hacen sostenible cualquier cambio: rutinas, autoconocimiento y disciplina real más allá de la motivación.",
    audience: [],
    objectives: [],
    includes: [],
    topics: [],
    paymentUrl: "",
  },
  {
    id: 3,
    slug: "construccion",
    name: "Construcción",
    duration: "1 mes",
    price: "Precio a definir",
    status: "en proceso",
    tagline: "Convertí acciones aisladas en un sistema.",
    shortDescription: "Consolidación de hábitos y construcción de sistemas personales.",
    fullDescription:
      "En Construcción integramos tus hábitos en sistemas coherentes: agenda, energía, foco y toma de decisiones al servicio de tus objetivos.",
    audience: [],
    objectives: [],
    includes: [],
    topics: [],
    paymentUrl: "",
  },
  {
    id: 4,
    slug: "transformacion",
    name: "Transformación",
    duration: "2 meses",
    price: "Precio a definir",
    status: "en proceso",
    tagline: "Trabajá sobre los patrones que dirigen tu conducta.",
    shortDescription: "Psicología y neurociencia aplicadas al cambio personal.",
    fullDescription:
      "Transformación es una etapa profunda: identificamos patrones automáticos, creencias limitantes y respuestas emocionales para reescribirlas de forma consciente.",
    audience: [],
    objectives: [],
    includes: [],
    topics: [],
    paymentUrl: "",
  },
  {
    id: 5,
    slug: "maestria",
    name: "Maestría",
    duration: "3 meses",
    price: "Precio a definir",
    status: "en proceso",
    tagline: "Viví con intención, dirección y propósito.",
    shortDescription: "Propósito de vida, alto rendimiento y dominio personal.",
    fullDescription:
      "Maestría integra propósito, rendimiento y coherencia interna. El objetivo es vivir con dirección clara y sostener alto desempeño sin perder equilibrio.",
    audience: [],
    objectives: [],
    includes: [],
    topics: [],
    paymentUrl: "",
  },
  {
    id: 6,
    slug: "legado",
    name: "Legado",
    duration: "Personalizada",
    price: "Por invitación",
    status: "por invitación",
    tagline: "Transformá tu crecimiento en impacto.",
    shortDescription: "Una etapa exclusiva con acompañamiento directo.",
    fullDescription:
      "Legado es una etapa exclusiva, con acompañamiento cercano, pensada para quienes buscan trascender su propio proceso y generar impacto en otros.",
    audience: [],
    objectives: [],
    includes: [],
    topics: [],
    paymentUrl: "",
  },
];

export function getLevelBySlug(slug: string): Level | undefined {
  return levels.find((l) => l.slug === slug);
}