// Configuración global editable del sitio.
// - instagramUrl: enlace externo del botón/menú de Instagram.
// - supportEmail: correo de contacto público (dejar vacío si no querés mostrarlo).
// - mainDomain / alternateDomain: dominios de referencia (no rompen rutas internas).
export const siteConfig = {
  instagramUrl: "https://www.instagram.com/metodoriqsin/",
  instagramOfficialUrl: "https://www.instagram.com/metodoriqsin/",
  instagramPersonalUrl: "https://www.instagram.com/kev07_ok/",
  instagramOfficialHandle: "@metodoriqsin",
  instagramPersonalHandle: "@kev07_ok",
  supportEmail: "",
  mainDomain: "riqsin.com.ar",
  alternateDomain: "riqsin.ar",
  // PDF de la circular: reemplazar esta URL para cambiar el archivo descargable.
  // (se sube como asset y se pega acá la URL /__l5e/assets-v1/...)
  circularPdfUrl: "",
  circularPdfFileName: "RIQSIN-Circular.pdf",
};


// Utilidad: convierte 1..10 en número romano.
export function toRoman(num: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}