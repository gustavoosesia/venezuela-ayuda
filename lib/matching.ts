import { SupabaseClient } from "@supabase/supabase-js";

const PAISES_LATAM = [
  "venezuela", "colombia", "ecuador", "perú", "peru", "chile", "argentina",
  "méxico", "mexico", "uruguay", "paraguay", "bolivia", "cuba",
  "república dominicana", "dominicana", "panamá", "panama", "costa rica",
  "guatemala", "honduras", "el salvador", "nicaragua",
];

const URGENCIA_ORDEN: Record<string, number> = { alta: 0, media: 1, baja: 2 };
const EXPERIENCIA_PUNTOS: Record<string, number> = {
  "Más de 10 años": 3,
  "5-10 años": 2,
  "3-5 años": 1,
  "1-3 años": 0,
  "Menos de 1 año": 0,
};

// Profesiones que requieren presencia física y no pueden ayudar a distancia
const PROFESIONES_PRESENCIALES = [
  "dentista", "mecánico", "mecanico", "electricista", "plomero",
  "bombero", "paramédico", "paramedico", "ingeniero/a civil", "arquitecto",
];

function requierePresencia(tipoAyuda: string): boolean {
  const t = (tipoAyuda || "").toLowerCase();
  return PROFESIONES_PRESENCIALES.some((p) => t.includes(p));
}

function voluntarioEnVenezuela(pais: string): boolean {
  return (pais || "").toLowerCase().includes("venezuela");
}

// Dado un tipo de ayuda, encuentra el mejor voluntario disponible con puntuación
export async function encontrarMejorVoluntario(
  supabase: SupabaseClient,
  tipo_ayuda: string
): Promise<string | null> {
  const { data: voluntarios } = await supabase
    .from("voluntarios")
    .select("id, idiomas, experiencia, pais, ultima_asignacion")
    .eq("estado", "disponible")
    .ilike("profesion", `%${tipo_ayuda}%`);

  if (!voluntarios || voluntarios.length === 0) return null;

  // Si la ayuda requiere presencia física, descartar voluntarios fuera de Venezuela
  const candidatos = requierePresencia(tipo_ayuda)
    ? voluntarios.filter((v) => voluntarioEnVenezuela(v.pais))
    : voluntarios;

  if (candidatos.length === 0) return null;

  const ahora = Date.now();

  const scored = candidatos.map((v) => {
    let score = 0;

    // +3 si habla español
    if (v.idiomas?.includes("Español")) score += 3;

    // +2 si está en Latinoamérica
    const paisLower = (v.pais || "").toLowerCase();
    if (PAISES_LATAM.some((p) => paisLower.includes(p))) score += 2;

    // +0 a +3 según experiencia
    score += EXPERIENCIA_PUNTOS[v.experiencia] ?? 0;

    // Tiempo sin recibir caso (ms) — más tiempo esperando = mayor prioridad en empate
    const esperando = v.ultima_asignacion
      ? ahora - new Date(v.ultima_asignacion).getTime()
      : Number.MAX_SAFE_INTEGER;

    return { id: v.id as string, score, esperando };
  });

  // Primero por score desc, luego por tiempo esperando desc (más tiempo = antes)
  scored.sort((a, b) => b.score - a.score || b.esperando - a.esperando);
  return scored[0].id;
}

// Dado un voluntario recién disponible, encuentra el caso pendiente más urgente que coincida.
// Si se indica el país del voluntario, se descartan casos que requieren presencia física
// cuando el voluntario no está en Venezuela.
export async function encontrarNecesidadPendiente(
  supabase: SupabaseClient,
  profesion: string,
  paisVoluntario?: string
): Promise<string | null> {
  const { data } = await supabase
    .from("necesidades")
    .select("id, urgencia, tipo_ayuda")
    .eq("estado", "pendiente")
    .ilike("tipo_ayuda", `%${profesion}%`);

  if (!data || data.length === 0) return null;

  const candidatas =
    paisVoluntario && !voluntarioEnVenezuela(paisVoluntario)
      ? data.filter((d) => !requierePresencia(d.tipo_ayuda))
      : data;

  if (candidatas.length === 0) return null;

  // Ordenar: alta → media → baja
  candidatas.sort(
    (a, b) =>
      (URGENCIA_ORDEN[a.urgencia] ?? 99) - (URGENCIA_ORDEN[b.urgencia] ?? 99)
  );

  return candidatas[0].id;
}

// Ejecuta la asignación entre una necesidad y un voluntario
export async function asignar(
  supabase: SupabaseClient,
  necesidadId: string,
  voluntarioId: string
) {
  await Promise.all([
    supabase
      .from("necesidades")
      .update({ estado: "asignado", voluntario_id: voluntarioId })
      .eq("id", necesidadId),
    supabase
      .from("voluntarios")
      .update({ estado: "ocupado", ultima_asignacion: new Date().toISOString() })
      .eq("id", voluntarioId),
  ]);
}
