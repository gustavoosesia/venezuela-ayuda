import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encontrarNecesidadPendiente, asignar } from "@/lib/matching";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  const { data: voluntario, error } = await supabase
    .from("voluntarios")
    .insert([{ ...body, estado: "disponible" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Al registrarse, revisar si hay casos pendientes que coincidan con su profesión
  // Se prioriza el caso más urgente (alta → media → baja)
  const necesidadId = await encontrarNecesidadPendiente(supabase, voluntario.profesion);

  if (necesidadId) {
    await asignar(supabase, necesidadId, voluntario.id);
    return NextResponse.json({ data: voluntario, asignado: true }, { status: 201 });
  }

  return NextResponse.json({ data: voluntario, asignado: false }, { status: 201 });
}

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("voluntarios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
