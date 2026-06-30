import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase();
  const { id } = await params;

  const { data, error } = await supabase
    .from("voluntarios")
    .update({ estado: "inactivo" })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Voluntario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
