import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarMejorVoluntario, asignar } from "@/lib/matching";
import { enviarEmailAsignacion, enviarEmailConfirmacionNecesidad } from "@/lib/email";

function generarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O, 0, I, 1 para evitar confusión
  let codigo = "VSL-";
  for (let i = 0; i < 6; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return codigo;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  const codigoSeguimiento = generarCodigo();

  const { data: necesidad, error } = await supabase
    .from("necesidades")
    .insert([{ ...body, estado: "pendiente", codigo_seguimiento: codigoSeguimiento }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const voluntarioId = await encontrarMejorVoluntario(supabase, body.tipo_ayuda);

  if (voluntarioId) {
    await asignar(supabase, necesidad.id, voluntarioId);

    const { data: voluntario } = await supabase
      .from("voluntarios")
      .select("nombre, email, telefono, profesion, pais")
      .eq("id", voluntarioId)
      .single();

    await Promise.all([
      enviarEmailAsignacion({
        nombreNecesitado: body.nombre,
        emailNecesitado: body.email,
        telefonoNecesitado: body.telefono,
        tipoAyuda: body.tipo_ayuda,
        descripcion: body.descripcion,
        codigoSeguimiento,
        voluntario: voluntario!,
      }),
      enviarEmailConfirmacionNecesidad({
        nombreNecesitado: body.nombre,
        emailNecesitado: body.email,
        tipoAyuda: body.tipo_ayuda,
        codigoSeguimiento,
        voluntario,
        asignado: true,
      }),
    ]).catch(() => {});

    return NextResponse.json({ data: necesidad, asignado: true, codigoSeguimiento }, { status: 201 });
  }

  await enviarEmailConfirmacionNecesidad({
    nombreNecesitado: body.nombre,
    emailNecesitado: body.email,
    tipoAyuda: body.tipo_ayuda,
    codigoSeguimiento,
    asignado: false,
  }).catch(() => {});

  return NextResponse.json({ data: necesidad, asignado: false, codigoSeguimiento }, { status: 201 });
}

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("necesidades")
    .select("*, voluntario:voluntarios(nombre, email, telefono, profesion, pais)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
