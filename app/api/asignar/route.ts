import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarMejorVoluntario, asignar } from "@/lib/matching";

// Reintenta asignar todos los casos que siguen pendientes
export async function POST() {
  const supabase = getSupabase();

  const { data: pendientes, error } = await supabase
    .from("necesidades")
    .select("id, tipo_ayuda, urgencia")
    .eq("estado", "pendiente")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!pendientes || pendientes.length === 0) {
    return NextResponse.json({ mensaje: "No hay casos pendientes", asignados: 0 });
  }

  // Ordenar por urgencia antes de procesar: alta → media → baja
  const orden: Record<string, number> = { alta: 0, media: 1, baja: 2 };
  pendientes.sort((a, b) => (orden[a.urgencia] ?? 99) - (orden[b.urgencia] ?? 99));

  let asignados = 0;
  let sinVoluntario = 0;

  for (const necesidad of pendientes) {
    const voluntarioId = await encontrarMejorVoluntario(supabase, necesidad.tipo_ayuda);
    if (voluntarioId) {
      await asignar(supabase, necesidad.id, voluntarioId);
      asignados++;
    } else {
      sinVoluntario++;
    }
  }

  return NextResponse.json({
    mensaje: `Reasignación completada`,
    asignados,
    sinVoluntario,
    total: pendientes.length,
  });
}
