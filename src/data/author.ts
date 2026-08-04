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
  role: "Creador de RIQSIN",
  biography:
    "Soy Kevin Arozamena, creador del método RIQSIN. Actualmente soy estudiante en la UNSAM y aspirante a creador de contenido. Todavía estoy construyendo mi camino, y RIQSIN es una parte fundamental de ese proceso.\n\nEste proyecto nace de mi propio interés por la disciplina, hábitos, organización y el crecimiento personal. Con el tiempo empecé a estudiar y aplicar herramientas que me ayudaron a mejorar mi vida, y quise convertir todo eso en un método claro para compartirlo con otras personas.\n\nMi objetivo es construir una comunidad enfocada en el desarrollo personal: tomar el control de su día a día y evolucionar de forma sostenida. No prometo atajos ni fórmulas mágicas. Sí comparto sistemas prácticos que se pueden aplicar y sostener en el tiempo.",
  education: [] as EducationItem[],
  experience: [] as ExperienceItem[],
  collaborators: [] as CollaboratorItem[],
  principles: [
    "Disciplina",
    "Constancia",
    "Responsabilidad",
    "Sistemas",
    "Mejora continua",
    "Autoconocimiento",
    "Acción",
    "Evolución",
  ],
  disclaimer:
    "El Método RIQSIN no sustituye la atención psicológica, psiquiátrica, médica o profesional. Sus contenidos tienen fines educativos y de desarrollo personal.",
  socialLinks: {
    instagram: "",
    youtube: "",
    tiktok: "",
  },
};
