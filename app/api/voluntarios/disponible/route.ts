import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarNecesidadPendiente, asignar } from "@/lib/matching";
import { enviarEmailAsignacion, enviarEmailConfirmacionNecesidad } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const { data: voluntarios, error } = await supabase
    .from("voluntarios")
    .select("id, nombre, email, telefono, profesion, pais, estado")
    .eq("email", email.toLowerCase().trim())
    .limit(1);

  const voluntario = voluntarios?.[0] ?? null;

  if (error || !voluntario || !voluntario.id) {
    return NextResponse.json({ error: "No encontramos un voluntario registrado con ese email" }, { status: 404 });
  }

  if (voluntario.estado === "disponible") {
    return NextResponse.json({ mensaje: "Ya estás marcado como disponible" });
  }

  // Marcar disponible
  await supabase
    .from("voluntarios")
    .update({ estado: "disponible" })
    .eq("id", voluntario.id);

  // Buscar caso pendiente más urgente que coincida
  const necesidadId = await encontrarNecesidadPendiente(supabase, voluntario.profesion);
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

    return NextResponse.json({ mensaje: "Disponible y asignado a un caso pendiente", asignado: true });
  }

  return NextResponse.json({ mensaje: "Marcado como disponible correctamente", asignado: false });
}
