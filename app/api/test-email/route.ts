import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "your_resend_api_key_here") {
    return NextResponse.json({ error: "RESEND_API_KEY no configurada en .env.local" }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "Venezuela Se Levanta <onboarding@resend.dev>",
    to: "gustavooses.ia@gmail.com",
    subject: "Prueba de correo — Venezuela Se Levanta",
    html: "<p>Este es un correo de prueba. Si lo recibes, el sistema de emails está funcionando.</p>",
  });

  if (error) {
    return NextResponse.json({ error, apiKeyPrimeros8: apiKey.substring(0, 8) + "..." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, emailId: data?.id });
}
