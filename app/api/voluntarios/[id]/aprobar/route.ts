import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarNecesidadPendiente, asignar } from "@/lib/matching";
import {
  enviarEmailAprobacionVoluntario,
  enviarEmailAsignacion,
  enviarEmailConfirmacionNecesidad,
} from "@/lib/email";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;

  const { data: voluntario, error } = await supabase
    .from("voluntarios")
    .update({ estado: "disponible" })
    .eq("id", id)
    .select("id, nombre, email, telefono, profesion, pais")
    .single();

  if (error || !voluntario) {
    return NextResponse.json({ error: "Voluntario no encontrado" }, { status: 404 });
  }

  await enviarEmailAprobacionVoluntario({ nombre: voluntario.nombre, email: voluntario.email }).catch(() => {});

  const necesidadId = await encontrarNecesidadPendiente(supabase, voluntario.profesion, voluntario.pais);
  if (necesidadId) {
    await asignar(supabase, necesidadId, voluntario.id);

    const { data: necesidad } = await supabase
      .from("necesidades")
      .select("nombre, email, telefono, tipo_ayuda, descripcion, codigo_seguimiento")
      .eq("id", necesidadId)
      .single();

    if (necesidad) {
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

    return NextResponse.json({ data: voluntario, asignado: true });
  }

  return NextResponse.json({ data: voluntario, asignado: false });
}
