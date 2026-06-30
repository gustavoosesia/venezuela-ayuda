import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  // Los voluntarios nuevos quedan pendientes de revisión y solo reciben casos
  // una vez que un administrador aprueba su registro.
  const { data: voluntario, error } = await supabase
    .from("voluntarios")
    .insert([{ ...body, estado: "pendiente_aprobacion" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data: voluntario }, { status: 201 });
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
