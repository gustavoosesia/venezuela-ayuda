import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarNecesidadPendiente, asignar } from "@/lib/matching";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const { data: voluntario, error } = await supabase
    .from("voluntarios")
    .select("id, profesion, estado")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !voluntario) {
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
    return NextResponse.json({ mensaje: "Disponible y asignado a un caso pendiente", asignado: true });
  }

  return NextResponse.json({ mensaje: "Marcado como disponible correctamente", asignado: false });
}
