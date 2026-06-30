import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { obtenerIp, rateLimitExcedido, esHoneypot } from "@/lib/antispam";
import { subirFotoVoluntario } from "@/lib/foto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (esHoneypot(body)) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (rateLimitExcedido(obtenerIp(req))) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera un minuto e intenta de nuevo." },
      { status: 429 }
    );
  }

  const { foto_base64, ...datos } = body;

  // La foto es opcional: si falla la subida, el registro continúa sin foto.
  const fotoUrl = foto_base64 ? await subirFotoVoluntario(foto_base64).catch(() => null) : null;

  const supabase = getSupabase();

  // Los voluntarios nuevos quedan pendientes de revisión y solo reciben casos
  // una vez que un administrador aprueba su registro.
  const { data: voluntario, error } = await supabase
    .from("voluntarios")
    .insert([{ ...datos, foto_url: fotoUrl, estado: "pendiente_aprobacion" }])
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
