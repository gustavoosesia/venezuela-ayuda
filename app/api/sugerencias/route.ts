import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { obtenerIp, rateLimitExcedido, esHoneypot } from "@/lib/antispam";

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

  const { sitio_web, ...datos } = body;
  void sitio_web; // honeypot — ya validado arriba, no es una columna real

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("sugerencias")
    .insert([datos])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sugerencias")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
