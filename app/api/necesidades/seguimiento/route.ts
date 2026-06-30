import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get("codigo")?.trim().toUpperCase();

  if (!codigo) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: necesidad, error } = await supabase
    .from("necesidades")
    .select("estado, tipo_ayuda, urgencia, created_at, codigo_seguimiento, voluntario:voluntarios(nombre, telefono, profesion)")
    .eq("codigo_seguimiento", codigo)
    .single();

  if (error || !necesidad) {
    return NextResponse.json({ error: "No encontramos ningún caso con ese código" }, { status: 404 });
  }

  return NextResponse.json({ data: necesidad });
}
