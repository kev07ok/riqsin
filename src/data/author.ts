// Página /autor. Completá cursos, formaciones, experiencias y colaboradores
// reales. Si un array queda vacío, la sección correspondiente no se muestra
// (o muestra "Información en actualización" en el caso de education).
export interface EducationItem {
  title: string;
  institution: string;
  year: string;
  credentialUrl?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface CollaboratorItem {
  name: string;
  role: string;
  description: string;
}

export const author = {
  name: "Kevin Arozamena",
  role: "Creador y autor del Método RIQSIN",
  biography:
    "Kevin Arozamena es el creador y autor del Método RIQSIN, un sistema progresivo de desarrollo personal orientado al autoconocimiento, la disciplina, la construcción de hábitos, la psicología aplicada y el propósito.\n\nEl método nace a partir del estudio, la observación del comportamiento humano, la experiencia personal y la búsqueda de herramientas prácticas que puedan ayudar a las personas a construir cambios sostenibles.",
  education: [] as EducationItem[],
  experience: [] as ExperienceItem[],
  collaborators: [] as CollaboratorItem[],
  principles: [
    "Responsabilidad personal",
    "Disciplina",
    "Aprendizaje continuo",
    "Pensamiento crítico",
    "Aplicación práctica",
    "Evolución personal",
  ],
  disclaimer:
    "El Método RIQSIN no sustituye la atención psicológica, psiquiátrica, médica o profesional. Sus contenidos tienen fines educativos y de desarrollo personal.",
  socialLinks: {
    instagram: "",
    youtube: "",
    tiktok: "",
  },
};