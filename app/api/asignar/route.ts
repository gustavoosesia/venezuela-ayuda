import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarMejorVoluntario, asignar } from "@/lib/matching";
import { enviarEmailAsignacion, enviarEmailConfirmacionNecesidad } from "@/lib/email";

// Reintenta asignar todos los casos que siguen pendientes
export async function POST() {
  const supabase = getSupabase();

  const { data: pendientes, error } = await supabase
    .from("necesidades")
    .select("id, nombre, email, telefono, tipo_ayuda, descripcion, urgencia, codigo_seguimiento")
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

      const { data: voluntario } = await supabase
        .from("voluntarios")
        .select("nombre, email, telefono, profesion, pais")
        .eq("id", voluntarioId)
        .single();

      if (voluntario) {
        await Promise.all([
          enviarEmailAsignacion({
            nombreNecesitado: necesidad.nombre,
            emailNecesitado: necesidad.email,
            telefonoNecesitado: necesidad.telefono,
            tipoAyuda: necesidad.tipo_ayuda,
            descripcion: necesidad.descripcion,
            codigoSeguimiento: necesidad.codigo_seguimiento,
            voluntario,
          }),
          enviarEmailConfirmacionNecesidad({
            nombreNecesitado: necesidad.nombre,
            emailNecesitado: necesidad.email,
            tipoAyuda: necesidad.tipo_ayuda,
            codigoSeguimiento: necesidad.codigo_seguimiento,
            voluntario,
            asignado: true,
          }),
        ]).catch(() => {});
      }
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
