import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarNecesidadPendiente, asignar } from "@/lib/matching";
import { enviarEmailAsignacion, enviarEmailConfirmacionNecesidad } from "@/lib/email";

// PATCH /api/necesidades/[id] → marcar como completado y liberar al voluntario
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;
  const body = await req.json();

  // Si se completa el caso, liberar al voluntario asignado
  if (body.estado === "completado") {
    const { data: necesidad } = await supabase
      .from("necesidades")
      .select("voluntario_id")
      .eq("id", id)
      .single();

    if (necesidad?.voluntario_id) {
      // Liberar al voluntario
      await supabase
        .from("voluntarios")
        .update({ estado: "disponible" })
        .eq("id", necesidad.voluntario_id);

      // Inmediatamente revisar si hay casos pendientes para ese voluntario
      const { data: voluntario } = await supabase
        .from("voluntarios")
        .select("nombre, email, telefono, profesion, pais")
        .eq("id", necesidad.voluntario_id)
        .single();

      if (voluntario) {
        const necesidadPendienteId = await encontrarNecesidadPendiente(
          supabase,
          voluntario.profesion
        );
        if (necesidadPendienteId) {
          await asignar(supabase, necesidadPendienteId, necesidad.voluntario_id);

          const { data: necesidadPendiente } = await supabase
            .from("necesidades")
            .select("nombre, email, telefono, tipo_ayuda, descripcion, codigo_seguimiento")
            .eq("id", necesidadPendienteId)
            .single();

          if (necesidadPendiente) {
            await Promise.all([
              enviarEmailAsignacion({
                nombreNecesitado: necesidadPendiente.nombre,
                emailNecesitado: necesidadPendiente.email,
                telefonoNecesitado: necesidadPendiente.telefono,
                tipoAyuda: necesidadPendiente.tipo_ayuda,
                descripcion: necesidadPendiente.descripcion,
                codigoSeguimiento: necesidadPendiente.codigo_seguimiento,
                voluntario,
              }),
              enviarEmailConfirmacionNecesidad({
                nombreNecesitado: necesidadPendiente.nombre,
                emailNecesitado: necesidadPendiente.email,
                tipoAyuda: necesidadPendiente.tipo_ayuda,
                codigoSeguimiento: necesidadPendiente.codigo_seguimiento,
                voluntario,
                asignado: true,
              }),
            ]).catch(() => {});
          }
        }
      }
    }
  }

  const { data, error } = await supabase
    .from("necesidades")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
