import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const { data: voluntarios } = await supabase
    .from("voluntarios")
    .select("id, nombre, estado")
    .eq("email", email.toLowerCase().trim())
    .limit(1);

  const voluntario = voluntarios?.[0] ?? null;

  if (!voluntario) {
    return NextResponse.json({ error: "No encontramos un voluntario registrado con ese email" }, { status: 404 });
  }

  if (voluntario.estado === "inactivo") {
    return NextResponse.json({ mensaje: "Ya estás dado de baja" });
  }

  await supabase
    .from("voluntarios")
    .update({ estado: "inactivo" })
    .eq("id", voluntario.id);

  return NextResponse.json({ mensaje: "Dado de baja correctamente", nombre: voluntario.nombre });
}
