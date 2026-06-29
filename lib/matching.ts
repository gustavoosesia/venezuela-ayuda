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

// Dado un tipo de ayuda, encuentra el mejor voluntario disponible con puntuación
export async function encontrarMejorVoluntario(
  supabase: SupabaseClient,
  tipo_ayuda: string
): Promise<string | null> {
  const { data: voluntarios } = await supabase
    .from("voluntarios")
    .select("id, idiomas, experiencia, pais")
    .eq("estado", "disponible")
    .ilike("profesion", `%${tipo_ayuda}%`);

  if (!voluntarios || voluntarios.length === 0) return null;

  const scored = voluntarios.map((v) => {
    let score = 0;

    // +3 si habla español (importante para comunicarse con venezolanos)
    if (v.idiomas?.includes("Español")) score += 3;

    // +2 si está en Latinoamérica (zona horaria compatible)
    const paisLower = (v.pais || "").toLowerCase();
    if (PAISES_LATAM.some((p) => paisLower.includes(p))) score += 2;

    // +0 a +3 según experiencia
    score += EXPERIENCIA_PUNTOS[v.experiencia] ?? 0;

    return { id: v.id as string, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

// Dado un voluntario recién registrado, encuentra el caso pendiente más urgente que coincida
export async function encontrarNecesidadPendiente(
  supabase: SupabaseClient,
  profesion: string
): Promise<string | null> {
  const { data } = await supabase
    .from("necesidades")
    .select("id, urgencia")
    .eq("estado", "pendiente")
    .ilike("tipo_ayuda", `%${profesion}%`);

  if (!data || data.length === 0) return null;

  // Ordenar: alta → media → baja
  data.sort(
    (a, b) =>
      (URGENCIA_ORDEN[a.urgencia] ?? 99) - (URGENCIA_ORDEN[b.urgencia] ?? 99)
  );

  return data[0].id;
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
      .update({ estado: "ocupado" })
      .eq("id", voluntarioId),
  ]);
}
